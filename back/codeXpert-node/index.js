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
const laravelRoute = "http://127.0.0.1:8000/";

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
        // console.log(user);
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
            idUser: socket.data.userId,
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
      // console.log(socket.data.lobby_name);
      if (lobby.lobby_name == socket.data.current_lobby) {
        socketIO.to(lobby.lobby_name).emit("game_started");
        startGame(lobby.lobby_name);
      }
    });
  });

  async function startGame(room) {
    await axios
      .get(laravelRoute + "index.php/startGame")
      .then(function (response) {
        // console.log(response.data);
        // console.log(response);
        lobbies.forEach((lobby) => {
          if (lobby.lobby_name == room) {
            lobby.game_data = response.data;

            // console.log(room);
            setGameData(response.data, room);

            socketIO.to(room).emit("game_started");
            console.log(lobby.game_data);
            socketIO.to(room).emit("question_data", {
              statement: lobby.game_data.questions[0].statement,
              inputs: lobby.game_data.questions[0].inputs,
              output: lobby.game_data.questions[0].outputs[0],
            });
            enviarDadesGame(room);
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function enviarDadesGame(room) {
    var members;
    var idGame;

    lobbies.forEach((lobby) => {
      if (lobby.lobby_name == room) {
        members = lobby.members;
        idGame = lobby.game_data.idGame;
        console.log(members);
      }
    });
    await axios
      .post(laravelRoute + "index.php/setUserGame", {
        users: members,
        idGame: idGame,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    // const dades = new FormData();
    // dades.append("name", dadesname);
  }

  async function updateUserLvl(room) {
    var members;
    var idGame;

    lobbies.forEach((lobby) => {
      if (lobby.lobby_name == room) {
        members = lobby.members;
        idGame = lobby.game_data.idGame;
        console.log(""+members);
      }
    });
    await axios
      .post(laravelRoute + "index.php/updateUserLvl", {
        users: members,
        idGame: idGame,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // const dades = new FormData();
    // dades.append("name", dadesname);
  }

  async function setGameData(game_data, room) {
    const sockets = await socketIO.in(room).fetchSockets();

    sockets.forEach((element) => {
      socketIO.sockets.sockets.get(element.id).data.game_data = game_data;
      socketIO.sockets.sockets.get(element.id).data.idQuestion =
        game_data.questions[0].id;
      socketIO.sockets.sockets.get(element.id).data.question_at = 0;
      socketIO.sockets.sockets.get(element.id).data.hearts_remaining = 3;
      socketIO.sockets.sockets.get(element.id).data.idGame = game_data.idGame;
    });
  }

  socket.on("check_answer", (data) => {
    /*
    console.log(
      "idQuestion: " + socket.data.idQuestion,
      "idGame: " + socket.data.game_data.idGame,
      "idUser: " + socket.data.userId,
      "evalRes: " + data.resultsEval,
      "evalPassed: " + data.evalPassed
    );
    */
    axios
      .post(laravelRoute + "index.php/checkAnswer", {
        idQuestion: socket.data.idQuestion,
        idGame: socket.data.game_data.idGame,
        idUser: socket.data.userId,
        evalRes: data.resultsEval,
        evalPassed: data.evalPassed,
      })
      .then(function (response) {
        var user_game = response.data.user_game;
        var game = response.data.game;
        if (response.data.correct) {
          socket.data.question_at = user_game.question_at;
          // console.log(socket.data);
          // Only passes if not dead
          if (user_game.finished) {
            // Finish but still don't know if they won
            if (game.winner_id != undefined) {
              setWinnerId(socket.data.userId);
              // console.log(lobbies);

              updateUserLvl(socket.data.current_lobby)
              socketIO.to(socket.data.current_lobby).emit("game_over", {
                message: `${socket.data.name} won the game`,
              });

              // AXIOS to updateUserLvl LO MISMO QUE EN SETUSERGAME
              socketIO.to(socket.id).emit("user_finished", {
                message: `YOU WON`,
                stats: {
                  hearts_remaining: user_game.hearts_remaining,
                  perks_used: user_game.perks_used,
                  question_at: socket.data.question_at,
                },
              });
            } else {
              // FUTURO uwu
            }
          } else {
            sendQuestionDataToUser(
              socket.id,
              socket.data.question_at,
              socket.data.current_lobby
            );
          }
        } else {
          if (user_game.dead) {
            socketIO.to(socket.id).emit("user_finished", {
              message: `YOU LOST`,
              stats: {
                hearts_remaining: user_game.hearts_remaining,
                perks_used: user_game.perks_used,
                question_at: user_game.question_at,
              },
            });
          }
        }
        // console.log(response.data);
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

function sendQuestionDataToUser(socketId, questionIndex, currentLobby) {
  lobbies.forEach((lobby) => {
    if (lobby.lobby_name == currentLobby) {
      socketIO.to(socketId).emit("question_data", {
        statement: lobby.game_data.questions[questionIndex].statement,
        inputs: lobby.game_data.questions[questionIndex].inputs,
        output: lobby.game_data.questions[questionIndex].outputs[0],
      });
    }
  });
}

function setWinnerId(winnerId, currentLobby) {
  lobbies.forEach((lobby) => {
    if (lobby.lobby_name == currentLobby) {
      lobby.game_data.winner = winnerId;
    }
  });
}

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
