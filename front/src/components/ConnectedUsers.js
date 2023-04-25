import '../styles/normalize.css'
import React, { useState, useEffect } from 'react'

function ConnectedUsers () {
  const [userList, setUserList] = useState([])
  const [firstTime, setFirstTime] = useState(true)

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'lobby_user_list-event':
        setUserList(window.network.getLobbyUserList())
        break

      default:
        break
    }
  }

  useEffect(() => {
    if (firstTime) {
      window.postMessage({
        type: 'lobby_data_pls-emit'
      }, '*')
      setFirstTime(false)
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className='game__connectedUsers'>
      <h1 className='connectedUsers_title'>Connected users</h1>
      <ul id='userList' className='connectedUsers__userList userList'>
        {userList.map((user, index) => {
          return (
            <li id='bgColor' className='userList__item item' key={index}>
              <div className='item__imgDiv'>
                <img
                  src={user.avatar}
                  width='150px'
                  className='item__image'
                  alt={user.name + '\'s avatar'}
                ></img>
              </div>

              <div className='item__name'>
                <p>{user.name}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>

  )
}

export default ConnectedUsers
