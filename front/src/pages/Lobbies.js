import React, { useEffect, useState } from "react";
import "../normalize.css";
import "../Lobbies.css";

// socket.io

const Lobbies = () => {
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyList, setLobbyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [joinedLobby, setJoined] = useState(false);
  const [firstTime, setFirstTime] = useState(true);


  const handleLeave = (e) => {
    e.preventDefault();
    console.log("has abandonat la sala " + lobbyName);
    window.ce_socket.emit("leave lobby", lobbyName);
    setJoined(false);
    setLobbyName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.ce_socket.emit("new lobby", lobbyName);
    // setLobbyName(e.target.innerText);
    window.ce_socket.emit("join room", { lobby_name: lobbyName, "rank": "Owner" });
    // localStorage.setItem("lobbyName", lobbyName);
    setJoined(true);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    // console.log(e);
    setLobbyName(e.target.id);
    window.ce_socket.emit("join room", { lobby_name: e.target.id, "rank": "Member" });
    // localStorage.setItem("lobbyName", lobbyName);
    setJoined(true);
  };

  const handleMessage = (e) => {
    e.preventDefault();
    var input = e.target[0];
    console.log(input.value);
    if (input) {
      window.ce_socket.emit('chat message', {
        message: input.value,
        room: lobbyName
      });
      input.value = '';
    }
  };


  useEffect(() => {
    if (firstTime) {
      window.ce_socket.emit("hello", "gimme gimme");
      setFirstTime(true);
    }

    window.ce_socket.on("lobbies list", function (lobbylist) {
      setLobbyList(lobbylist);
      // console.log(lobbyList);
    });

    window.ce_socket.on("lobby user list", (data) => {
      setUserList(data.list);
    });

    window.ce_socket.on("player joined", (id) => {
      console.log(id + " joined the lobby");
    });
  
    // ======================================AMAE===================================


    // form.addEventListener('submit', function (e) {
    //   e.preventDefault();
    //   if (input.value) {
    //     window.ce_socket.emit('chat message', input.value);
    //     input.value = '';
    //   }
    // });

    // window.ce_socket.on('chat message', function (msg) {
    //   var item = document.createElement('li');
    //   item.textContent = msg;
    //   messages.appendChild(item);
    //   window.scrollTo(0, document.body.scrollHeight);
    // });
    // ================================================================

    window.ce_socket.on('chat message', function (msg) {
      console.log('Ola soy el socket.io y funciono :)');
      var htmlStr = "";
      htmlStr += `<li className="message">${msg}</li>`;
      document.getElementById('messages').innerHTML = htmlStr;
    });

  },[]);

  return (
    <div className="lobbies">
      {!joinedLobby && (
        <div id="lobbyList" className="lobbies__lobbylist lobbylist">
          <div className="lobbylist__container">
            <h2 className="lobbies__title"  onClick={() => { window.ce_socket.emit("hello", "gimme gimme") }}>Lobby list</h2>
            <ul className="lobbies__table table">
              <li className="table__header">
                <div className="col col-1">ID</div>
                <div className="col col-2">Lobby Name</div>
                <div className="col col-3">Owner</div>
                <div className="col col-4">Players</div>
              </li>
              <div className="table__body">
                {lobbyList.map((element, index) => {
                  return (
                    <li
                      className="table__row row"
                      onClick={handleJoin}
                      key={index}
                      id={element.lobby_name}
                    >
                      <div id={element.lobby_name} className="col col-1" data-label="Lobby Id">
                        {index + 1}
                      </div>
                      <div id={element.lobby_name} className="col col-2" data-label="Lobby Name">
                        {element.lobby_name}
                      </div>
                      <div id={element.lobby_name} className="col col-3" data-label="Owner">
                        {element.members[0].nom}
                      </div>
                      <div id={element.lobby_name} className="col col-4" data-label="Players">
                        {element.members.length} / 5
                      </div>
                    </li>
                  );
                })}
              </div>
            </ul>
          </div>
          <form
            id="form"
            className="lobbies__form form"
            onSubmit={handleSubmit}
          >
            <label>
              <input
                id="inputLobby"
                className="form__inputLobby"
                autoComplete="off"
                type="text"
                value={lobbyName}
                placeholder="Lobby name"
                onChange={(e) => { setLobbyName(e.target.value) }}
              />
            </label>
            <button className="lobbies__button" disabled={lobbyName === ""}>
              Create lobby
            </button>
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
                return (
                  <li className="userList__item" key={index}>
                    {element}
                  </li>
                );
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
