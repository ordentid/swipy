const express = require('express');
const app = express();
// eslint-disable-next-line new-cap
const server = require('http').Server(app);
const io = require('socket.io')(server);
const swip = require('../../src/server/index.js');
const bca = require('./bca-call.js');
// app.use(express.static(`${__dirname}/../client`));

function indexPage (req, res) {
  res.send('index.html');
}

function ioPage (req, res) {
  console.log(io);
}

function registerService (req, res) {
  console.log(res); 
}

function queueService (req, res) {
  console.log(res);
}

function tokenPage (req, res) {
  res.send(bca.getAccessToken);
}

app.get('/', indexPage);
app.get('/io', ioPage);
app.post('/api/register', registerService);
app.post('/api/queue', queueService);
app.get('/token', tokenPage);
// - page-register
// - page-menu (pilih tipe transaksi)
// - page-gesture
// - page-pilih-nominal
// - page-swip
// - page-list-transaction (daftar transaksi yg on-going/udah selesai
// - page-list-loan (daftar yg minjem ke dia, sama daftar dia pinjem ke siapa)


server.listen(3000);

// eslint-disable-next-line no-console
console.log('started server: http://localhost:3000');
