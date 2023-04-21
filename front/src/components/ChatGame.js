import "../styles/normalize.css";
import "../styles/chat.css";
import { useState, useEffect } from "react";

function ChatGame() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const handleMessage = (event) => {
    let eventData = event.data

    switch (eventData.type) {
      case 'lobby_message-event':
        console.log("Recibo msg")
        setMessages(window.network.getLobbyMessages());
        break;

      default:
        break;
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msg != "") {
      console.log("Emit msg")
      window.postMessage({
        type: 'chat_message-emit',
        message: msg,
      }, '*')
      setMsg("");
    }
  };

  useEffect(() => {
    if (document.getElementById('input_message') === document.click) {
      document.getElementById('game__chatBody').style.display = "block";
      document.getElementById('game__chatBody').style.transition = "all 2s ease-in";
    }

    if (!document.getElementById('input_message') === document.click) {
      document.getElementById('game__chatBody').style.display = "none";
    }

    document.getElementById('game__chatBody').scrollTop = document.getElementById('game__chatBody').scrollHeight;
    
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
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
              id="input_message"
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
