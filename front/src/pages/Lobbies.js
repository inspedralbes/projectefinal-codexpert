import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Lobbies = ({ socket }) => {
  const navigate = useNavigate();
  const [lobbyName, setLobbyName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("lobbyName", lobbyName);
    console.log("hola");
    navigate("/lobbylist");
  };
  return (
    <div>
      <div id="lobbyList">
        <h1>Lobby list</h1>
        <ul id="lobbiesList"></ul>
        <form id="form" onSubmit={handleSubmit}>
          <label>
            <input
              id="inputLobby"
              autocomplete="off"
              type="text"
              value={lobbyName}
              placeholder="Lobby name"
              onChange={(e) => setLobbyName(e.target.value)}
            />
          </label>
          <button>Send</button>
        </form>
      </div>

      <div id="lobbyJoined">
        <button id="leaveLobby">Leave current lobby</button>
        <h1>Connected users</h1>
        <ul id="userList"></ul>
      </div>
    </div>
  );
};

export default Lobbies;
