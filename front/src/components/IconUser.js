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
  }, [])

  const handleLogOut = () => {
    const token = new FormData()
    token.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )
    fetch(routes.fetchLaravel + 'logout', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then(() => {
        const nCookies = document.cookie.split('')

        for (let i = 0; i < nCookies.length; i++) {
          const cookie = nCookies[i]
          const eqPos = cookie.indexOf('=')
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = name + '=expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      })
    localStorage.clear()
    if (window.location.pathname === '/') {
      window.location.reload()
    } else {
      navigate('/')
    }
  }

  return (
    <>
      {avatarURL !== '' && (
        <div className="container">
          {avatarURL !== null
            ? (
              <button
                type="button"
                className="button"
                onClick={handleButtonClick}
              >
                <img
                  className="button__image"
                  alt="avatar"
                  src={avatarURL}
                  height="50"
                  width="50"
                ></img>
              </button>)
            : (
              <Loader className="loader" />)}
          {state && (
            <div className="dropdown">
              <ul className="dropdown__list list">
                <li className="list__item" onClick={() => navigate('/profile')}>
                  <button
                    className="button"
                  >
                    Profile
                  </button>
                </li>
                <li className="list__item" onClick={() => handleLogOut()}>
                  {' '}
                  <button className="button">
                    Log Out
                  </button>
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
