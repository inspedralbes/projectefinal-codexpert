const express = require("express");
const cors = require("cors");
const sessions = require("express-session");
var cookieParser = require("cookie-parser");
const app = express();
const PORT = 7500;
const host = '0.0.0.0';
const http = require("http");
require("dotenv").config();
const server = http.createServer(app);
const axios = require("axios");

const maxMembersOnLobby = 4;
const laravelRoute = "http://127.0.0.1:8000/index.php/";

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

const defaultSettings = {
  gameDuration: 600,
  heartAmount: 5,
  unlimitedHearts: false
};

const maxSettings = {
  minTime: 300,
  maxTime: 3600,
  minHeartAmount: 1,
  maxHeartAmount: 99,
};

socketIO.on("connection", (socket) => {
  var socketId = socket.id;
  socket.data.current_lobby = null;

  socket.join("chat-general");

  // socket.data.name = i;
  // i++;

  socket.on("send_token", (data) => {
    let token = data.token;

    axios
      .post(laravelRoute + "getUserInfo", {
        token: token,
      })
      .then(function (response) {
        var user = {
          token: token,
          userId: response.data.id,
          userName: response.data.name,
        };
        sesiones.push(user);

        socket.data.userId = response.data.id;
        socket.data.name = response.data.name;
        socket.data.avatar = response.data.avatar;
        socket.data.hearts_remaining = -1
        socket.data.question_at = -1
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  socket.on("hello_firstTime", () => {
    if (socket.data.current_lobby != null) {
      socket.emit("YOU_ARE_ON_LOBBY", {
        lobby_name: socket.data.current_lobby
      })
    } else {
      sendLobbyList();
    }
  });

  sendLobbyList();

  socket.on("lobby_data_pls", () => {
    sendUserList(socket.data.current_lobby);
    sendMessagesToLobby(socket.data.current_lobby);
  })

  socket.on("new_lobby", (lobby) => {
    let existeix = false;
    lobbies.forEach((element) => {
      if (element.lobby_name == lobby) {
        existeix = true;
      }
    });

    if (!existeix) {
      lobbies.push({
        lobby_name: lobby,
        members: [],
        messages: [],
        settings: {
          gameDuration: defaultSettings.gameDuration,
          heartAmount: defaultSettings.heartAmount,
          unlimitedHearts: defaultSettings.unlimitedHearts
        }
      });
    }
  });

  socket.on("join_room", (data) => {
    let settings;
    var disponible = true;
    var hayOwner = false;

    lobbies.forEach((lobby) => {
      if (lobby.lobby_name == data.lobby_name) {
        if (lobby.members.length == maxMembersOnLobby) {
          socketIO.to(`${socketId}`).emit("LOBBY_FULL_ERROR", {
            message: "The selected lobby is full",
          });
        } else {
          lobby.members.forEach(member => {
            if (member.nom == socket.data.name) {
              disponible = false;
            }

            if (member.rank == "Owner" && data.rank == "Owner") {
              hayOwner = true;
              disponible = false;
            }
          });

          if (disponible) {
            lobby.members.push({
              nom: socket.data.name,
              rank: data.rank,
              idUser: socket.data.userId,
            });
            settings = lobby.settings
          } else {
            if (!hayOwner) {
              socketIO.to(`${socketId}`).emit("ALREADY_ON_LOBBY", {
                message: "YOU ARE ALREADY ON LOBBY",
              });
            } else {
              socketIO.to(`${socketId}`).emit("LOBBY_ALREADY_EXISTS", {
                message: "THE LOBBY YOU TRIED TO CREATE ALREADY EXISTS",
              });
            }

          }
        }
      }
    });

    if (disponible) {
      socket.join(data.lobby_name);
      socket.data.current_lobby = data.lobby_name;
      console.log(socket.data.name + " joined the lobby -> " + data.lobby_name);
      addMessage({
        nickname: "ingame_events",
        message: `${socket.data.name} joined the lobby.`,
        avatar: socket.data.avatar
      }, socket.data.current_lobby)

      sendUserList(data.lobby_name);
      sendMessagesToLobby(data.lobby_name);
      sendLobbyList();
      if (data.rank == "Owner") {
        if (settings != null) {
          socketIO.to(socket.id).emit("show_settings", {
            show: true,
          });

          socketIO.to(socket.id).emit("lobby_settings", settings);
        }
      }
    }
  });

  socket.on("leave_lobby", () => {
    roomName = socket.data.current_lobby
    leaveLobby(socket);
    sendUserList(roomName);
    sendLobbyList();
  });

  socket.on("chat_message", (data) => {
    addMessage({
      nickname: socket.data.name,
      message: data.message,
      avatar: socket.data.avatar
    }, data.room);
  });

  socket.on("start_game", () => {
    lobbies.forEach((lobby) => {
      if (lobby.lobby_name == socket.data.current_lobby) {
        socketIO.to(lobby.lobby_name).emit("game_started");
        startGame(lobby.lobby_name);
      }
    });
  });

  socket.on("check_answer", (data) => {
    axios
      .post(laravelRoute + "checkAnswer", {
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
          addMessage({
            nickname: "ingame_events",
            message: `${socket.data.name} answered question ${user_game.question_at} correctly.`,
            avatar: socket.data.avatar
          }, socket.data.current_lobby)

          socket.data.question_at = user_game.question_at;
          lobbies.forEach((lobby) => {
            if (lobby.lobby_name == socket.data.current_lobby) {
              if (socket.data.question_at < 5) {
                socket.data.idQuestion = lobby.game_data.questions[socket.data.question_at].id;
              }
            }
          });

          sendUserList(socket.data.current_lobby)
          // Only passes if not dead
          if (user_game.finished) {
            // Finish but still don't know if they won
            if (game.winner_id != undefined) {
              setWinnerId(socket.data.userId);

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
          addMessage({
            nickname: "ingame_events",
            message: `${socket.data.name} answered question ${user_game.question_at + 1} wrong.`,
            avatar: socket.data.avatar
          }, socket.data.current_lobby)

          socket.data.hearts_remaining--
          sendUserList(socket.data.current_lobby)

          if (user_game.dead) {
            addMessage({
              nickname: "ingame_events",
              message: `${socket.data.name} has lost!`,
              avatar: socket.data.avatar
            }, socket.data.current_lobby)

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
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  socket.on("save_settings", (data) => {
    let valid = true;
    lobbies.forEach((lobby) => {
      if (lobby.lobby_name == socket.data.current_lobby) {
        if (data.gameDuration < maxSettings.minTime) {
          socketIO.to(socket.id).emit("GAME_TIME_UNDER_MIN", {
            min: maxSettings.minTime,
          });

          valid = false;
        } else if (data.gameDuration > maxSettings.maxTime) {
          socketIO.to(socket.id).emit("GAME_TIME_ABOVE_MAX", {
            max: maxSettings.maxTime,
          });

          valid = false;
        }

        if (valid) {
          if (data.heartAmount < maxSettings.minHeartAmount) {
            socketIO.to(socket.id).emit("HEARTS_AMT_UNDER_MIN", {
              min: maxSettings.minHeartAmount,
            });

            valid = false;
          } else if (data.heartAmount > maxSettings.maxHeartAmount) {
            socketIO.to(socket.id).emit("HEARTS_AMT_UNDER_MIN", {
              max: maxSettings.maxHeartAmount,
            });

            valid = false;
          }
        }

        if (valid) {
          lobby.settings = data;
        }
        socketIO.to(socket.id).emit("starting_errors", {
          valid: valid,
        });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.data.name + " disconnected");
    leaveLobby(socket);
  });
});

function addMessage(msgData, room) {
  lobbies.forEach((lobby) => {
    if (lobby.lobby_name == room) {
      lobby.messages.push(msgData);
    }
  });
  sendMessagesToLobby(room);
}

async function startGame(room) {
  await axios
    .get(laravelRoute + "startGame")
    .then(function (response) {
      lobbies.forEach((lobby) => {
        if (lobby.lobby_name == room) {
          lobby.game_data = response.data;

          setGameData(response.data, room);

          socketIO.to(room).emit("game_started");
          socketIO.to(room).emit("lobby_name", {
            lobby: room
          });
          socketIO.sockets.in(room).emit("lobby_message", {
            messages: lobby.messages,
          });
          sendUserList(room)
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
    }
  });
  await axios
    .post(laravelRoute + "setUserGame", {
      users: members,
      idGame: idGame,
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function updateUserLvl(room) {
  var members;
  var idGame;

  lobbies.forEach((lobby) => {
    if (lobby.lobby_name == room) {
      members = lobby.members;
      idGame = lobby.game_data.idGame;
    }
  });
  await axios
    .post(laravelRoute + "updateUserLvl", {
      users: members,
      idGame: idGame,
    })
    .then(function (response) {
      setUserLvl(response.data, room)
      sendUserStats(room)
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function sendUserStats(room) {
  const sockets = await socketIO.in(room).fetchSockets();

  lobbies.forEach(lobby => {
    if (lobby.lobby_name == room) {
      lobby.members.forEach(member => {
        sockets.forEach((socket) => {
          if (socket.data.userId == member.idUser) {
            socketIO.to(socket.id).emit("stats", member)
          }
        });
      });
    }
  });
}

function setUserLvl(data, room) {

  lobbies.forEach((lobby) => {

    if (lobby.lobby_name == room) {
      data.forEach(statUser => {
        lobby.members.forEach(member => {
          if (statUser.idUser == member.idUser) {
            member.xpEarned = statUser.xpEarned
            member.coinsEarned = statUser.coinsEarned
            member.eloEarned = statUser.eloEarned
          }
        });
      });
    }
  });

}

async function setGameData(game_data, room) {
  const sockets = await socketIO.in(room).fetchSockets();

  sockets.forEach((socket) => {
    socket.data.game_data = game_data;
    socket.data.idQuestion = game_data.questions[0].id;
    socket.data.question_at = 0;
    socket.data.hearts_remaining = 3;
    socket.data.idGame = game_data.idGame;
  });
}

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
          addMessage({
            nickname: "ingame_events",
            message: `${socket.data.name} left the lobby.`,
            avatar: socket.data.avatar
          }, socket.data.current_lobby)
        }
      });
    }
    if (lobby.members.length == 0) {
      lobbies.splice(ind_lobby, 1);
    }
  });

  socket.leave(socket.data.current_lobby);
  socket.data.current_lobby = null
  socketIO.to(socket.id).emit("YOU_LEFT_LOBBY")
  sendLobbyList();
}

function sendMessagesToLobby(lobby) {
  lobbies.forEach((element) => {
    if (element.lobby_name == lobby) {
      socketIO.sockets.in(lobby).emit("lobby_message", {
        messages: element.messages,
      });
    }
  });
}

async function sendLobbyList() {
  await socketIO.emit("lobbies_list", lobbies);
}

async function sendUserList(room) {
  var list = [];

  const sockets = await socketIO.in(room).fetchSockets();

  sockets.forEach((socket) => {
    list.push({
      name: socket.data.name,
      avatar: socket.data.avatar,
      hearts_remaining: socket.data.hearts_remaining,
      question_at: socket.data.question_at
    });
  });

  socketIO.to(room).emit("lobby_user_list", {
    list: list,
    message: "user list",
  });
}

// ================ LISTEN SERVER ================

server.listen(PORT, host, () => {
  console.log("Listening on *:" + PORT);
});
