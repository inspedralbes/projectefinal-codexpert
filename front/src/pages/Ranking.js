import React from 'react'
import '../styles/normalize.css'

function Ranking() {
  let usersList = []
  return (
    <div>
      <h1>RANKING</h1>
      <table>
        <thead>
          <th>
            Username
          </th>
          <th>
            ELO
          </th>
          <th>
            LVL
          </th>
        </thead>
        <tbody>
          {Array.isArray(usersList) && usersList.map((element, index) => {
            <tr>
              <td>
                {element.avatar}
                {element.name}
              </td>
              <td>
                {element.elo}
              </td>
              <td>
                {element.xp}
              </td>
            </tr>
          })
          }
        </tbody>
      </table>

      <div className='table__body'>
        {Array.isArray(usersList)
          ? usersList.map((element, index) => {
            return (
              <li
                className='table__row row'
                //onClick={handleJoin}
                key={index}
                id={element.lobby_name}
              >
                <div
                  id={element.lobby_name}
                  className='col col-1'
                  data-label='Lobby Id'
                >
                  {index + 1}
                </div>
                <div
                  id={element.lobby_name}
                  className='col col-2'
                  data-label='Lobby Name'
                >
                  {element.lobby_name}
                </div>
                <div
                  id={element.lobby_name}
                  className='col col-3'
                  data-label='Owner'
                >
                  {element.owner_name}
                </div>
              </li>
            )
          })
          : null}
      </div>
    </div>
  )
}

export default Ranking
