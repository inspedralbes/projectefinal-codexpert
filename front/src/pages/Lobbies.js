import React, { useEffect, useState } from "react";
import "../Lobbies.css";

// socket.io
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

const Lobbies = () => {
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyList, setLobbyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [joinedLobby, setJoined] = useState(false);
  const [firstTime, setFirstTime] = useState(true);


  const handleLeave = (e) => {
    e.preventDefault();
    socket.emit("leave lobby", lobbyName);
    console.log("has abandonat la sala " + lobbyName);
    setJoined(false);
    setLobbyName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("new lobby", lobbyName);
    setLobbyName(e.target.innerText);
    socket.emit("join room", lobbyName);
    localStorage.setItem("lobbyName", lobbyName);
    setJoined(true);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setLobbyName(e.target.innerText);
    socket.emit("join room", e.target.innerText);
    localStorage.setItem("lobbyName", lobbyName);
    setJoined(true);
  };

  const handleMessage = (e) => {
    e.preventDefault();
    var input = e.target[0];
    console.log(input.value);
    if (input) {
      socket.emit('chat message', {
        message: input.value,
        room: lobbyName
      });
      input.value = '';
    }
  };


  useEffect(() => {
    if (firstTime) {
      socket.emit("hello", "gimme gimme");
      setFirstTime(true);
    }

    socket.on("lobbies list", function (lobbylist) {
      setLobbyList(lobbylist);
      // console.log(lobbyList);
    });

    socket.on("lobby user list", (data) => {
      setUserList(data.list);
    });

    socket.on("player joined", (id) => {
      console.log(id + " joined the lobby");
    });
  
    // ======================================AMAE===================================


    // form.addEventListener('submit', function (e) {
    //   e.preventDefault();
    //   if (input.value) {
    //     socket.emit('chat message', input.value);
    //     input.value = '';
    //   }
    // });

    // socket.on('chat message', function (msg) {
    //   var item = document.createElement('li');
    //   item.textContent = msg;
    //   messages.appendChild(item);
    //   window.scrollTo(0, document.body.scrollHeight);
    // });
    // ================================================================

    socket.on('chat message', function (msg) {
      console.log('Ola soy el socket.io y funciono :)');
      var htmlStr = "";
      htmlStr += `<li className="message">${msg}</li>`;
      document.getElementById('messages').innerHTML = htmlStr;
    });

  },[]);

  return (
    <div className="lobbies">
      {!joinedLobby && (
        <div id="lobbyList" className="lobbies">
          <h1 className="lobbies__title">Lobby list</h1>
          <ul id="lobbiesList" className="lobbies_lobbylist">
            {lobbyList.map((element, index) => {
              return (
                <li
                  className="lobbylist__item"
                  onClick={handleJoin}
                  key={index}
                >
                  {element}
                </li>
              );
            })}
          </ul>
          <form id="form" className="lobbies__form form" onSubmit={handleSubmit}>
            <label>
              <input
                id="inputLobby"
                className="form__inputLobby"
                autoComplete="off"
                type="text"
                value={lobbyName}
                placeholder="Lobby name"
                onChange={(e) => setLobbyName(e.target.value)}
              />
            </label>
            <button className="lobbies__button" disabled={lobbyName == ""}>Create lobby</button>
          </form>
        </div>


      )}

      {joinedLobby && (
        <div id="lobbyJoined" className="lobbies__lobby lobby">
          <button
            id="leaveLobby"
            className="lobby__leaveButton"
            onClick={handleLeave}
          >
            Leave current lobby
          </button>
          <div className="lobby__connectedUsers">
            <ul id="messages">
              <li>mensajes</li>
            </ul>
            <h1 className="connectedUsers_title">Connected users</h1>
            <ul id="userList" className="connectedUsers__userList userList">
              {userList.map((element, index) => {
                return <li className="userList__item" key={index}>{element}</li>;
              })}
            </ul>

          </div>
          {/* Chat :) */}
          <form id="form" onSubmit={handleMessage}>
            <input id="input" autoComplete="off" /><button>Send</button>
          </form>
          {/* Fin del chat */}
        </div>
      )}
    </div>
  );
};

export default Lobbies;
