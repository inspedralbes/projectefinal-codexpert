import '../styles/normalize.css'
import ChatLobby from '../components/ChatLobby'
import ConnectedUsers from '../components/ConnectedUsers'
import React, { useState, useEffect } from 'react'
import Settings from './Settings'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

Modal.setAppElement('body')

JoinedLobby.propTypes = {
  setJoined: PropTypes.func,
  setLobbyList: PropTypes.func,
  setLobbyName: PropTypes.func,
  errorMessage: PropTypes.string
}

function JoinedLobby({ setJoined, setLobbyName, setLobbyList, errorMessage }) {
  const [sent, setSent] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [fetchSettings, setFetchSettings] = useState(false)

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'starting_errors-event':
        if (eventData.valid) {
          if (!sent) {
            window.postMessage({
              type: 'start_game-emit'
            }, '*')
          }
          setSent(true)
        }
        break

      case 'lobby_settings-event':
        setFetchSettings(true)
        break

      default:
        break
    }
  }

  const handleStartGame = (e) => {
    e.preventDefault()
    window.postMessage({
      type: 'save_settings-emit'
    }, '*')
  }

  const handleLeave = (e) => {
    e.preventDefault()
    window.postMessage({
      type: 'leave_lobby-emit'
    }, '*')
    setJoined(false)
    setLobbyName('')
    setLobbyList([])
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div id='lobbyJoined' className='lobbies__lobby lobby'>
      <button id='goBackToLobby__button' onClick={handleLeave}>
        <span className='circle' aria-hidden='true'>
          <span className='icon arrow'></span>
        </span>
        <span className='button-text'>LEAVE CURRENT LOBBY
        </span>
      </button>
      {window.network.getShowSettings()
        ? <>
          <button onClick={() => setShowModal(true)}>Settings</button>
          <Modal
            style={{ // QUITAR Y PERSONALIZAR ESTILOS CUANDO SE APLIQUE CSS
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                padding: '5%'
              }
            }}
            onRequestClose={() => setShowModal(false)}
            shouldCloseOnOverlayClick={true}
            isOpen={showModal}
          >
            <Settings fetchSettings={fetchSettings} errorMessage={errorMessage}></Settings>
          </Modal>
        </>
        : <></>}
      <ConnectedUsers></ConnectedUsers>
      {window.network.getShowSettings() &&
        <div className='button-startGame'>
          <button className='startGame' id='startGame' onClick={handleStartGame}>Start game</button>
        </div>}
      {errorMessage !== '' && <h2 className='lobbies__error'>{errorMessage}</h2>}
      <div className='lobby__chat'>
        <ChatLobby className='chat__chatbox'></ChatLobby>
      </div>
    </div>
  )
}

export default JoinedLobby
