import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import '../styles/Lobbies.css'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import { Loading } from '../components/Loading'
import LobbyList from '../components/LobbyList'
import JoinedLobby from '../components/JoinedLobby'

function Lobbies() {
  const [lobbyList, setLobbyList] = useState([])
  const [lobbyName, setLobbyName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [joinedLobby, setJoined] = useState(false)
  const [firstTime, setFirstTime] = useState(true)
  const [fetchUser, setFetchUser] = useState(false)

  const navigate = useNavigate()
  const cookies = new Cookies()

  const handleMessage = (event) => {
    const eventData = event.data
    localStorage.setItem("lastPage", "lobbies")

    switch (eventData.type) {
      case 'YOU_ARE_ON_LOBBY-event':
        setLobbyName(window.network.getLobbyName())
        setJoined(true)
        break

      case 'lobby_name-event':
        setLobbyName(window.network.getLobbyName())
        break

      case 'lobbies_list-event':
        setLobbyList(window.network.getLobbyList())
        break

      case 'game_started-event':
        navigate('/game')
        break

      case 'LOBBY_FULL_ERROR-event':
        setLobbyName('')
        setJoined(false)
        setErrorMessage(window.network.getMessage())
        break

      case 'ALREADY_ON_LOBBY-event':
        setErrorMessage(window.network.getMessage())
        setJoined(false)
        break

      case 'LOBBY_ALREADY_EXISTS-event':
        setErrorMessage(window.network.getMessage())
        setJoined(false)
        break

      default:
        break
    }
  }

  useEffect(() => {
    if (document.cookie.indexOf('token' + '=') !== -1) {
      const token = new FormData()
      token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
      fetch(routes.fetchLaravel + 'isUserLogged', {
        method: 'POST',
        mode: 'cors',
        body: token,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.correct) {
            setFetchUser(true)
          } else {
            navigate('/login')
          }
        })
    } else {
      navigate('/login')
    }

    if (firstTime) {
      window.postMessage({
        type: 'hello_firstTime-emit'
      }, '*')
      setFirstTime(true)
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  if (fetchUser) {
    return (
      <div className='lobbies'>

        {!joinedLobby && (
          <LobbyList lobbyName={lobbyName} setLobbyName={setLobbyName} lobbyList={lobbyList} setJoined={setJoined} errorMessage={errorMessage} setErrorMessage={setErrorMessage}></LobbyList>
        )}

        {joinedLobby && (
          <JoinedLobby setJoined={setJoined} setLobbyName={setLobbyName} setLobbyList={setLobbyList} errorMessage={errorMessage} setErrorMessage={setErrorMessage}></JoinedLobby>
        )
        }
      </div>
    )
  } else {
    return (
      <Loading></Loading>
    )
  }
}

export default Lobbies
