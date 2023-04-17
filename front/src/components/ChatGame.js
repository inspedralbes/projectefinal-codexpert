import "../normalize.css";
import "../chat.css";
import { useState, useEffect } from "react";

function ChatGame({ socket, lobbyName }) {
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

    if (document.getElementById('input_message') === document.click) {
      document.getElementById('game__chatBody').style.display = "block";
      document.getElementById('game__chatBody').style.transition = "all 2s ease-in";
    }
    if (!document.getElementById('input_message') === document.click) {
      document.getElementById('game__chatBody').style.display = "none";
    }

    document.getElementById('game__chatBody').scrollTop = document.getElementById('game__chatBody').scrollHeight;

  })

  return (
    <div className="game__chat chat">
      <div className="game__chatBody" id="game__chatBody">
        <ul id="messages" className="game__chat chat">
          {Array.isArray(messages)
            ? messages.map((element, index) => {
              if (element.nickname != "ingame_events") {
                return (
                  <li className="game__chatMessage" key={index}>
                    <img
                      src={element.avatar}
                      width="50px"
                      className="game__userImage"
                      alt={element.nickname + "'s avatar"}
                    ></img>{element.nickname + ": " + element.message}
                  </li>
                );
              } else {
                return (
                  <li className="game__chatMessage game__chatMessage--event" key={index}>
                    <strong>{element.message}</strong>
                  </li>
                );
              }
            })
            : null}
        </ul>
      </div>
      <form id="form" onSubmit={handleSendMessage}>
        <div className="game__form--grid">
          <div className="game__inputMsg-div">
            <input
              id="game__inputMessage"
              autoComplete="off"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>

          <div className="game__buttonMsg-div">
            <button className="game__sendButton">Send</button>
          </div>
        </div>
      </form>
    </div>

  );
}

export default ChatGame;
