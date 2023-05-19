const express = require("express");
const cors = require("cors");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 7500;
const host = "0.0.0.0";
const http = require("http");
require("dotenv").config();
const server = http.createServer(app);
const axios = require("axios");

const maxMembersOnLobby = 10;
const maxLobbyNameLength = 16;
const laravelRoute = process.env.LARAVEL_ROUTE;

const lobbies = [];
const sesiones = [];
// ============= SOCKET ROOMS ===========

const socketIO = require("socket.io")(server, {
  cors: {
    origin: true,
    credentials: true
  },
  path: "/node/"
});

// ============= SAVE TOKEN AS COOKIE ===========
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
      maxAge: 600000
    }
  })
);

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      console.log(origin);
      return callback(null, true);
    }
  })
);

const defaultSettings = {
  overtimeDuration: 30,
  heartAmount: 5,
  unlimitedHearts: false,
  willHaveOvertime: true,
  questionAmount: 5
};

const maxSettings = {
  minOvertimeDuration: 10,
  maxOvertimeDuration: 999,
  minHeartAmount: 1,
  maxHeartAmount: 99,
  minQuestionAmount: 1,
  maxQuestionAmount: 10
};

socketIO.on("connection", (socket) => {
  socket.on("prueba_phaser", (data) => {
    console.log(data.message);
  });
  socket.data.current_lobby = null;
  socket.data.token = null;

  socket.join("chat-general");

  socket.on("send_token", (data) => {
    const userToken = data.token;
    socket.data.token = userToken;

    axios
      .post(laravelRoute + "getUserInfo", {
        token: userToken
      })
      .then(function (response) {
        if (!response.data.error) {
          const user = {
            token: userToken,
            userId: response.data.id,
            userName: response.data.name
          };
          sesiones.push(user);

          socket.data.userId = response.data.id;
          socket.data.name = response.data.name;
          socket.data.avatar = response.data.avatar;
          socket.data.elo = response.data.elo;
          socket.data.hearts_remaining = -1;
          socket.data.question_at = -1;
        }
      }
      )
      .catch(function (error) {
        console.log(error);
      });
  });

  socket.on("hello_firstTime", () => {
    if (socket.data.current_lobby != null) {
      socket.emit("YOU_ARE_ON_LOBBY", {
        lobby_name: socket.data.current_lobby
      });

      lobbies.forEach(lobby => {
        if (lobby.lobby_name === socket.data.current_lobby) {
          if (lobby.owner_name === socket.data.name) {
            lobby.started = false;
            lobby.settings = defaultSettings;
            socketIO.to(socket.id).emit("show_settings", {
              show: true
            });

            socketIO.to(socket.id).emit("lobby_settings", lobby.settings);
          }

          socketIO.to(socket.id).emit("lobby_name", {
            lobby_name: lobby.lobby_name
          });
        }
      });
    } else {
      sendLobbyList();
    }
  });

  sendLobbyList();

  socket.on("lobby_data_pls", () => {
    sendUserList(socket.data.current_lobby);
    sendMessagesToLobby(socket.data.current_lobby);
  });

  socket.on("new_lobby", (lobby) => {
    let existeix = false;
    let disponible = true;

    if (lobby.length > maxLobbyNameLength) {
      disponible = false;
      socketIO.to(socket.id).emit("LOBBY_NAME_LENGTH_ERROR", {
        message: "The lobby name is too long"
      });
    }

    lobbies.forEach((element) => {
      if (element.lobby_name === lobby) {
        existeix = true;
      }
    });

    if (!existeix && disponible) {
      lobbies.push({
        lobby_name: lobby,
        members: [],
        messages: [],
        questions: [],
        settings: defaultSettings,
        owner_name: socket.data.name,
        total_elo: 0,
        users_finished: 0
      });
    }
  });

  socket.on("join_room", (data) => {
    let settings;
    let disponible = false;
    let hayOwner = false;

    lobbies.forEach((lobby) => {
      if (lobby.lobby_name === data.lobby_name) {
        disponible = true;

        if (lobby.started) {
          socketIO.to(socket.id).emit("ALREADY_STARTED", {
            message: "The selected lobby has already started"
          });

          disponible = false;
        } else {
          if (lobby.members.length === maxMembersOnLobby) {
            socketIO.to(socket.id).emit("LOBBY_FULL_ERROR", {
              message: "The selected lobby is full"
            });
          } else {
            lobby.members.forEach(member => {
              if (member.nom === socket.data.name || socket.data.name === undefined) {
                disponible = false;
              }

              if (member.rank === "Owner" && data.rank === "Owner") {
                hayOwner = true;
                disponible = false;
              }
            });

            if (disponible) {
              lobby.members.push({
                nom: socket.data.name,
                rank: data.rank,
                idUser: socket.data.userId
              });
              settings = lobby.settings;

              lobby.total_elo += socket.data.elo;
            } else {
              if (!hayOwner) {
                socketIO.to(socket.id).emit("ALREADY_ON_LOBBY", {
                  message: "YOU ARE ALREADY ON LOBBY"
                });
              } else {
                socketIO.to(socket.id).emit("LOBBY_ALREADY_EXISTS", {
                  message: "THE LOBBY YOU TRIED TO CREATE ALREADY EXISTS"
                });
              }
            }
          }
        }
      }
    });

    if (disponible) {
      socket.join(data.lobby_name);
      socket.data.current_lobby = data.lobby_name;
      socketIO.to(socket.id).emit("YOU_JOINED_LOBBY");

      addMessage({
        nickname: "ingame_events",
        message: `${socket.data.name} joined the lobby.`,
        avatar: socket.data.avatar
      }, socket.data.current_lobby);

      sendUserList(data.lobby_name);
      sendMessagesToLobby(data.lobby_name);
      sendLobbyList();

      if (data.rank === "Owner") {
        if (settings != null) {
          socketIO.to(socket.id).emit("show_settings", {
            show: true
          });

          socketIO.to(socket.id).emit("lobby_settings", settings);

          sendQuestionsToUser(socket);
        }
      }

      socketIO.to(socket.id).emit("lobby_name", {
        lobby_name: data.lobby_name
      });
    }
  });

  socket.on("leave_lobby", () => {
    const roomName = socket.data.current_lobby;
    leaveLobby(socket);
    sendUserList(roomName);
    sendLobbyList();
  });

  socket.on("chat_message", (data) => {
    addMessage({
      nickname: socket.data.name,
      message: data.message,
      avatar: socket.data.avatar
    }, socket.data.current_lobby);
  });

  socket.on("start_game", () => {
    lobbies.forEach((lobby) => {
      if (lobby.lobby_name === socket.data.current_lobby) {
        socketIO.to(lobby.lobby_name).emit("game_started");
        lobby.started = true;
        sendLobbyList();
        startGame(lobby.lobby_name, lobby.settings.questionAmount);
      }
    });
  });

  socket.on("check_answer", async (data) => {
    let gameNumQuestions;
    let unlimitedHeartsOption;
    let overtimeDuration;
    let willHaveOvertime;
    let memberLength;

    const lobby = lobbies.filter(lobby => lobby.lobby_name === socket.data.current_lobby)[0];
    if (lobby != null) {
      gameNumQuestions = lobby.settings.questionAmount;
      unlimitedHeartsOption = lobby.settings.unlimitedHearts;
      willHaveOvertime = lobby.settings.willHaveOvertime;
      memberLength = lobby.members.length;

      if (memberLength <= 1) willHaveOvertime = false;

      if (willHaveOvertime) {
        overtimeDuration = lobby.settings.overtimeDuration;
      }
    }

    const postData = {
      idQuestion: socket.data.idQuestion,
      idGame: socket.data.game_data.idGame,
      idUser: socket.data.userId,
      evalRes: data.resultsEval,
      evalPassed: data.evalPassed,
      numQuestions: gameNumQuestions,
      unlimitedHearts: unlimitedHeartsOption
    };

    axios
      .post(laravelRoute + "checkAnswer", postData)
      .then(function (response) {
        const userGame = response.data.user_game;
        const game = response.data.game;
        if (response.data.correct) {
          socketIO.to(socket.id).emit("answer_correct", {
            correct: true
          });

          addMessage({
            nickname: "ingame_events",
            message: `${socket.data.name} answered question ${userGame.question_at} correctly.`,
            avatar: socket.data.avatar
          }, socket.data.current_lobby);

          socket.data.question_at = userGame.question_at;

          sendUserList(socket.data.current_lobby);
          // Only passes if not dead
          if (userGame.finished) {
            lobbies.forEach(lobby => {
              lobby.users_finished++;
            });
            // Finish but still don't know if they won
            if (game.winner_id !== undefined && game.winner_id === socket.data.userId) {
              setWinnerId(socket.data.userId);

              // AXIOS to updateUserLvl LO MISMO QUE EN SETUSERGAME
              socketIO.to(socket.id).emit("user_finished", {
                message: "YOU WON"
              });
              socket.data.resultMessage = "YOU WON";

              if (willHaveOvertime) {
                startOverTime(socket, overtimeDuration);
              } else {
                endGame(socket);
              }
            } else {
              socket.data.resultMessage = "YOU FINISHED";
              socketIO.to(socket.id).emit("user_finished", {
                message: "YOU FINISHED"
              });
            }
          } else {
            const lobby = lobbies.filter(lobby => lobby.lobby_name === socket.data.current_lobby)[0];
            socket.data.idQuestion = lobby.game_data.questions[socket.data.question_at].id;
            sendQuestionDataToUser(socket.id, socket.data.question_at, socket.data.current_lobby);
          }
        } else {
          socketIO.to(socket.id).emit("answer_correct", {
            correct: false
          });

          addMessage({
            nickname: "ingame_events",
            message: `${socket.data.name} answered question ${userGame.question_at + 1} wrong.`,
            avatar: socket.data.avatar
          }, socket.data.current_lobby);

          if (!unlimitedHeartsOption) {
            socket.data.hearts_remaining--;
          }
          sendUserList(socket.data.current_lobby);

          if (userGame.dead) {
            addMessage({
              nickname: "ingame_events",
              message: `${socket.data.name} has lost!`,
              avatar: socket.data.avatar
            }, socket.data.current_lobby);

            socketIO.to(socket.id).emit("user_finished", {
              message: "YOU LOST",
              stats: {
                hearts_remaining: userGame.hearts_remaining,
                perks_used: userGame.perks_used,
                question_at: userGame.question_at
              }
            });
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  socket.on("save_settings", (data) => {
    let validSettings = true;
    lobbies.forEach((lobby) => {
      if (lobby.lobby_name === socket.data.current_lobby) {
        if (!data.willHaveOvertime) {
          if (data.overtimeDuration < maxSettings.minOvertimeDuration) {
            socketIO.to(socket.id).emit("OVERTIME_UNDER_MIN", {
              min: maxSettings.minOvertimeDuration
            });

            validSettings = false;
          } else if (data.overtimeDuration > maxSettings.maxOvertimeDuration) {
            socketIO.to(socket.id).emit("OVERTIME_ABOVE_MAX", {
              max: maxSettings.maxOvertimeDuration
            });

            validSettings = false;
          }
        }

        if (validSettings) {
          if (data.heartAmount < maxSettings.minHeartAmount) {
            socketIO.to(socket.id).emit("HEARTS_AMT_UNDER_MIN", {
              min: maxSettings.minHeartAmount
            });

            validSettings = false;
          } else if (data.heartAmount > maxSettings.maxHeartAmount) {
            socketIO.to(socket.id).emit("HEARTS_AMT_ABOVE_MAX", {
              max: maxSettings.maxHeartAmount
            });

            validSettings = false;
          }
        }

        if (validSettings) {
          if (data.questionAmount < maxSettings.minQuestionAmount) {
            socketIO.to(socket.id).emit("QUESTION_AMT_UNDER_MIN", {
              min: maxSettings.minQuestionAmount
            });

            validSettings = false;
          } else if (data.questionAmount > maxSettings.maxQuestionAmount) {
            socketIO.to(socket.id).emit("QUESTION_AMT_ABOVE_MAX", {
              max: maxSettings.maxQuestionAmount
            });

            validSettings = false;
          }
        }

        if (validSettings) {
          lobby.settings = data;
        }

        socketIO.to(socket.id).emit("starting_errors", {
          valid: validSettings
        });
      }
    });
  });

  socket.on("set_questions", (data) => {
    lobbies.forEach(lobby => {
      if (lobby.lobby_name === socket.data.current_lobby) {
        lobby.questions = data.ids;
      }
    });
  });

  socket.on("disconnect", () => {
    leaveLobby(socket);
  });
});

async function sendQuestionsToUser(socket) {
  await axios
    .post(laravelRoute + "getQuestions", {
      token: socket.data.token
    })
    .then(function (response) {
      socketIO.to(socket.id).emit("questions", response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function startOverTime(socket, time) {
  const room = socket.data.current_lobby;
  const winnerName = socket.data.name;
  const idGame = socket.data.game_data.idGame;

  socketIO.to(room).emit("overtime_starts", { time: (time * 1000) });

  let cont = -1;

  const interval = setInterval(() => {
    const lobby = lobbies.filter(lobby => lobby.lobby_name === room)[0];
    cont++;

    if (lobby != null) {
      if (cont === time || lobby.members.length <= lobby.users_finished) {
        endGame(winnerName, room, idGame);
        clearInterval(interval);
      };
    } else {
      endGame(winnerName, room, idGame);
      clearInterval(interval);
    }
  }, 1000);
}

async function endGame(winnerName, room, idGame) {
  socketIO.to(room).emit("game_over", {
    message: `${winnerName} won the game`
  });

  updateUserLvl(room);
  setMembersStats(room);

  await axios
    .get(laravelRoute + `ranking/${idGame}`)
    .then(function (response) {
      const rankingData = response.data;

      socketIO.to(room).emit("ranking", { rankingData, idGame });
    });
}

async function setMembersStats(room) {
  const sockets = await socketIO.in(room).fetchSockets();
  lobbies.forEach(lobby => {
    if (lobby.lobby_name === room) {
      lobby.members.forEach(member => {
        sockets.forEach((socket) => {
          if (socket.data.userId === member.idUser) {
            const resultMessage = socket.data.resultMessage;

            member.resultMessage = resultMessage === undefined ? "YOU LOST" : resultMessage;
            member.hearts_remaining = socket.data.hearts_remaining;
            member.perks_used = socket.data.perks_used;
            member.question_at = socket.data.question_at;
          }
        });
      });
    }
  });
}

function addMessage(msgData, room) {
  lobbies.forEach((lobby) => {
    if (lobby.lobby_name === room) {
      lobby.messages.push(msgData);
    }
  });
  sendMessagesToLobby(room);
}

async function startGame(room, amount) {
  await axios
    .post(laravelRoute + "startGame", {
      numQuestions: amount
    })
    .then(function (response) {
      lobbies.forEach((lobby) => {
        if (lobby.lobby_name === room) {
          lobby.game_data = response.data;

          setGameData(response.data, room);

          socketIO.to(room).emit("game_started");
          socketIO.to(room).emit("lobby_name", {
            lobby: room
          });
          socketIO.sockets.in(room).emit("lobby_message", {
            messages: lobby.messages
          });
          sendUserList(room);
          socketIO.to(room).emit("question_data", {
            statement: lobby.game_data.questions[0].statement,
            inputs: lobby.game_data.questions[0].inputs,
            output: lobby.game_data.questions[0].outputs[0]
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
  let members;
  let idGameDB;
  let gameHeartAmount;

  lobbies.forEach((lobby) => {
    if (lobby.lobby_name === room) {
      members = lobby.members;
      idGameDB = lobby.game_data.idGame;
      gameHeartAmount = lobby.settings.heartAmount;
    }
  });
  await axios
    .post(laravelRoute + "setUserGame", {
      users: members,
      idGame: idGameDB,
      heartAmount: gameHeartAmount
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function updateUserLvl(room) {
  let members;
  let idGameDB;

  lobbies.forEach((lobby) => {
    if (lobby.lobby_name === room) {
      members = lobby.members;
      idGameDB = lobby.game_data.idGame;
    }
  });
  await axios
    .post(laravelRoute + "updateUserLvl", {
      users: members,
      idGame: idGameDB
    })
    .then(function (response) {
      setUserLvl(response.data, room);
      sendUserStats(room);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function sendUserStats(room) {
  const sockets = await socketIO.in(room).fetchSockets();

  lobbies.forEach(lobby => {
    if (lobby.lobby_name === room) {
      lobby.members.forEach(member => {
        sockets.forEach((socket) => {
          if (socket.data.userId === member.idUser) {
            socketIO.to(socket.id).emit("stats", member);
          }
        });
      });
    }
  });
}

function setUserLvl(data, room) {
  lobbies.forEach((lobby) => {
    if (lobby.lobby_name === room) {
      data.forEach(statUser => {
        lobby.members.forEach(member => {
          if (statUser.idUser === member.idUser) {
            member.result = "";
            member.xpEarned = statUser.xpEarned;
            member.coinsEarned = statUser.coinsEarned;
            member.eloEarned = statUser.eloEarned;
          }
        });
      });
    }
  });
}

async function setGameData(gameData, room) {
  const sockets = await socketIO.in(room).fetchSockets();
  let hearts;

  lobbies.forEach(lobby => {
    if (lobby.lobby_name === room) {
      hearts = lobby.settings.heartAmount;
    }
  });

  sockets.forEach((socket) => {
    if (gameData.questions.length > 0) {
      socket.data.game_data = gameData;
      socket.data.idQuestion = gameData.questions[0].id;
      socket.data.question_at = 0;
      socket.data.hearts_remaining = hearts;
      socket.data.idGame = gameData.idGame;
    }
  });
}

function sendQuestionDataToUser(socketId, questionIndex, currentLobby) {
  lobbies.forEach((lobby) => {
    if (lobby.lobby_name === currentLobby) {
      socketIO.to(socketId).emit("question_data", {
        statement: lobby.game_data.questions[questionIndex].statement,
        inputs: lobby.game_data.questions[questionIndex].inputs,
        output: lobby.game_data.questions[questionIndex].outputs[0]
      });
    }
  });
}

function setWinnerId(winnerId, currentLobby) {
  lobbies.forEach((lobby) => {
    if (lobby.lobby_name === currentLobby) {
      lobby.game_data.winner = winnerId;
    }
  });
}

async function leaveLobby(socket) {
  lobbies.forEach((lobby, indLobby) => {
    if (lobby.lobby_name === socket.data.current_lobby) {
      lobby.members.forEach((member, index) => {
        if (member.nom === socket.data.name) {
          lobby.members.splice(index, 1);
          lobby.total_elo -= socket.data.elo;
          addMessage({
            nickname: "ingame_events",
            message: `${socket.data.name} left the lobby.`,
            avatar: socket.data.avatar
          }, socket.data.current_lobby);
        }
      });
    }
    if (lobby.members.length === 0) {
      lobbies.splice(indLobby, 1);
    }
  });

  socket.leave(socket.data.current_lobby);
  socket.data.current_lobby = null;
  socketIO.to(socket.id).emit("YOU_LEFT_LOBBY");
  sendLobbyList();
}

function sendMessagesToLobby(lobby) {
  lobbies.forEach((element) => {
    if (element.lobby_name === lobby) {
      socketIO.sockets.in(lobby).emit("lobby_message", {
        messages: element.messages
      });
    }
  });
}

async function sendLobbyList() {
  await socketIO.emit("lobbies_list", lobbies);
}

async function sendUserList(room) {
  const userList = [];
  let unlimitedHeartsOption;

  const sockets = await socketIO.in(room).fetchSockets();
  lobbies.forEach(lobby => {
    if (lobby.lobby_name === room) {
      unlimitedHeartsOption = lobby.settings.unlimitedHearts;
    }
  });

  sockets.forEach((socket) => {
    userList.push({
      name: socket.data.name,
      avatar: socket.data.avatar,
      hearts_remaining: socket.data.hearts_remaining,
      question_at: socket.data.question_at,
      unlimitedHearts: unlimitedHeartsOption
    });
  });

  socketIO.to(room).emit("lobby_user_list", {
    list: userList,
    message: "user list"
  });
}

// ============ LISTEN SERVER ===========

server.listen(PORT, host, () => {
  console.log("Listening on *:" + PORT);
});
