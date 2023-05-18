import '../styles/normalize.css'
import '../styles/Lobbies.css'
import ChatLobby from '../components/ChatLobby'
import ConnectedUsers from '../components/ConnectedUsers'
import QuestionLibrary from '../components/QuestionLibrary'
import React, { useState, useEffect } from 'react'
import Settings from './Settings'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import cross from '../img/cross.png'
import settings from '../img/settings.png'

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
  const [saveSettings, setSaveSettings] = useState(0)
  const [questionsData, setQuestionsData] = useState([])

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'starting_errors-event':
        if (eventData.valid) {
          if (!sent) {
            setFetchSettings(false)
            window.postMessage(
              {
                type: 'start_game-emit'
              },
              '*'
            )
          }
          setSent(true)
        }
        break

      case 'questions-event':
        setQuestionsData(eventData.questionsData)
        break

      case 'lobby_settings-event':
        setFetchSettings(true)
        break
    }
  }

  const handleStartGame = (e) => {
    e.preventDefault()
    window.postMessage(
      {
        type: 'save_settings-emit'
      },
      '*'
    )
  }

  const handleLeave = (e) => {
    e.preventDefault()
    window.postMessage(
      {
        type: 'leave_lobby-emit'
      },
      '*'
    )
    setJoined(false)
    setLobbyName('')
    setLobbyList([])
  }

  const saveChangedSettings = () => {
    setSaveSettings(saveSettings + 1)
    setShowModal(false)
  }

  const closeModalWithoutSaving = () => {
    setSaveSettings(0)
    setShowModal(false)
  }

  useEffect(() => {
    if (!showModal) setSaveSettings(0)
  }, [showModal])

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div id="lobbyJoined" className="lobbies__lobby lobby">
      <button id="goBackToLobby__button" onClick={handleLeave}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">LEAVE CURRENT LOBBY</span>
      </button>
      {window.network.getShowSettings()
        ? (<>
          <button className="noBtn" onClick={() => setShowModal(true)}><img className="settings" src={settings} alt='SETTINGS' height={'50px'}></img></button>
          <Modal
            style={{
              // QUITAR Y PERSONALIZAR ESTILOS CUANDO SE APLIQUE CSS
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                padding: '1%',
                width: '60%',
                height: '90%'
              }
            }}
            onRequestClose={() => closeModalWithoutSaving()}
            shouldCloseOnOverlayClick={true}
            isOpen={showModal}
          >
            <button className="cross" onClick={() => closeModalWithoutSaving()}>
              <img src={cross} alt="X" height={'30px'}></img>
            </button>

            <Settings
              fetchSettings={fetchSettings}
              errorMessage={errorMessage}
              saveSettings={saveSettings}
            ></Settings>
            <br></br>
            <div className="lobbyModal__buttons">
              <button
                className="pixel-button lobby-modalBtn"
                onClick={() => saveChangedSettings()}
              >
                Save
              </button>
            </div>
          </Modal>
          <QuestionLibrary questionsData={questionsData}></QuestionLibrary>
        </>)
        : (<></>)}
      <ConnectedUsers></ConnectedUsers>
      {window.network.getShowSettings() && (
        <div className="button-startGame">
          <button
            className="startGame"
            id="startGame"
            onClick={handleStartGame}
          >
            Start game
          </button>
        </div>
      )}
      {errorMessage !== '' && (
        <h2 className="lobbies__error">{errorMessage}</h2>
      )}
      <ChatLobby className="chat__chatbox"></ChatLobby>
    </div>
  )
}

export default JoinedLobby
