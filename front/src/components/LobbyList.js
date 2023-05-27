import React from 'react'
import '../styles/normalize.css'
import Header from '../components/Header'
import lobbyTitle from '../img/lobbies.gif'
import arrow from '../img/arrow.gif'
import PropTypes from 'prop-types'

LobbyList.propTypes = {
  lobbyName: PropTypes.string,
  lobbyList: PropTypes.array,
  errorMessage: PropTypes.string,
  setJoined: PropTypes.func,
  setLobbyList: PropTypes.func,
  setLobbyName: PropTypes.func,
  setErrorMessage: PropTypes.func
}

/**
 * Listado de personas que estan en la lobby
 * @function LobbyList
 * @param lobbyName string de nombre de texto a introducir como nombre.
 * @param setLobbyName useState para cambiar el nombre de la nueva lobby.
 * @param lobbyList array para mostrar la lista de salas que hay disponibles.
 * @param errorMessage string de error al poner un nombre igual o al no poder entrar en la lobby.
 * @param setErrorMessage useState para cambiar el mensaje de error.
 */
function LobbyList({ lobbyName, setLobbyName, lobbyList, errorMessage, setErrorMessage }) {
  /**
 * Al clicar hace las comprovaciones para ver si puede crear un lobby o no, en caso de que si crea la lobby.
 * @function handleSubmit
 */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (lobbyName === '') {
      document.getElementById('lobbyName').setAttribute('class', 'lobbiesForm__inputGroup red animate__animated  animate__shakeX')
      console.log(e)
      setTimeout(() => {
        document.getElementById('lobbyName').setAttribute('class', 'lobbiesForm__inputGroup red')
        console.log('color:' + document.getElementById('inputName').style.backgroundColor)
        document.getElementById('lobbyName').before.backgroundColor = document.getElementById('inputName').style.backgroundColor
        document.getElementById('lobbyName').after.backgroundColor = document.getElementById('inputName').style.backgroundColor
      }, 500)
    } else {
      window.postMessage({
        type: 'new_lobby-emit',
        lobby_name: lobbyName
      }, '*')
      window.postMessage({
        type: 'join_room-emit',
        lobby_name: lobbyName,
        rank: 'Owner'
      }, '*')
    }
  }

  /**
 * Al clicar hace las comprovaciones de si se puede unir o no, y en caso de que si se une.
 * @function handleJoin
 */
  const handleJoin = (e) => {
    e.preventDefault()
    setLobbyName(e.target.id)
    window.postMessage({
      type: 'join_room-emit',
      lobby_name: e.target.id,
      rank: 'Member'
    }, '*')

    setErrorMessage('')
    window.network.setShowSettings(false)
  }

  return (
    <main>
      <Header></Header>
      <div id='lobbyList' className='lobbies__lobbylist lobbylist'>
        <div className='lobbylist__container'>
          <img
            className='lobbies__title'
            src={lobbyTitle} alt='LOBBIES'
          />
          <ul className='lobbies__table table'>
            <li className='table__header'>
              <div className='col col-1'>Lobby Name</div>
              <div className='col col-2'>Avg. Elo</div>
              <div className='col col-3'>Owner</div>
              <div className='col col-4'>Players</div>
            </li>
            <div className='table__body'>
              {lobbyList.length === 0 &&
                <div className='lobbies__noLobbies'>
                  <h1>There are no lobbies yet</h1>
                  <h2>You can create one!!</h2>
                  <img
                    src={arrow} alt=' ' height='100px'
                  />
                </div>
              }
              {Array.isArray(lobbyList)
                ? lobbyList.map((element, index) => {
                  return (
                    <li
                      className='table__row row'
                      style={{ cursor: 'pointer' } | element.started ? { opacity: '0.75' } : { opacity: '1' }}
                      onClick={handleJoin}
                      key={index}
                      id={element.lobby_name}
                    >
                      <div
                        id={element.lobby_name}
                        className='col col-1'
                        data-label='Lobby Name'
                      >
                        {element.lobby_name}
                      </div>
                      <div
                        id={element.lobby_name}
                        className='col col-2'
                        data-label='Avg elo'
                      >
                        {(element.total_elo / element.members.length).toFixed(0)}
                      </div>
                      <div
                        id={element.lobby_name}
                        className='col col-3'
                        data-label='Owner'
                      >
                        {element.owner_name}
                      </div>
                      <div
                        id={element.lobby_name}
                        className='col col-4'
                        data-label='Players'
                      >
                        {element.members.length} / 10
                      </div>
                      <div className='lobbylist__message' id={element.lobby_name}>
                        {element.started && <h1 id={element.lobby_name}>GAME STARTED</h1>}
                      </div>
                    </li>
                  )
                })
                : null}
            </div>
          </ul>

          <form
            className='lobbies__form'
            onSubmit={handleSubmit}
          >
            <div id='lobbyName'
              className='lobbiesForm__inputGroup'>
              <input
                id='inputName'
                className='lobbiesForm__input'
                value={lobbyName}
                placeholder='INTRODUCE NEW LOBBY NAME'
                type='text'
                onChange={(e) => {
                  setLobbyName(e.target.value)
                }}
                autoComplete='off'
              ></input>
            </div>
            <button className='lobbies__button' >
              Create lobby
            </button>
          </form>
          {errorMessage !== '' && <h2 className='lobbies__error'>{errorMessage}</h2>}
        </div>
      </div>
    </main>

  )
}

export default LobbyList
