const express = require("express");
const cors = require("cors");
const sessions = require("express-session");
var cookieParser = require("cookie-parser");
const app = express();
const PORT = 4000;
const http = require("http");
require("dotenv").config();
const server = http.createServer(app);
const axios = require("axios");

const maxMembersOnLobby = 4;
const laravelRoute = "http://localhost:8000/";

var lobbies = [];
var sesiones = [];
// ================= SOCKET ROOMS ================

const socketIO = require("socket.io")(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// ================= SAVE TOKEN AS COOKIE ================
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
});
app.use(
  sessions({
    key: "session.sid",
    secret: "soy secreto",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 600000,
    },
  })
);

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      console.log(origin);
      return callback(null, true);
    },
  })
);

// app.post("/sendToken", (req, res) => {
//   var user = {};
//   // ================= FETCH TO BACK WITH AXIOS ================
//   let token = req.cookies.token;
// });

socketIO.on("connection", (socket) => {
  console.log("CONECTADO");
  var socketId = socket.id;
  const ses = sesiones;

  socket.join("chat-general");
  socketIO.to(`${socketId}`).emit("hello", "Welcome to the general chat");

  // socket.data.name = i;
  // i++;

  socket.on("send token", (data) => {
    let token = data.token;

    axios
      .post(laravelRoute + "index.php/getUserInfo", {
        token: token,
      })
      .then(function (response) {
        var user = {
          token: token,
          userId: response.data.id,
          userName: response.data.name,
        };
        console.log(user);
        sesiones.push(user);

        socket.data.userId = response.data.id;
        socket.data.name = response.data.name;
        socket.data.avatar = response.data.avatar;
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  socket.on("hello", (m) => {
    sendLobbyList();
  });

  sendLobbyList();

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
        messages: [],
      });
    }

    sendLobbyList();
  });

  socket.on("join room", (data) => {
    lobbies.forEach((lobby) => {
      if (lobby.lobby_name == data.lobby_name) {
        if (lobby.members.length == maxMembersOnLobby) {
          socketIO.to(`${socketId}`).emit("LOBBY_FULL_ERROR", {
            message: "The selected lobby is full",
          });
        } else {
          lobby.members.push({
            nom: socket.data.name,
            rank: data.rank,
          });
        }
      }
    });
    socket.join(data.lobby_name);
    socket.data.current_lobby = data.lobby_name;
    console.log(socket.data.name + " joined the lobby -> " + data.lobby_name);
    socketIO.to(data.lobby_name).emit("player joined", socket.data.name);

    sendUserList(data.lobby_name);
    sendMessagesToLobby(data.lobby_name);
  });

  socket.on("leave lobby", (roomName) => {
    leaveLobby(socket);
    sendUserList(roomName);
    sendLobbyList();
  });

  socket.on("chat message", (data) => {
    // console.log(data.message);
    // console.log(data.room);
    lobbies.forEach((element) => {
      if (element.lobby_name == data.room) {
        element.messages.push(socket.data.name + ": " + data.message);
      }
    });
    sendMessagesToLobby(data.room);
    //
  });

  socket.on("start_game", () => {
    lobbies.forEach((lobby) => {
      console.log(socket.data.lobby_name);
      if (lobby.lobby_name == socket.data.lobby_name) {
        socketIO.to(lobby.lobby_name).emit("game_started");
      }
    });
    axios
      .get(laravelRoute + "index.php/startGame")
      .then(function (response) {
        // console.log(response);
        lobbies.forEach((lobby) => {
          if (lobby.lobby_name == socket.data.lobby_name) {
            lobby.game_data = response.data;
            // socketIO.to(lobby.lobby_name).emit("game_started");
            // console.log(lobby.lobby_name);
            socket.data.gameId = response.data.gameId;
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  socket.on("disconnect", () => {
    console.log(socket.data.name + " disconnected");
    leaveLobby(socket);
  });
});

async function leaveLobby(socket) {
  lobbies.forEach((lobby, ind_lobby) => {
    if (lobby.lobby_name == socket.data.current_lobby) {
      lobby.members.forEach((member, index) => {
        if (member.nom == socket.data.name) {
          lobby.members.splice(index, 1);
        }
      });
    }
    if (lobby.members.length == 0) {
      lobbies.splice(ind_lobby, 1);
    }
  });

  socket.leave(socket.data.current_lobby);
  sendLobbyList();
}

function sendMessagesToLobby(lobby) {
  lobbies.forEach((element) => {
    if (element.lobby_name == lobby) {
      socketIO.sockets.in(lobby).emit("lobby-message", {
        messages: element.messages,
      });
    }
  });
}

async function sendLobbyList() {
  await socketIO.emit("lobbies list", lobbies);
}

async function sendUserList(room) {
  var list = [];

  const sockets = await socketIO.in(room).fetchSockets();

  sockets.forEach((element) => {
    // console.log(socketIO.sockets.sockets.get(element.id).data.name);
    list.push({
      name: socketIO.sockets.sockets.get(element.id).data.name,
      avatar: socketIO.sockets.sockets.get(element.id).data.avatar,
    });
  });

  socketIO.to(room).emit("lobby user list", {
    list: list,
    message: "user list",
  });
}

// ==================== MY SQL ===================

// var mysql = require("mysql");

// var con = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_DATABASE,
// });

// con.connect(function (err) {
//   if (err != null) {
//     console.log(err);
//   } else {
//     console.log("Connected to database!");
//   }
// });

// ================ LISTEN SERVER ================

server.listen(PORT, () => {
  console.log("Listening on *:" + PORT);
});
