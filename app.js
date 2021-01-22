var express = require("express");
var http = require("http");
var gameSocket = require("./gameSocket/socket.js")

var port = process.env.PORT || process.argv[2] || 3000 ;
var app = express();

app.use(express.static(__dirname + "/public"));

// ROUTES
app.set('view engine', 'ejs')
app.get('/', function(req, res) {
  res.render('splash.ejs', {
    active: gameSocket.info().active,
    coderWins: gameSocket.info().coderWins,
    mindWins: gameSocket.info().mindWins
  });
})

app.get('/play', function(req, res, next) {
  console.log('visited /play')
  res.sendFile("game.html", {root: "./public"})
})

const server = http.createServer(app);
const socket = gameSocket.create(server)

server.listen(port);
