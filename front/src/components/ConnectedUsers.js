import '../styles/normalize.css'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import { useNavigate } from 'react-router-dom'
function ConnectedUsers() {
  const cookies = new Cookies()
  const navigate = useNavigate()

  const myId = parseInt(cookies.get('userId') !== undefined ? cookies.get('userId') : -1)
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

  const checkIfCanAdd = (currentUserId) => {
    let index = 0
    let userNotFound = true
    let canAdd = true

    console.log('userlist' + userList)
    if (userList !== undefined) {
      while (index < userList.length && userNotFound) {
        if (userList[index].id === myId && userList[index].not_add_ids !== undefined) {
          if (userList[index].not_add_ids.includes(currentUserId)) {
            canAdd = false
          }
          userNotFound = false
          console.log('not add' + userList[index].not_add_ids)
        }
        index++
      }
      return canAdd
    }

    return userNotFound
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
            <li className="userList__item item" key={index}>
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

              {myId !== user.id && checkIfCanAdd(user.id) && (
                <div className="connectedUsers__addFriend">
                  <button className='send__button' id={'userId' + index}
                    onClick={() => {
                      handleClick(`${user.id}`)
                      document.getElementById('userId' + index).style.display = 'none'
                    }}>Add Friend</button>
                </div>
              )
              }

            </li>
          )
        })}
      </ul>
    </div >
  )
}

export default ConnectedUsers
