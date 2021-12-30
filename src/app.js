const http = require('http');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const { Server } = require('socket.io');

const session = require('./lib/session');
const _ = require('./lib/_');

const account = require('./router/account');
const chat = require('./router/chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 80 || process.env.PORT;

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
  _.send('app', { res });
});

io.on('connection', socket => {
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));