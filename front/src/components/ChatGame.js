import '../styles/normalize.css'
import '../styles/chat.css'
import React, { useState, useEffect } from 'react'

/**
 * Componente en el cual puedes ver el chat dentro del juego, en el qual pueden escribir otros usuarios.
 * @function ChatGame
 */
function ChatGame() {
  const [messages, setMessages] = useState([])
  const [msg, setMsg] = useState('')

  /**
 * Recibe todos los mensages ya escritos por otros usuarios.
 * @function handleMessage
 */
  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'lobby_message-event':
        setMessages(window.network.getLobbyMessages())
        break

      default:
        break
    }
  }

  /**
 * Envia el mensaje escrito por los usuarios.
 * @function handleSendMessage
 */
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (msg !== '') {
      console.log('Emit msg')
      window.postMessage(
        {
          type: 'chat_message-emit',
          message: msg
        },
        '*'
      )
      setMsg('')
    }
  }

  useEffect(() => {
    document.getElementById('game__chatBody').scrollTop = document.getElementById('game__chatBody').scrollHeight

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  })

  return (
    <div className="game__chat--div chat">
      <div className="game_chat--border">
        <div className="game__chatBody" id="game__chatBody">
          <ul id="messages" className="game__chat chat">
            {Array.isArray(messages)
              ? messages.map((element, index) => {
                if (element.nickname !== 'ingame_events') {
                  return (
                    <li className="game__chatMessage" key={index}>
                      <img
                        src={element.avatar}
                        width="50px"
                        className="game__userImage"
                        alt={element.nickname + "'s avatar"}
                      ></img>
                      {element.nickname + ': ' + element.message}
                    </li>
                  )
                } else {
                  return (
                    <li
                      className="game__chatMessage game__chatMessage--event"
                      key={index}
                    >
                      <strong>{element.message}</strong>
                    </li>
                  )
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
    </div>
  )
}

export default ChatGame
