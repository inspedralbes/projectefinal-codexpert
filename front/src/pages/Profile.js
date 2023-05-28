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
import Header from '../components/Header'
import { Loading } from '../components/Loading'

Modal.setAppElement('body')

/**
 * Pagina que muestra los datos del usuario.
 * @function Profile
 */
function Profile() {

  /**
 * Funcion que devuelve el enlace de la pagina actual.
 * @function getCurrentURL
 */
  function getCurrentURL() {
    return window.location.href
  }
  const cookies = new Cookies()
  const url = new URL(getCurrentURL())
  const myId = parseInt(cookies.get('userId') !== undefined ? cookies.get('userId') : -1)
  const userId = url.searchParams.get('id') !== null ? parseInt(url.searchParams.get('id')) : myId
  const navigate = useNavigate()
  const [cannotAdd, setCannotAdd] = useState()
  const [totalElo, setTotalElo] = useState(0)
  const [userData, setUserData] = useState()
  const [friendList, setFriendList] = useState([])
  const [gameHistory, setGameHistory] = useState([])
  const [editUser, setEditUser] = useState({})
  const [modals, setModals] = useState({
    name: false,
    email: false,
    password: false
  })


  /**
 * Funcion que comprueva si se puede añadir el usuario en caso de no ser uno mismo y que no esten agregados o solicitados.
 * @function getCannotAdd
 */
  const getCannotAdd = () => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)

    fetch(routes.fetchLaravel + 'getNotAddFriend', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setCannotAdd(data)
      })
  }

  /**
 * Funcion que recibe los datos del usuario a mostrar en el perfil.
 * @function getUserData
 */
  const getUserData = () => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    if (userId === myId) {
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
    } else {
      const dataFromUser = new FormData()
      dataFromUser.append('userId', userId)
      fetch(routes.fetchLaravel + 'getUserDataFromId', {
        method: 'POST',
        mode: 'cors',
        body: dataFromUser,
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

  }

  /**
 * Funcion envia por socket la petición para agregar al usuario.
 * @function AddFriend
 */
  const AddFriend = (userId) => {
    window.postMessage(
      {
        type: 'send_friend_notification-emit',
        data: {
          userId
        }
      },
      '*'
    )
    const userInfo = new FormData()
    userInfo.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    userInfo.append('otherUserId', userId)
    fetch(routes.fetchLaravel + 'addFriend', {
      method: 'POST',
      mode: 'cors',
      body: userInfo,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then(() => {

      })
  }

  /**
 * Funcion que recibe la lista de usuarios que ya tiene agregado el usuario.
 * @function getUserFriendList
 */
  const getUserFriendList = () => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'getFriendlist', {
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
          setFriendList(data)
        }
      })
  }

  const getGameHistory = () => {
    const id = new FormData()
    id.append('userId', userId)
    fetch(routes.fetchLaravel + 'getUserDataFromId', {
      method: 'POST',
      mode: 'cors',
      body: id,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setGameHistory(data.games.original)

        let total = 0
        for(let i = 0; i < data.games.original.length; i++) {
          total += data.games.original[i].eloEarned
        }
        setTotalElo(total)
      })
  }

  const getUserDataFromId = (id, friendId) => {
    const userId = new FormData()
    userId.append('userId', id)
    fetch(routes.fetchLaravel + 'getUserDataFromId', {
      method: 'POST',
      mode: 'cors',
      body: userId,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById('friendId' + friendId).innerHTML = `
        <td><p class='center'>${data.name}</p></td>
        <td><img class='center' width='50px' src="${data.avatar}"></img></td>`
      })
  }

  useEffect(() => {
    getCannotAdd()
    getUserData()
    getUserFriendList()
    setEditUser(userData)
    getGameHistory()
  }, [])

  /**
 * Funcion hace peticiona al Laravel para guardar los nuevos datos introducidos de nombre y/o correo.
 * @function saveChanges
 */
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

  /**
 * Funcion que comprueva si el usuario puede agregar al usuario que esta viendo.
 * @function checkIfCanAdd
 */
  const checkIfCanAdd = (currentUserId) => {
    let canAdd = true

    if (cannotAdd.includes(currentUserId)) {
      canAdd = false
    }

    return canAdd
  }

  /**
 * Funcion que guarda la contraseña que haya cambiado el usuario.
 * @function savePassword
 */
  const savePassword = () => {
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
      <>
        <Header></Header>
        <div className='profile'>
          <div className='profile--grid'>
            <div className='profile__left'>
              <div className='profileBack__button'>
                <button onClick={() => localStorage.getItem("lastPage") !== undefined ? navigate("/" + localStorage.getItem("lastPage")) : navigate('/competitive')} id='goBack__button'>
                  <span className='circle' aria-hidden='true'>
                    <span className='icon arrow'></span>
                  </span>
                  <span className='button-text'>BACK</span>
                </button>
                <h1>Total Elo: {totalElo}</h1>
              </div>
              <div className='profile__table' id="scroll">
                <h1>Game History</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Finished position</th>
                      <th>Hearts remaining</th>
                      <th>Elo earned</th>
                      <th>Completed all questions</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameHistory.map((element, index) => {
                      return <tr key={index}>
                        <td>{element.finished_position === 0 ? 'AFK' : element.finished_position}</td>
                        <td>
                        <div>
                {element.hearts_remaining > 3 && (
                  <div className="hearts__remaining">
                    <h1 className="hearts__remaining" style={{fontSize: "25px"}}>
                      <img
                        src={require('../img/hearts/one_heart_normal.png')}
                        width="30px"
                        className="user__health"
                        alt={element.hearts_remaining + ' hearts remaining'}
                      />
                      {element.unlimitedHearts
                        ? (
                        <img
                          src={require('../img/hearts/infinito.png')}
                          width="30px"
                          className="user__health"
                          alt="infinity"
                        />)
                        : (
                        ` x${element.hearts_remaining}`
                          )}
                    </h1>
                  </div>
                )}
                {element.hearts_remaining === 3 && (
                  <img
                    src={require('../img/hearts/three_hearts.png')}
                    height="30px"
                    className="user__health"
                    alt={element.hearts_remaining + ' hearts remaining'}
                  />
                )}

                {element.hearts_remaining === 2 && (
                  <img
                    src={require('../img/hearts/two_hearts.gif')}
                    height="30px"
                    className="user__health"
                    alt={element.hearts_remaining + ' hearts remaining'}
                  />
                )}

                {element.hearts_remaining === 1 && (
                  <img
                    src={require('../img/hearts/one_heart.gif')}
                    height="30px"
                    className="user__health"
                    alt={element.hearts_remaining + ' hearts remaining'}
                  />
                )}
              </div>
                        </td>
                        <td>+{element.eloEarned}</td>
                        <td>{element.completedAllQuestions === 0 ? 'no' : 'yes'}</td>
                        <td>{element.date}</td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
              <Modal
                onRequestClose={() => setModals(prev => ({ ...prev, name: false }))}
                shouldCloseOnOverlayClick={true}
                isOpen={modals.name}
              >
                <button className='cross' onClick={() => setModals(prev => ({ ...prev, name: false }))}><img src={cross} alt='X' height={'30px'}></img></button>
                <h1>Change your username</h1>
                <input className='profile__input' placeholder='username' onChange={(e) => setEditUser(prev => ({ ...prev, name: e.target.value }))}></input><br></br>
                <input className='profile__input' id="passwordUsername" type='password' placeholder='password' onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input>
                <Eye id={"passwordUsername"}></Eye>
                <div className='profile__buttons'>
                  <button className='pixel-button modalBtn close' onClick={() => setModals(prev => ({ ...prev, name: false }))}>Close</button>
                  <button className='pixel-button modalBtn' onClick={() => saveChanges('newName')}>Save</button>
                </div>
              </Modal>
              <div className='profile__settings'>
                {myId === userId && (
                  <Modal
                    onRequestClose={() => setModals(prev => ({ ...prev, email: false }))}
                    shouldCloseOnOverlayClick={true}
                    isOpen={modals.email}
                  >
                    <button className='cross' onClick={() => setModals(prev => ({ ...prev, email: false }))} ><img src={cross} alt='X' height={'30px'}></img></button>
                    <h1>Change your email</h1>
                    <input className='profile__input' placeholder='email' onChange={(e) => setEditUser(prev => ({ ...prev, email: e.target.value }))}></input><br></br>
                    <input className='profile__input' id="passwordEmail" type='password' placeholder='password' onChange={(e) => setEditUser(prev => ({ ...prev, password: e.target.value }))}></input>
                    <Eye id={"passwordEmail"}></Eye>
                    <div className='profile__buttons'>
                      <button className='pixel-button modalBtn close' onClick={() => setModals(prev => ({ ...prev, email: false }))}>Close</button>
                      <button className='pixel-button modalBtn' onClick={() => saveChanges('newEmail')}>Save</button>
                    </div>
                  </Modal>
                )}
              </div>

              <Modal
                style={{
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
              <div>
              {myId !== userId && (
                  <div>
                    <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                  </div>
                )}
                <div className='profile__name--div'>
                
                  <p className='profile__name'>{userData.name}</p>
                  {myId === userId && (
                    <button className='editBtn' onClick={() => setModals(prev => ({ ...prev, name: true }))}><img height='35px' className='edit' src={Edit} alt='EDIT'></img></button>
                  )}
                </div>
                {myId === userId && (
                  <div className='profile__email--div'>
                    <p className='profile__email'>{userData.email}</p>
                    <button className='editBtn' onClick={() => setModals(prev => ({ ...prev, email: true }))}><img height='35px' className='edit' src={Edit} alt='EDIT'></img></button>
                  </div>
                  )}
              </div>

              <div id='editAvatar' className='profile__editAvatar'>
                <div className='profile__img'>
                  <img className='profile__avatar' src={userData.avatar}></img>
                </div>
                {myId === userId
                  ? <>
                    <button className='pixel-button profileBtn' onClick={() => navigate('/avatarMaker')}>Edit avatar</button>
                    <button className='pixel-button profileBtn' onClick={() => setModals(prev => ({ ...prev, password: true }))}>Change password</button>
                    <h1>FRIENDS</h1>
                    <div className='profile__friends--div' id='scroll'>
                      <table className='profile__friends'>
                        <tbody>
                          {friendList.map((element, index) => {
                            { getUserDataFromId(element.receiver_id, index) }
                            return <tr id={'friendId' + index} key={index}>
                            </tr>
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>

                  : checkIfCanAdd(userId) ? <button id={'userId' + userId} className='pixel-button profileBtn'
                    onClick={() => {
                      AddFriend(`${userId}`)
                      document.getElementById('userId' + userId).style.display = 'none'
                    }}>Add Friend</button> : null
                }
              </div>
            </div>
          </div >
        </div >
      </>
    )
  } else {
    return (
      <Loading></Loading>
    )
  }

}
export default Profile
