/* eslint-disable */

import '../styles/normalize.css'
import '../styles/profile.css'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import Edit from '../img/Edit.png'
import cross from '../img/cross.png'
import Eye from '../components/Eye'
import { Loading } from '../components/Loading'

Modal.setAppElement('body')

function Profile() {
  const navigate = useNavigate()
  const cookies = new Cookies()
  const [userData, setUserData] = useState()
  const [editUser, setEditUser] = useState({})
  const [modals, setModals] = useState({
    name: false,
    email: false,
    password: false
  })

  const getUserData = () => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'getUserData', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          navigate('/login')
        } else {
          setUserData(data)
        }
      })
  }

  useEffect(() => {
    getUserData()
    setEditUser(userData)
  }, [])

  const saveChanges = (type) => {
    const user = new FormData()
    if (type === 'newName') {
      user.append(type, editUser.name)
    } else {
      user.append(type, editUser.email)
    }
    user.append('password', editUser.password)
    user.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + (type === 'newName' ? 'changeUsername' : 'changeEmail'), {
      method: 'POST',
      mode: 'cors',
      body: user,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then(() => {
      })
    setModals(prev => ({ ...prev, name: false }))
    setUserData(prev => ({ ...prev, name: editUser.name, email: editUser.email }))
  }

  const savePassword = () => {
    // currentPassword, newPassword, newPassword_confirmation
    const password = new FormData()
    password.append('currentPassword', editUser.password)
    password.append('newPassword', editUser.newPassword)
    password.append('newPassword_confirmation', editUser.rNewPassword)
    password.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'changePassword', {
      method: 'POST',
      mode: 'cors',
      body: password,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then(() => {
      })
    setModals(prev => ({ ...prev, password: false }))
  }

  if (userData !== undefined) {
    return (
      <div className='profile'>
        <div className='profile--grid'>
          <div className='profile__left'>
            <div className='profile__button'>
              <button onClick={() => localStorage.getItem("lastPage") !== undefined ? navigate("/" + localStorage.getItem("lastPage")) : navigate('/lobbies')} id='goBack__button'>
                <span className='circle' aria-hidden='true'>
                  <span className='icon arrow'></span>
                </span>
                <span className='button-text'>BACK</span>
              </button>
              <div></div>
            </div>
            <Modal
              onRequestClose={() => setModals(prev => ({ ...prev, name: false }))}
              shouldCloseOnOverlayClick={true}
              isOpen={modals.name}
            >
              <button className='cross' onClick={() => setModals(prev => ({ ...prev, name: false }))}><img src={cross} alt='X' height={'30px'}></img></button>

              <h1>Change your username</h1>
              <input className='profile__input' placeholder='username' onChange={(e) => setEditUser(prev => ({ ...prev, name: e.target.value }))}></input><br></br>
              <input className='profile__input' type='password' placeholder='password' onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input>
              <Eye id={"passwordUsername"}></Eye>
              <br></br>
              <div className='profile__buttons'>
                <button className='pixel-button modalBtn close' onClick={() => setModals(prev => ({ ...prev, name: false }))}>Close</button>
                <button className='pixel-button modalBtn' onClick={() => saveChanges('newName')}>Save</button>
              </div>
            </Modal>
            <div className='profile__settings'>
              <div className='profile__email--div'>
                <p className='profile__email'>{userData.email}</p>
                <button className='editBtn' onClick={() => setModals(prev => ({ ...prev, email: true }))}><img height='35px' className='edit' src={Edit} alt='EDIT'></img></button>
                <Modal
                  onRequestClose={() => setModals(prev => ({ ...prev, email: false }))}
                  shouldCloseOnOverlayClick={true}
                  isOpen={modals.email}
                >
                  <button className='cross' onClick={() => setModals(prev => ({ ...prev, email: false }))} ><img src={cross} alt='X' height={'30px'}></img></button>

                  <h1>Change your email</h1>
                  <input className='profile__input' placeholder='email' onChange={(e) => setEditUser(prev => ({ ...prev, email: e.target.value }))}></input><br></br>
                  <input className='profile__input' placeholder='password' onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input><br></br>
                  <div className='profile__buttons'>
                    <button className='pixel-button modalBtn close' onClick={() => setModals(prev => ({ ...prev, email: false }))}>Close</button>
                    <button className='pixel-button modalBtn' onClick={() => saveChanges('newEmail')}>Save</button>
                  </div>
                </Modal>
              </div>
              <div className='profile__password--grid'>
                <button className='profile__pswd pixel-button' onClick={() => setModals(prev => ({ ...prev, password: true }))}>Change password</button>
              </div>
            </div>

            <Modal
              style={{ // QUITAR Y PERSONALIZAR ESTILOS CUANDO SE APLIQUE CSS
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  marginRight: '-50%',
                  transform: 'translate(-50%, -50%)'
                }
              }}
              onRequestClose={() => setModals(prev => ({ ...prev, password: false }))}
              shouldCloseOnOverlayClick={true}
              isOpen={modals.password}
            >
              <button className='cross' onClick={() => setModals(prev => ({ ...prev, password: false }))}><img src={cross} alt='X' height={'30px'}></img></button>

              <h1>Update password</h1>
              <input className='profile__input' id="passwordUpdate" type='password' placeholder='Current password' onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input>
              <Eye id={"passwordUpdate"}></Eye>
              <br></br>
              <input className='profile__input' id="passwordNew" type='password' placeholder='New password' onChange={(e) => setEditUser(prev => ({ ...prev, newPassword: e.target.value }))}></input>
              <Eye id={"passwordNew"}></Eye>
              <br></br>
              <input className='profile__input' id="passwordConfirm" type='password' placeholder='Repeat new password' onChange={(e) => setEditUser(prev => ({ ...prev, rNewPassword: e.target.value }))}></input>
              <Eye id={"passwordConfirm"}></Eye>
              <br></br>
              <div className='profile__buttons'>
                <button className='pixel-button modalBtn close' onClick={() => setModals(prev => ({ ...prev, password: false }))}>Close</button>
                <button className='pixel-button modalBtn' onClick={() => savePassword('newPassword')}>Save</button>
              </div>

            </Modal >
          </div >
          <div className='profile__right'>
            <div className='profile__name--div'>
              <p className='profile__name'>{userData.name}</p>
              <button className='editBtn' onClick={() => setModals(prev => ({ ...prev, name: true }))}><img height='35px' className='edit' src={Edit} alt='EDIT'></img></button>
            </div>
            <div className='profile__editAvatar'>
              <div className='profile__img'>
                <img className='profile__avatar' src={userData.avatar}></img>
              </div>

              <button className='pixel-button profileBtn' onClick={() => navigate('/avatarMaker')}>Edit avatar</button>
            </div>

          </div>
        </div >
      </div >
    )
  } else {
    return (
      <Loading></Loading>
    )
  }

}
export default Profile
