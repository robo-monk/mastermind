var express = require("express");
var http = require("http");
var gameSocket = require("./gameSocket/socket.js")

var port = process.argv[2] || 3000 ;
var app = express();

app.use(express.static(__dirname + "/public"));

// ROUTES
app.get('/', function(req, res, next) {
  console.log('visited /root')
  res.sendFile("splash.html", {root: "./public"})
  // res.render('play', { title: 'BigBrain' });
})

app.get('/play', function(req, res, next) {
  console.log('visited /play')
  res.sendFile("game.html", {root: "./public"})
  // res.render('play', { title: 'BigBrain' });
})

const server = http.createServer(app);
const socket = gameSocket.create(server)

server.listen(port);
