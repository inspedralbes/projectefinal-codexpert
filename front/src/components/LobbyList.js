import React from 'react'
import '../styles/normalize.css'
import IconUser from '../components/IconUser'
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

function LobbyList({ lobbyName, setLobbyName, lobbyList, errorMessage, setErrorMessage }) {
  const handleSubmit = (e) => {
    e.preventDefault()
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
      <IconUser></IconUser>
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
            <div className='lobbiesForm__inputGroup'>
              <input
                id='email'
                className='lobbiesForm__input'
                value={lobbyName}
                placeholder='INTRODUCE NEW LOBBY NAME'
                type='text'
                onChange={(e) => {
                  setLobbyName(e.target.value)
                }}
                autoComplete='off'
                required
              ></input>
            </div>
            <button className='lobbies__button' disabled={lobbyName === ''}>
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
