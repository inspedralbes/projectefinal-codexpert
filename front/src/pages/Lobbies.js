import React, { useEffect, useState } from "react";
import "../normalize.css";
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
    setLobbyName(e.target.id);
    socket.emit("join room", e.target.id);
    localStorage.setItem("lobbyName", lobbyName);
    setJoined(true);
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
  }, []);

  return (
    <div className="lobbies">
      {!joinedLobby && (
        <div id="lobbyList" className="lobbies__lobbylist lobbylist">
          <div className="lobbylist__container">
            <h2 className="lobbies__title">Lobby list</h2>
            <ul className="lobbies__table table">
              <li className="table__header">
                <div className="col col-1">Lobby Id</div>
                <div className="col col-2">Lobby Name</div>
                <div className="col col-3">Creator</div>
                <div className="col col-4">Players joined</div>
              </li>
              {lobbyList.map((element, index) => {
                return (
                  <li
                    className="table__row row"
                    onClick={handleJoin}
                    key={index}
                    id={element}
                  >
                    <div className="col col-1" data-label="Lobby Id">
                      {index + 1}
                    </div>
                    <div className="col col-2" data-label="Lobby Name">
                      {element}
                    </div>
                    <div className="col col-3" data-label="Creator">
                      marti server
                    </div>
                    <div className="col col-4" data-label="Players joined">
                      x / 5
                    </div>
                  </li>
                );
              })}
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
                onChange={(e) => setLobbyName(e.target.value)}
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
        </div>
      )}
    </div>
  );
};

export default Lobbies;
