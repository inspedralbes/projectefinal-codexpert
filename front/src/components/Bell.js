import React, { useState, useEffect } from 'react'
import '../styles/normalize.css'
import '../styles/Bell.css'
import campana from '../img/campana.png'
import success from '../img/campaign/success.png'
import deny from '../img/campaign/deny.png'
import bellSleeping from '../img/bellSleeping.gif'

function Bell() {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationList, setNotificationList] = useState([1, 1, 1, 1, 1, 1])
  const handleClick = () => {
    setShowNotification(!showNotification)
  }

  useEffect(() => {
    window.addEventListener('click', function (e) {
      if (document.getElementById('bell__container') !== null && !document.getElementById('bell__container').contains(e.target)) {
        setShowNotification(false)
      }
    })
  }, [])

  return (
    <div className="bell__container" id="bell__container">
      <button className="bell__buttonIcon">
        <img
          src={campana}
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
                  <div className="bell__button" onClick={() => setNotificationList(notificationList)}>
                    <img className='itemIcon' src='https://api.dicebear.com/5.x/pixel-art/svg?seed=&backgroundColor=FFFFFF&clothing=variant12&clothingColor=ff6f69&hair=short19&hairColor=6E260E&skinColor=ffdbac&glasses=dark01&glassesColor=4b4b4b&glassesProbability=0&accessories=variant01&accessoriesColor=a9a9a9&accessoriesProbability=0&mouth=happy09&mouthColor=c98276&eyes=variant01&eyesColor=5b7c8b'></img>
                    <p>Alex send you a friend request</p>
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
