import '../styles/normalize.css'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import { useNavigate } from 'react-router-dom'
// import { Loading } from './Loading'
function ConnectedUsers() {
  const cookies = new Cookies()
  const navigate = useNavigate()

  const myId = cookies.get('userId') !== undefined ? cookies.get('userId') : null
  console.log(myId)
  const [userList, setUserList] = useState([])
  const [firstTime, setFirstTime] = useState(true)
  const [friendNotification, setfriendNotification] = useState(false)
  const handleClick = (userId) => {
    setfriendNotification(!friendNotification)
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
      window.postMessage(
        {
          type: 'lobby_data_pls-emit'
        },
        '*'
      )
      setFirstTime(false)
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className="game__connectedUsers">
      <h1 className="connectedUsers_title">Connected users</h1>
      <ul id="userList" className="connectedUsers__userList userList">
        {userList.map((user, index) => {
          return (
            <li id="bgColor" className="userList__item item" key={index}>
              <div className="item__imgDiv">
                <img
                  src={user.avatar}
                  width="150px"
                  className="item__image"
                  alt={user.name + "'s avatar"}
                  onClick={() => navigate(`/profile?id=${user.id}`)}
                ></img>
              </div>

              <div className="item__name">
                <p>{user.name}</p>
              </div>

              {myId !== user.id && (
                <div className="connectedUsers__addFriend">
                  <button className='send__button'
                    onClick={() => handleClick(`${user.id}`)}>Add Friend</button>
                </div>
              )}

            </li>
          )
        })}
      </ul>
    </div >
  )
}

export default ConnectedUsers
