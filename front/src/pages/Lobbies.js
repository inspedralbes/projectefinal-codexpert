import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Lobbies = ({ socket }) => {
  const navigate = useNavigate();
  const [lobbyName, setLobbyName] = useState("");
  const [joinedLobby, setJoined] = useState(false);

  const handleLeave = (e) => {
    e.preventDefault();
    socket.emit("new lobby", lobbyName);
    console.log("hola" + lobbyName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("lobbyName", lobbyName);
    console.log("joined");
  };
  return (
    <div>
      {!joinedLobby && (
        <div id="lobbyList">
          <h1>Lobby list</h1>
          <ul id="lobbiesList"></ul>
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
          <button id="leaveLobby">Leave current lobby</button>
          <h1>Connected users</h1>
          <ul id="userList"></ul>
        </div>
      )}
    </div>
  );
};

export default Lobbies;
