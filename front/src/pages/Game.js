import React, { useEffect, useState } from "react";
import "../normalize.css";
import "../game.css";
import "../Lobbies.css";
import routes from "../index";
import Chat from "../components/Chat";

function Game({ socket }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msg != "") {
      socket.emit("chat message", {
        message: msg,
      });
      setMsg("");
    }
  };
  useEffect(() => {
    socket.on("lobby-message", function (data) {
      setMessages(data.messages);
    });
  }, []);

  return (
    <div className="game">
      <div className="game__statement">
        <h1 className="game__statementTitle">statement</h1>
      </div>
      <div className="game--grid">
        <div className="game__expectedInput">
          <h1>input</h1>
        </div>
        <div className="game__expectedOutput">
          <h1>expectedOutput</h1>
        </div>
      </div>
      <div className="game__Wrapperinput">
        <input type="text" placeholder="userInput" className="game__input"></input>
      </div>
      <button className="game__submit">Submit</button>
      {/* Chat uwu */}
      <div className="lobby__chat chat">
        <h3 className="chat__title">Game chat</h3>
        <div className="chat__body">
          <Chat className="chat__chatbox" messages={messages}></Chat>
        </div>
        <form id="form" onSubmit={handleSendMessage}>
          <input
            id="input_message"
            autoComplete="off"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button>Send</button>
        </form>
      </div>
      {/* fin del chat uwu */}
    </div>
  );
}

export default Game;
