import React, { useEffect, useState } from "react";

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
        <div id="lobbyList">
          <h1>Lobby list</h1>
          <ul id="lobbiesList">
            {lobbyList.map((element, index) => {
              return (
                <li onClick={handleJoin} key={index}>
                  {element}
                </li>
              );
            })}
          </ul>
          <form id="form" onSubmit={handleSubmit}>
            <label>
              <input
                id="inputLobby"
                autoComplete="off"
                type="text"
                value={lobbyName}
                placeholder="Lobby name"
                onChange={(e) => setLobbyName(e.target.value)}
              />
            </label>
            <button>Send</button>
          </form>
        </div>
      )}

      {joinedLobby && (
        <div id="lobbyJoined">
          <button id="leaveLobby" onClick={handleLeave}>
            Leave current lobby
          </button>
          <h1>Connected users</h1>
          <ul id="userList">
            {userList.map((element, index) => {
              return <li key={index}>{element}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Lobbies;
