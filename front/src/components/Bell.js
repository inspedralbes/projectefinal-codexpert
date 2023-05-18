import React, { useState } from 'react'
import '../styles/normalize.css'
import '../styles/Bell.css'
import campana from '../img/campana.png'

function Bell() {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationList, setNotificationList] = useState([1, 2, 3, 4, 5])
  const handleClick = () => {
    setShowNotification(!showNotification)
  }

  return (
    <div className="bell__container">
      <button className="bell__button">
        <img
          src={campana}
          className="bell__image"
          onClick={() => handleClick()}
        ></img>
      </button>
      {showNotification && (
            <div className="bell-dropdown">
              <ul className="bell-dropdown__list" id="bell-scroll">
              {notificationList.map((element, index) => {
                return <li key={index} className="bell-list__item"
              >
                <button className="bell__button">Profile</button>
              </li>
              })}
              </ul>
            </div>
      )}
    </div>
  )
}

export default Bell
