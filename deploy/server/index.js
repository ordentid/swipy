const express = require('express');
const app = express();
// eslint-disable-next-line new-cap
const server = require('http').Server(app);
const io = require('socket.io')(server);
const swip = require('../../src/server/index.js');

app.use(express.static(`${__dirname}/../client`));


server.listen(3000);

// eslint-disable-next-line no-console
console.log('started server: http://localhost:3000');
