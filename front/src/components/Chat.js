import "../normalize.css";
import { useState, useEffect } from "react";

function Chat({ socket, lobbyName }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msg != "") {
      socket.emit("chat message", {
        message: msg,
        room: lobbyName,
      });
      setMsg("");
    }
  };

  useEffect(() => {
    socket.on("lobby-message", function (data) {
      setMessages(data.messages);
    });
  })

  return (
    <div className="lobby__chat chat">
      <h3 className="chat__title">Lobby chat</h3>
      <div className="chat__body">
        <ul id="messages" className="lobby__chat chat">
          {Array.isArray(messages)
            ? messages.map((element, index) => {
              if (element.nickname != "ingame_events") {
                return (
                  <li className="chat__message" key={index}>
                    <img
                      src={element.avatar}
                      width="50px"
                      className="user__image"
                      alt={element.nickname + "'s avatar"}
                    ></img>{element.nickname + ": " + element.message}
                  </li>
                );
              } else {
                return (
                  <li className="chat__message chat__message--event" key={index}>
                    <strong>{element.message}</strong>
                  </li>
                );
              }
            })
            : null}
        </ul>
      </div>
      <form id="form" onSubmit={handleSendMessage}>
        <input
          id="input_message"
          autoComplete="off"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="pixel-button">Send</button>
      </form>
    </div>

  );
}

export default Chat;
