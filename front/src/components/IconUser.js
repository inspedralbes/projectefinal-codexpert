import '../styles/normalize.css'
import '../styles/IconUser.css'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import { Loader } from '../components/Loading'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function IconUser() {
  const navigate = useNavigate()
  const cookies = new Cookies()
  const [state, setState] = useState(false)
  const [avatarURL, setAvatarURL] = useState(null)
  const handleButtonClick = () => {
    setState(!state)
  }
  useEffect(() => {
    const token = new FormData()
    token.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )
    fetch(routes.fetchLaravel + 'getAvatar', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setAvatarURL(data.url)
      })

    window.addEventListener('click', function (e) {
      if (document.getElementById('iconUser__button') !== null && !document.getElementById('iconUser__button').contains(e.target)) {
        setState(state)
      }
    })
  }, [])

  const handleLogOut = () => {
    const token = new FormData()
    token.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.clear()
    fetch(routes.fetchLaravel + 'logout', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then(() => {
        if (window.location.pathname === '/') {
          window.location.reload()
        } else {
          navigate('/')
        }
      })
  }

  return (
    <>
      {avatarURL !== '' && (
        <div className="iconUser__container">
          {avatarURL !== null
            ? (<button
              type="button"
              id="iconUser__button"
              className="iconUser__button"
              onClick={handleButtonClick}
            >
              <img
                className="iconUser-boton__image"
                alt="avatar"
                src={avatarURL}
                height="60"
                width="60"
              ></img>
            </button>)
            : (
              <Loader className="loader" />)}
          {state && (
            <div className="iconUser-dropdown">
              <ul className="iconUser-dropdown__list">
                <li
                  className="iconUser-list__item"
                  onClick={() => {
                    navigate(`/profile?id=${cookies.get('userId')}`)
                    window.location.reload()
                  }}
                >
                  <button className="iconUser__button">Profile</button>
                </li>
                <li
                  className="iconUser-list__item"
                  onClick={() => navigate('/codeworld')}
                >
                  {' '}
                  <button className="iconUser__button">Code World</button>
                </li>
                <li
                  className="iconUser-list__item"
                  onClick={() => navigate('/lobbies')}
                >
                  {' '}
                  <button className="iconUser__button">Lobby List</button>
                </li>
                <li
                  className="iconUser-list__item"
                  onClick={() => navigate('/library')}
                >
                  {' '}
                  <button className="iconUser__button">My Library</button>
                </li>
                <li
                  className="iconUser-list__item"
                  onClick={() => handleLogOut()}
                >
                  {' '}
                  <button className="iconUser__button">Log Out</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default IconUser
