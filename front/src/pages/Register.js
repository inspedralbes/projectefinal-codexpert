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

function Register() {
  const [registro, setRegistro] = useState(0)

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setRegistro(registro + 1)
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
    console.log()
    if (userData.email.length <= 255 && userData.email.includes('@') && userData.email.includes('.')) {
      setColor({ ...color, email: 'green' })
    } else {
      setColor({ ...color, email: 'red' })
    }
  }, [userData.email])

  useEffect(() => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&.])[a-zA-Z0-9@$!%*#?&.]{6,255}$/
    if (regex.test(userData.password)) {
      setColor({ ...color, password: 'green' })
    } else {
      setColor({ ...color, password: 'red' })
    }
  }, [userData.password])

  useEffect(() => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&.])[a-zA-Z0-9@$!%*#?&.]{6,255}$/
    if (userData.passwordValidation === userData.password && regex.test(userData.passwordValidation)) {
      setColor({ ...color, passwordValidation: 'green' })
    } else {
      setColor({ ...color, passwordValidation: 'red' })
    }
  }, [userData.passwordValidation])

  useEffect(() => {
    if (registro !== 0) {
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
      }).then((response) => response.json()).then((data) => {
        if (data.valid) {
          cookies.set('token', data.token, { path: '/' })
          window.postMessage({
            type: 'send_token-emit',
            token: cookies.get('token')
          }, '*')

          navigate('/avatarMaker')
        } else {
          console.log(data)
        }
      }
      )
    }
  }, [registro])

  return (
    <div className='form register'>
      <h1>REGISTER</h1>
      <br />
      <div className='form__form'>
        <div className='form__inputGroup'>
          <input className='form__input' style={{ color: color.username }} placeholder=' ' type='text' onChange={(e) => setUserData({ ...userData, username: e.target.value })} required></input>
          <span className='form__inputBar'></span>
          <label className='form__inputlabel'>Username</label>
        </div>
        <div className='form__inputGroup'>
          <input className='form__input' style={{ color: color.email }} placeholder=' ' type='text' onChange={(e) => setUserData({ ...userData, email: e.target.value })} required></input>
          <span className='form__inputBar'></span>
          <label className='form__inputlabel'>E-mail</label>
        </div>
        <div className='form__inputGroup'>
          <Tippy theme={'light-border'}
            content={<div>Password must</div>}
            placement={'right'}
            animation={'shift-away-extreme'}

          >
            <img src={informationIcon} alt='' height='20px' />
          </Tippy>

          <input className='form__input' style={{ color: color.password }} placeholder=' ' id="password" type='password' name='password' onChange={(e) => setUserData({ ...userData, password: e.target.value })} required></input>
          <span className='form__inputBar'></span>
          <Eye id={"password"}></Eye>
          <label className='form__inputlabel'>Password
          </label>
        </div>
        <div className='form__inputGroup'>
          <input className='form__input' style={{ color: color.passwordValidation }} placeholder=' ' id="repeat_password" type='password' onChange={(e) => setUserData({ ...userData, passwordValidation: e.target.value })} onKeyDown={handleKeyDown} required></input>
          <span className='form__inputBar'></span>
          <Eye id={"repeat_password"}></Eye>
          <label className='form__inputlabel'>Repeat password </label>
        </div>
      </div>

      <div className='form__buttonsLinks'>
        <div className='form__buttons'>
          <Link to='/login'>
            <div className='form__goBack'>
              <div className='form__button--flex'>
                <button id='goBack__button'>
                  <span className='circle' aria-hidden='true'>
                    <span className='icon arrow'></span>
                  </span>
                  <span className='button-text'>GO BACK</span>
                </button>
              </div>
            </div>
          </Link>

          <div className='form__submit submit'>
            <button onClick={() => setRegistro(registro + 1)} id='submit__button'>
              <span className='circle2' aria-hidden='true'>
                <span className='icon2 arrow2'></span>
              </span>
              <span className='button-text'>SUBMIT</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Register
