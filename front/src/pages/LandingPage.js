import '../styles/normalize.css'
import '../styles/LandingPage.css'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import logo from '../img/Logo.gif'
import { Loader } from '../components/Loading'
import IconUser from '../components/IconUser'

function LandingPage() {
  const cookies = new Cookies()
  const [isUserLogged, setisUserLogged] = useState('')
  localStorage.setItem("lastPage", "")
  useEffect(() => {
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
          setisUserLogged(true)
        } else {
          setisUserLogged(false)
        }
      })
  }, [])

  return (
    <div>
      {isUserLogged === true && (
        <IconUser />
      )}
      <div className='landingPage'>
        <Loader />
        <img src={logo} alt='codeXpert' className='landingPage__codexpert'></img>
        <p>Welcome to <b>code<mark>X</mark>pert</b>, where your dreams come true.</p>
        <br />
        {isUserLogged === '' && (
          <button className='pixel-button loading'>LOADING<Loader /></button>
        )}
        {isUserLogged === false && (
          <Link to='/login'>
            <button className='pixel-button'>Get Started</button>
          </Link>
        )}
        {isUserLogged === true && (
          <Link to='/lobbies'>
            <button className='pixel-button'>Lobbies</button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default LandingPage
