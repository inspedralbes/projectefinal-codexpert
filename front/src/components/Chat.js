import "../normalize.css";
import { useState, useEffect } from "react";

function Chat({ messages }) {
  return (
    <ul id="messages" className="lobby__chat chat">
      {Array.isArray(messages)
        ? messages.map((element, index) => {
            return (
              <li className="chat__message" key={index}>
                {element}
              </li>
            );
          })
        : null}
    </ul>
  );
}

export default Chat;
