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
    origin: true,
    credentials: true,
  },
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

socketIO.on("connection", (socket) => {
  var socketId = socket.id;

  socket.join("chat-general");
  socketIO.to(`${socketId}`).emit("hello", "Welcome to the general chat");

  socket.data.nom = i;
  i++;

  socket.emit("lobbies list", lobbies);

  socket.on("new lobby", (lobby) => {
    let existeix = false;
    lobbies.forEach((element) => {
      if (element.lobby == lobby) {
        existeix = true;
      }
    });

    if (!existeix) {
      lobbies.push({
        lobby_name: lobby,
        members: [],
      });
    }

    sendLobbyList();
  });

  socket.on("hello", (m) => {
    sendLobbyList();
  });

  socket.on("join room", (data) => {
    socket.join(data.lobby_name);
    lobbies.forEach((lobby) => {
      if (lobby.lobby_name == data.lobby_name) {
        lobby.members.push({
          nom: socket.data.nom,
          rank: data.rank,
        });
      }
    });
    console.log(socket.data.nom + " joined the lobby -> " + data.lobby_name);
    socketIO.to(data.lobby_name).emit("player joined", socket.data.nom);

    sendUserList(data.lobby_name);
  });

  socket.on("leave lobby", (roomName) => {
    lobbies.forEach((lobby, ind_lobby) => {
      if (lobby.lobby_name == roomName) {
        lobby.members.forEach((member, index) => {
          if (member.nom == socket.data.nom) {
            lobby.members.splice(index, 1);
          }
        });
      }
      if (lobby.members.length == 0) {
        lobbies.splice(ind_lobby, 1);
      }
    });

    socket.leave(roomName);
    sendUserList(roomName);
    sendLobbyList();
  });

  socket.on("disconnect", () => {
    console.log(socket.data.nom + " disconnected");
  });
});

async function sendLobbyList() {
  await socketIO.emit("lobbies list", lobbies);
}

async function sendUserList(room) {
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
