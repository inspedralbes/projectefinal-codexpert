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
  var socketId = socket.id;

  console.log("general socket connected!!");
  socket.join("chat-general");
  io.to(`${socketId}`).emit("hello", "Welcome to the general chat");

  console.log(socketId + " connected");

  socket.data.nom = i;
  i++;

  socket.emit("lobbies list", lobbies);

  socket.on("new lobby", (lobby) => {
    let existeix = false;
    lobbies.forEach((element) => {
      if (element == lobby) {
        existeix = true;
      }
    });

    if (!existeix) {
      lobbies.push(lobby);
    }

    io.emit("lobbies list", lobbies);
  });

  socket.on("join room", (roomName) => {
    socket.join(roomName);
    console.log(socket.rooms);
    console.log(socket.data.nom + " joined the lobby -> " + roomName);
    io.to(roomName).emit("player joined", socket.data.nom);

    sendLobbyList(roomName);
  });

  socket.on("leave lobby", (roomName) => {
    socket.leave(roomName);

    sendLobbyList(roomName);
  });

  socket.on("disconnect", () => {
    console.log(socket.data.nom + " disconnected");
  });
});

async function sendLobbyList(room) {
  var list = [];

  const sockets = await io.in(room).fetchSockets();

  sockets.forEach((element) => {
    console.log(io.sockets.sockets.get(element.id).data.nom);
    list.push(io.sockets.sockets.get(element.id).data.nom);
  });

  io.emit("lobby user list", {
    list: list,
    message: "lista en teoria",
  });
}

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
