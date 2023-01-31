const express = require("express");

require("dotenv").config();

const PORT = 3003;

const app = express();

const http = require("http");

app.use(express.json());

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

var i = 1;

var lobbies = [];

// ================= SOCKET ROOMS ================

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.join("room1");
  socket.to("room1").emit("hello");

  console.log(i + " connected");

  socket.nom = i;
  i++;

  socket.emit("lobbies list", lobbies);

  socket.on("new lobby", (lobby) => {
    lobbies.push(lobby);
    console.log(lobbies);
    io.emit("lobbies list", lobbies);
  });

  socket.on("join room", (roomName) => {
    socket.join(roomName);
    console.log(socket.rooms);
    console.log(socket.nom + " joined the lobby -> " + roomName);
    io.to(roomName).emit("player joined", socket.nom);
  });

  socket.on("disconnect", () => {
    console.log(socket.nom + " disconnected");
  });
});

// ==================== MY SQL ===================

var mysql = require("mysql");

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

con.connect(function (err) {
  if (err != null) {
    console.log(err);
  } else {
    console.log("Connected to database!");
  }
});

app.get("/getUsers", (req, res) => {
  con.query("SELECT * FROM users", function (err, result, fields) {
    var ret = {
      result: result,
    };

    res.send(JSON.stringify(ret));
  });
});

// ================ LISTEN SERVER ================

server.listen(PORT, () => {
  console.log("Listening on *:" + PORT);
});
