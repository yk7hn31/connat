const http = require('http');
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const { Server } = require('socket.io');

const session = require('./lib/session');
const _ = require('./lib/_');

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

app.get('/', (req, res) => {
  _.send('app', { res });
});

server.listen(PORT, () => console.log('Server running on port 80'));