import '../styles/normalize.css'
import React, { useState, useEffect } from 'react'

function ConnectedUsersInGame() {
  const [userList, setUserList] = useState([])

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
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className='lobby__connectedUsers'>
      <h1 className='connectedUsers_title'>Connected users</h1>
      <div id='userList' className='connectedUsers__userList userList'>
        {userList.map((user, index) => {
          return (
            <div className='userList__user user' key={index}>
              <div className='user__name'>{user.name}</div>
              <div className='user__imageIngame'> {user.hearts_remaining > 0 &&
                <img
                  src={user.avatar}
                  width='50px'
                  className='user__image'
                  alt={user.name + '\'s avatar'}
                ></img>}

                {user.hearts_remaining === 0 &&
                  <img src={require('../img/hearts/skull.gif')}
                    width='50px'
                    className='user__skull'
                    alt={user.name + ' lost'} />}
              </div>

              <div>
                {user.hearts_remaining > 3 &&
                  <div className='hearts__remaining'>
                    <h1 className='hearts__remaining'>
                      <img src={require('../img/hearts/one_heart_normal.png')}
                        width='50px'
                        className='user__health'
                        alt={user.hearts_remaining + ' hearts remaining'} />
                      {user.unlimitedHearts
                        ? <img src={require('../img/hearts/infinito.png')}
                          width='50px'
                          className='user__health'
                          alt='infinity' />
                        : ` x${user.hearts_remaining}`}
                    </h1>
                  </div>}
                {user.hearts_remaining === 3 &&
                  <img src={require('../img/hearts/three_hearts.png')}
                    height='50px'
                    className='user__health'
                    alt={user.hearts_remaining + ' hearts remaining'} />}

                {user.hearts_remaining === 2 &&
                  <img src={require('../img/hearts/two_hearts.gif')}
                    height='50px'
                    className='user__health'
                    alt={user.hearts_remaining + ' hearts remaining'} />}

                {user.hearts_remaining === 1 &&
                  <img src={require('../img/hearts/one_heart.gif')}
                    height='50px'
                    className='user__health'
                    alt={user.hearts_remaining + ' hearts remaining'} />}
              </div>

              <div className='user__level'>
                Level: {user.question_at < window.network.getQuestionAmount() ? user.question_at + 1 : user.question_at}
              </div>
            </div>
          )
        })}
      </div>
    </div>

  )
}

export default ConnectedUsersInGame
