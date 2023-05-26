import '../styles/normalize.css'
import '../styles/LandingPage.css'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import logo from '../img/logo.gif'
import { Loader } from '../components/Loading'
import Header from '../components/Header'
import '../styles/responsive.css'

/**
 * Pagina principal de codeXpert.
 * @function LandingPage
 */
function LandingPage() {
  const cookies = new Cookies()
  const [isUserLogged, setisUserLogged] = useState('')
  localStorage.setItem('lastPage', '')
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
        setisUserLogged(data.correct)
        window.network.setUserLogged(data.correct)
      })
  }, [])

  return (
    <div>
      {isUserLogged && (
        <Header />
      )}
      <div className='landingPage'>
        <Loader />
        <img src={logo} alt='codeXpert' className='landingPage__codexpert'></img>
        <p className='codexpert__intro'>Welcome to <b>code<mark>X</mark>pert</b>, where you can learn <b>JavaScript</b> while competing and having fun with your friends.</p>
        <br />
        {isUserLogged === '' && (
          <button className='pixel-button loading'>LOADING<Loader /></button>
        )}
        {isUserLogged !== '' && (
          <Link to='/codeworld'>
            <button className='pixel-button landingbtn'>PLAY NOW</button>
          </Link>
        )}
        {isUserLogged === false && (
          <div className='landingLogin--div'>
            <Link className='landingLogin' to='/login'>
              Login/Register
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage
