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
    </div>
  )
}

export default Ranking
