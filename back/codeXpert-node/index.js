const express = require("express");

require("dotenv").config();

const PORT = 4000;

const app = express();

const http = require("http");

const cors = require("cors");

app.use(cors());

app.use(express.json());

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

var i = 1;

var lobbies = [];

// ================= SOCKET ROOMS ================

const socketIO = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`🤢: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("😒: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

socketIO.on("connection", (socket) => {
  var socketId = socket.id;

  console.log("general socket connected!!");
  socket.join("chat-general");
  socketIO.to(`${socketId}`).emit("hello", "Welcome to the general chat");

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

    socketIO.emit("lobbies list", lobbies);
  });

  socket.on("hello", (m) => {
    socketIO.emit("lobbies list", lobbies);
  });

  socket.on("join room", (roomName) => {
    socket.join(roomName);
    console.log(socket.rooms);
    console.log(socket.data.nom + " joined the lobby -> " + roomName);
    socketIO.to(roomName).emit("player joined", socket.data.nom);

    sendLobbyList(roomName);
  });

  socket.on("leave lobby", (roomName) => {
    socket.leave(roomName);

    sendLobbyList(roomName);
  });

  // =======================================AMAE=========================================================================================

  socket.on('chat message', (data) => {
    console.log('mensaje: ' + data.message + '| room: ' + data.room);
    io.emit('chat message', data.message);
  });

  // ====================================FinDeAmae============================================================

  socket.on("disconnect", () => {
    console.log(socket.data.nom + " disconnected");
  });
});

async function sendLobbyList(room) {
  var list = [];

  const sockets = await socketIO.in(room).fetchSockets();

  sockets.forEach((element) => {
    console.log(socketIO.sockets.sockets.get(element.id).data.nom);
    list.push(socketIO.sockets.sockets.get(element.id).data.nom);
  });

  socketIO.emit("lobby user list", {
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


