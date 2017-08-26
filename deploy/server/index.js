const express = require('express');
const parser = require('body-parser');
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
  bca.registerUser(req, res);
}

function getUserService (req, res) {
  bca.getUser(req, res);
}

function updateUserService (req, res) {
  bca.updateUser(req, res);
}

function postTopUp (req, res) {
  bca.postTopUp(req, res);
}

function queueService (req, res) {
  console.log(res);
}

function tokenPage (req, res) {
  bca.getAccessToken(function (data) {
    res.send(data);
  });
}

app.use(parser.urlencoded({ extended: true }));

app.get('/', indexPage);
app.get('/io', ioPage);
app.post('/api/register', registerService);
app.get('/api/users/:id', getUserService);
app.post('/api/users/:id', updateUserService);
app.post('/api/queue', queueService);
app.post('/api/topup/:id', postTopUp);
app.post('/token', tokenPage);
// app.get('/test-signature', function(req, res){
//   bca.solveSignature(res);
// });
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
