import React, { useState, useEffect } from 'react'
import '../styles/normalize.css'
import '../styles/Bell.css'
import campana from '../img/campana.png'
import campanaNoti from '../img/CampanaNoti.png'
import success from '../img/campaign/success.png'
import deny from '../img/campaign/deny.png'
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import bellSleeping from '../img/bellSleeping.gif'

/**
 * Este componente se usa para ver las notificaciones recibidas de otros usuarios como la de solicitud de amistad.
 * @@function Bell
 */
function Bell() {
  const cookies = new Cookies()
  const [showNotification, setShowNotification] = useState(false)
  const [notificationList, setNotificationList] = useState([''])
  const [unreadNotification, setUnreadNotification] = useState(false)
  const getNotifications = () => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'getPendingRequests', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setUnreadNotification(data.unread)
        setNotificationList(data.list)
      })
  }

  /**
 * Emit para mirar la lista de usuarios
 * @function updateFriends
 */
  const updateFriends = () => {
    window.postMessage({
      type: 'check_friend_list-emit'
    }, '*')
  }

  /**
 * Al clicar en el boton de la campana sale un desplegable con todas las notificaciones.
 * @function handleClick
 */
  const handleClick = () => {
    setShowNotification(!showNotification)
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    if (unreadNotification) {
      fetch(routes.fetchLaravel + 'markNotificationsAsRead', {
        method: 'POST',
        mode: 'cors',
        body: token,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          setUnreadNotification(false)
          getNotifications()
        })
    }
  }

  /**
 * Al clicar acceptas la solicitud de un usuario, por lo tanto se hace una peticion a laravel para guardar este suceso.
 * @function handleAcceptFriend
 */
  const handleAcceptFriend = (otherUserId) => {
    const acceptFriendInfo = new FormData()
    acceptFriendInfo.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    acceptFriendInfo.append('otherUserId', otherUserId)

    fetch(routes.fetchLaravel + 'acceptFriend', {
      method: 'POST',
      mode: 'cors',
      body: acceptFriendInfo,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        getNotifications()
        updateFriends()
      })
  }

  /**
 * Al clicar denegas la solicitud de un usuario, por lo tanto se hace una peticion a laravel para guardar este suceso.
 * @function handleDenyFriend
 */
  const handleDenyFriend = (otherUserId) => {
    const declinetFriendInfo = new FormData()
    declinetFriendInfo.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    declinetFriendInfo.append('otherUserId', otherUserId)

    fetch(routes.fetchLaravel + 'declineFriend', {
      method: 'POST',
      mode: 'cors',
      body: declinetFriendInfo,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        getNotifications()
        updateFriends()
      })
  }

  /**
 * Recibe el evento de si hay alguna notificacion pendiente.
 * @function handleMessage
 */
  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'requests-event':
        setNotificationList(eventData.notificationsData)
        setUnreadNotification(eventData.notificationUnread)
        break
    }
  }

  useEffect(() => {
    getNotifications()
    window.addEventListener('click', function (e) {
      if (document.getElementById('bell__container') !== null && !document.getElementById('bell__container').contains(e.target)) {
        setShowNotification(false)
      }
    })
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className="bell__container" id="bell__container">
      <button className="bell__buttonIcon">
        <img
          src={!unreadNotification ? campana : campanaNoti}
          className="bell__image"
          onClick={() => handleClick()}
        ></img>
      </button>
      {showNotification && (
        <div className="bell-dropdown">
          <ul className="bell-dropdown__list" id="bell-scroll">
            {notificationList.length > 0
              ? notificationList.map((element, index) => {
                return <li key={index} className="bell-list__item">
                  <div className="bell__button">
                    <img className='itemIcon' src={element.avatar}></img>
                    <p>{element.name} send you a friend request</p>
                    <img className='bell-accept' src={success} onClick={() => handleAcceptFriend(`${element.userId}`)}></img>
                    <img className='bell-deny' src={deny} onClick={() => handleDenyFriend(`${element.userId}`)}></img>
                  </div>
                </li>
              })
              : <div className='noNotification'><b>You don&apos;t have any notifications yet!</b><img src={bellSleeping}></img></div>
            }
          </ul>
        </div>
      )}
    </div>
  )
}

export default Bell
