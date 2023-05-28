import '../styles/normalize.css'
import '../styles/Lobbies.css'
import '../styles/form.css'
import ChatLobby from '../components/ChatLobby'
import ConnectedUsers from '../components/ConnectedUsers'
// import QuestionLibrary from '../components/QuestionLibrary'
import Header from './Header.js'
import React, { useState, useEffect } from 'react'
import Settings from './Settings'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import 'animate.css'
import settings from '../img/settings.png'

Modal.setAppElement('body')

JoinedLobby.propTypes = {
  setJoined: PropTypes.func,
  setLobbyList: PropTypes.func,
  setLobbyName: PropTypes.func,
  errorMessage: PropTypes.string
}

/**
 * Componente que sale al unir-te o crear una lobby.
 * @function JoinedLobby
 * @param setJoined Envia a node que has entrado a la lobby.
 * @param setLobbyName Envia a node el nombre de la lobby.
 * @param setLobbyList Para añadir el nuevo lobby a la lista.
 * @param errorMessage En caso de que no pueda unir-se sale un error de texto.
 */
function JoinedLobby({ setJoined, setLobbyName, setLobbyList, errorMessage }) {
  const [sent, setSent] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [fetchSettings, setFetchSettings] = useState(false)
  const [saveSettings, setSaveSettings] = useState(0)

  /**
 * Para mostrar los mensajes de error.
 * @function handleMessage
 * @param event El evento a enviar a node del mensaje.
 */
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

      case 'lobby_settings-event':
        setFetchSettings(true)
        break
    }
  }

  /**
 * Al clicar envia a node que ha empezado el juego.
 * @function handleStartGame
 */
  const handleStartGame = (e) => {
    e.preventDefault()
    window.postMessage(
      {
        type: 'save_settings-emit'
      },
      '*'
    )
  }

  /**
 * Al clicar envia a node que se ha ido del juego.
 * @function handleLeave
 */
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

  /**
 * Guardar cambios de las configuraciones hechas.
 * @function saveChangedSettings
 */
  const saveChangedSettings = () => {
    setSaveSettings(saveSettings + 1)
    setShowModal(false)
  }

  /**
 * Al clicar en cancelar sale del modal sin guardar las configuraciones.
 * @function closeModalWithoutSaving
 */
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
      <Header></Header>
      <button id="goBack__button" className='lobbyJoined__goBackButton--width' onClick={handleLeave}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">LEAVE CURRENT LOBBY</span>
      </button>
      {window.network.getShowSettings()
        ? (<div>
          <button className="noBtn" onClick={() => setShowModal(true)}><img className="settings" src={settings} alt='SETTINGS' height={'70px'}></img></button>
          <Modal
            style={{
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

            <Settings
              fetchSettings={fetchSettings}
              errorMessage={errorMessage}
              saveSettings={saveSettings}
            ></Settings>
            <br></br>
            <div className="lobbyModal__buttons">
              <button
                className="pixel-button lobby-modalBtn"
                id="saveSettings"
                onClick={() => saveChangedSettings()}
              >
                Save
              </button>
            </div>
          </Modal>
          {/* <QuestionLibrary questionsData={questionsData}></QuestionLibrary> */}
        </div>)
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
