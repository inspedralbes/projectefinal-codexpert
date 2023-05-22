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

function Bell() {
  const cookies = new Cookies()
  const [showNotification, setShowNotification] = useState(false)
  const [notificationList, setNotificationList] = useState([''])
  const [unreadNotification, setunreadNotification] = useState(false)
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
        setunreadNotification(data.unread)
        setNotificationList(data.list)
      })
  }

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
          setunreadNotification(false)
          getNotifications()
        })
    }
    console.log(notificationList)
  }

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'requests-event':
        setNotificationList(eventData.notificationsData)
        setunreadNotification(eventData.notificationUnread)
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
            {!notificationList.includes('')
              ? notificationList.map((element, index) => {
                return <li key={index} className="bell-list__item">
                  <div className="bell__button">
                    <img className='itemIcon' src={element.avatar}></img>
                    <p>{element.name} send you a friend request</p>
                    <img className='bell-accept' src={success}></img>
                    <img className='bell-deny' src={deny}></img>
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
