import '../styles/normalize.css'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
Modal.setAppElement('body')

function Profile () {
  const navigate = useNavigate()
  const cookies = new Cookies()
  const [userData, setUserData] = useState({})
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
      method: 'GET',
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

  return (
    <div>
      <button className='pixel-button' onClick={() => navigate('/')}>Main Menu</button>
      <table>
        <tbody>
          <tr>
            <td><p>{userData.name}</p></td>
            <td><button onClick={() => setModals(prev => ({ ...prev, name: true }))}>Edit</button></td>
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
              onRequestClose={() => setModals(prev => ({ ...prev, name: false }))}
              shouldCloseOnOverlayClick={true}
              isOpen={modals.name}
            >
              <h1>Change your username</h1>
              <input placeholder='username' onChange={(e) => setEditUser(prev => ({ ...prev, name: e.target.value }))}></input><br></br>
              <input placeholder='password' onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input><br></br>
              <button onClick={() => setModals(prev => ({ ...prev, name: false }))}>Close</button>
              <button onClick={() => saveChanges('newName')}>Save</button>

            </Modal>
          </tr>
          <tr>
            <td><p>{userData.email}</p></td>
            <td><button onClick={() => setModals(prev => ({ ...prev, email: true }))}>Edit</button></td>
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
              onRequestClose={() => setModals(prev => ({ ...prev, email: false }))}
              shouldCloseOnOverlayClick={true}
              isOpen={modals.email}
            >
              <h1>Change your email</h1>
              <input placeholder='email' onChange={(e) => setEditUser(prev => ({ ...prev, email: e.target.value }))}></input><br></br>
              <input placeholder='password' onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input><br></br>
              <button onClick={() => setModals(prev => ({ ...prev, email: false }))}>Close</button>
              <button onClick={() => saveChanges('newEmail')}>Save</button>

            </Modal>
          </tr>
          <tr>
            <td><button onClick={() => setModals(prev => ({ ...prev, password: true }))}>Change password</button></td>
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
              <h1>Update password</h1>
              <input placeholder='Current password' onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input><br></br>
              <input placeholder='New password' onChange={(e) => setEditUser(prev => ({ ...prev, newPassword: e.target.value }))}></input><br></br>
              <input placeholder='Repeat new password' onChange={(e) => setEditUser(prev => ({ ...prev, rNewPassword: e.target.value }))}></input><br></br>
              <button onClick={() => setModals(prev => ({ ...prev, password: false }))}>Close</button>
              <button onClick={() => savePassword('newPassword')}>Save</button>

            </Modal>
          </tr>

        </tbody>
      </table>
      <img src={userData.avatar}></img>
      <button className='pixel-button' onClick={() => navigate('/avatarMaker')}>Edit avatar</button>
    </div>
  )
}

export default Profile
