import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { Link, useNavigate } from 'react-router-dom' // Rutas
import routes from '../conn_routes'
import Tippy from '@tippyjs/react' // Tooltip
import 'tippy.js/dist/tippy.css' // Tooltip styles
import 'tippy.js/themes/light-border.css' // Tooltip theme
import 'tippy.js/animations/shift-away-extreme.css' // Tooltip animation
import informationIcon from '../img/information_icon.gif'
import Eye from '../components/Eye'
import parse from 'html-react-parser'
import '../styles/form.css'

/**
 * Pagina para que el usuario pueda registrarse.
 * @function Register
 */
function Register() {
  const [errorText, setErrorText] = useState('')

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    passwordValidation: ''
  })
  const [color, setColor] = useState({
    username: 'red',
    email: 'red',
    password: 'red',
    passwordValidation: 'red'
  })

  const cookies = new Cookies()
  const navigate = useNavigate()

  /**
 * Al clicar la tecla Enter tambien se hará peticion de registro.
 * @function handleKeyDown
 */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  /**
 * En caso de que el usuario haya hecho el tutorial se guardarán los datos de localstorage de este.
 * @function sendTutorialLocalStorageData
 */
  const sendTutorialLocalStorageData = (token) => {
    if (localStorage.getItem('tutorialsAnswered') !== null && localStorage.getItem('userExperience') !== null) {
      const data = new FormData()
      data.append('token', token)
      data.append('tutorialsAnswered', localStorage.getItem('tutorialsAnswered'))
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
    if (userData.username.length >= 3 && userData.username.length <= 20) {
      setColor({ ...color, username: 'green' })
    } else {
      setColor({ ...color, username: 'red' })
    }
  }, [userData.username])

  useEffect(() => {
    if (
      userData.email.length <= 255 &&
      userData.email.includes('@') &&
      userData.email.includes('.')
    ) {
      setColor({ ...color, email: 'green' })
    } else {
      setColor({ ...color, email: 'red' })
    }
  }, [userData.email])

  useEffect(() => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&.])[a-zA-Z0-9@$!%*#?&.]{6,255}$/
    if (regex.test(userData.password)) {
      setColor({ ...color, password: 'green' })
    } else {
      setColor({ ...color, password: 'red' })
    }
  }, [userData.password])

  useEffect(() => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&.])[a-zA-Z0-9@$!%*#?&.]{6,255}$/
    if (
      userData.passwordValidation === userData.password &&
      regex.test(userData.passwordValidation)
    ) {
      setColor({ ...color, passwordValidation: 'green' })
    } else {
      setColor({ ...color, passwordValidation: 'red' })
    }
  }, [userData.passwordValidation])

  /**
 * Al clicar envia la peticiona a Laravel para registrarse.
 * @function handleSubmit
 */
  const handleSubmit = () => {
    const user = new FormData()
    user.append('name', userData.username)
    user.append('email', userData.email)
    user.append('password', userData.password)
    user.append('password_confirmation', userData.passwordValidation)

    fetch(routes.fetchLaravel + 'register', {
      method: 'POST',
      mode: 'cors',
      body: user,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
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
          navigate('/avatarMaker')
        } else {
          setErrorText(data.message)
          let regex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&.])[a-zA-Z0-9@$!%*#?&.]{6,255}$/
          if (
            !userData.passwordValidation === userData.password ||
            !regex.test(userData.passwordValidation)
          ) {
            setErrorText('Password don\'t match')
          }
          regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&.])[a-zA-Z0-9@$!%*#?&.]{6,255}$/
          if (!regex.test(userData.password)) {
            setErrorText('Password not correct')
          }
          if (
            userData.email.length > 255 ||
            !userData.email.includes('@') ||
            !userData.email.includes('.')
          ) {
            setErrorText('Incorrect email format')
          }
          if (userData.username.length < 3 || userData.username.length > 20) {
            setErrorText('Incorrect username length')
          }
        }
      })
  }

  return (
    <div className="form register">
      <h1>REGISTER</h1>
      <br />
      <div className="form__form">
        <div className="form__inputGroup">
          <input
            id="username"
            className="form__input"
            style={{ color: color.username }}
            placeholder=" "
            type="text"
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            required
          ></input>
          <span className="form__inputBar"></span>
          <label htmlFor="username" className="form__inputlabel">
            Username
          </label>
        </div>
        <div className="form__inputGroup">
          <input
            id="email"
            className="form__input"
            style={{ color: color.email }}
            placeholder=" "
            type="text"
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
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
            style={{ color: color.password }}
            placeholder=" "
            type="password"
            name="password"
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            required
          ></input>
          <span className="form__inputBar"></span>
          <Eye id={'password'}></Eye>
          <Tippy
              className='form__tooltip'
              theme={'light-border'}
              content={parse('Password must be: <br> · At least 6 characters long.<br> · Contain an uppercase and lowercase letter.<br> · Number and a special character (@$!%*#?&.).')}
              placement={'right'}
              animation={'shift-away-extreme'}
            >
          <label htmlFor="passwd1" className="form__inputlabel" onClick={() => {
            document.getElementById('password').focus()
          }}>
            Password
            <img src={informationIcon} alt="information-tooltip" className='form__tooltip' height="20px" />
          </label>
          </Tippy>
        </div>
        <div className="form__inputGroup">
          <input
            id="repeat_password"
            className="form__input"
            style={{ color: color.passwordValidation }}
            placeholder=" "
            type="password"
            onChange={(e) =>
              setUserData({ ...userData, passwordValidation: e.target.value })
            }
            onKeyDown={handleKeyDown}
            required
          ></input>
          <span className="form__inputBar"></span>
          <Eye id={'repeat_password'}></Eye>
          <label htmlFor="repeat_password" className="form__inputlabel">
            Repeat password{' '}
          </label>
        </div>
      </div>
      <p className='error-text'>{errorText}</p>

      <div className="form__buttonsLinks">
        <div className="form__buttons">
          <Link to="/login">
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
            <button
              onClick={() => handleSubmit()}
              id="submit__button"
            >
              <span className="circle2" aria-hidden="true">
                <span className="icon2 arrow2"></span>
              </span>
              <span className="button-text">SUBMIT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
