const http = require('http');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const { Server } = require('socket.io');

const session = require('./lib/session');
const sql = require('./lib/mysql');
const _ = require('./lib/_');

const account = require('./router/account');
const chat = require('./router/chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 80 || process.env.PORT;
let userListObject = {};

app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(compression());
app.use(session());
app.use(express.static('./public'));
app.use('/account', account);
app.use('/chat', chat);

app.get('*', (req, res, next) => {
  req.session.username ? next() : res.redirect('/account/signin');
});

app.get('/', (req, res) => {
  _.send('app', { res, repl: { base: [req.session.username] } });
});

io.on('connection', (socket) => {
  socket.on('joinDM', (data) => {
    if (userListObject[socket.id]) socket.leave(userListObject[socket.id].room);
    socket.join(data.room);
    userListObject[socket.id] = data;
  });

  socket.on('clientMessage', ({ content, username }) => {
    if (userListObject[socket.id]) {
      const time = _.getDate();
      sql.async.query('insert into dm_history (dm, username, message) values (?, ?, ?)', [userListObject[socket.id].room, username, content]);
      io.to(userListObject[socket.id].room).emit('serverMessage', { content, username, time });
    }
  });

  socket.on('disconnect', () => {
    delete userListObject[socket.id];
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));