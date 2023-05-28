import '../styles/normalize.css'
import '../styles/form.css'
import React, { useState, useEffect } from 'react'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import { Link, useNavigate } from 'react-router-dom' // Rutas
import Eye from '../components/Eye'
import '../styles/responsive.css'

/**
 * Pagina que permite al usuario iniciar sessión.
 * @function Login
 */
function Login() {
  const [login, setLogin] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('')
  const cookies = new Cookies()
  const navigate = useNavigate()

  /**
 * En caso de que el usuario haya hecho el tutorial se guardarán los datos de localstorage de este.
 * @function sendTutorialLocalStorageData
 */
  const sendTutorialLocalStorageData = (token) => {
    if (
      localStorage.getItem('tutorialsAnswered') !== null &&
      localStorage.getItem('userExperience') !== null
    ) {
      const data = new FormData()
      data.append('token', token)
      data.append(
        'tutorialsAnswered',
        localStorage.getItem('tutorialsAnswered')
      )
      data.append('tutorialPassed', localStorage.getItem('tutorialPassed'))
      data.append('userExperience', localStorage.getItem('userExperience'))

      fetch(routes.fetchLaravel + 'setUserTutorial', {
        method: 'POST',
        mode: 'cors',
        body: data,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
        })
    }
  }

  useEffect(() => {
    if (login !== 0) {
      const user = new FormData()
      user.append('email', email)
      user.append('password', password)

      fetch(routes.fetchLaravel + 'login', {
        method: 'POST',
        mode: 'cors',
        body: user,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.valid) {
            // Si se ha logueado
            cookies.set('token', data.token, { path: '/' })
            cookies.set('userId', data.userId, { path: '/' })
            window.postMessage(
              {
                type: 'send_token-emit',
                token: cookies.get('token')
              },
              '*'
            )
            window.network.setUserLogged(true)

            sendTutorialLocalStorageData(data.token)
            localStorage.clear()
            navigate('/codeworld')
          } else {
            setErrorText(data.message)
          }
        })
    }
  }, [login])

  /**
 * Al clicar la tecla Enter tambien se hará peticion de inicio de sessión.
 * @function handleKeyDown
 */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setLogin(login + 1)
    }
  }
  return (
    <div className="form">
      <h1 className='login-header'>LOGIN</h1>
      <br />
      <div className="form__form">
        <div className="form__inputGroup">
          <input
            id="email"
            className="form__input"
            placeholder=" "
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
          <span className="form__inputBar"></span>
          <label htmlFor="email" className="form__inputlabel">
            E-mail
          </label>
        </div>
        <div className="form__inputGroup">
          <input
            id="password"
            className="form__input"
            placeholder=" "
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          ></input>

          <span className="form__inputBar"></span>
          <Eye id={'password'}></Eye>
          <label htmlFor="password" className="form__inputlabel">
            Password
          </label>
          <br />
          <p className='error-text'>{errorText}</p>
        </div>
      </div>
      <div className="form__buttonsLinks">
        <div className="form__buttons">
          <Link to="/">
            <div className="form__goBack">
              <div className="form__button--flex">
                <button id="goBack__button">
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">GO BACK</span>
                </button>
              </div>
            </div>
          </Link>

          <div className="form__submit submit">
            <button onClick={() => setLogin(login + 1)} id="submit__button">
              <span className="circle2" aria-hidden="true">
                <span className="icon2 arrow2"></span>
              </span>
              <span className="button-text">SUBMIT</span>
            </button>
          </div>
        </div>
        <div className="form__links link">
          <Link className="link__CreateAcc" to="/register">
            <p>Create account</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
