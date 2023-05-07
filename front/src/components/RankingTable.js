import React from 'react'
import '../styles/normalize.css'
import PropTypes from 'prop-types'

RankingTable.propTypes = {
  rankingData: PropTypes.array
}

function RankingTable({ rankingData }) {
  return (
    <div className='rankingTable__content'>
      <table className='ranking__table' >
        <thead>
          <tr>
            <th className='ranking__position'>Posición</th>
            <th className='ranking__profile'>Perfil</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(rankingData) && rankingData.map((element, index) => {
            if (index > 2) {
              return (
                <tr key={index}>
                  <td className='ranking__position'>{index + 1}</td>
                  <td className='ranking__profile'>
                    <img
                      src={element.avatar}
                      width='50px'
                      className='user__image'
                      alt={element.name + '\'s avatar'} />
                    <h1>{element.name}</h1>
                  </td>
                </tr>
              )
            } else {
              return null
            }
          })
          }
          {Array.isArray(rankingData) && rankingData.map((element, index) => {
            if (index > 2) {
              return (
                <tr key={index}>
                  <td className='ranking__position'>{index + 1}</td>
                  <td className='ranking__profile'>
                    <img
                      src={element.avatar}
                      width='50px'
                      className='user__image'
                      alt={element.name + '\'s avatar'} />
                    <h1>{element.name}</h1>
                  </td>
                </tr>
              )
            } else {
              return null
            }
          })
          }
          {Array.isArray(rankingData) && rankingData.map((element, index) => {
            if (index > 2) {
              return (
                <tr key={index}>
                  <td className='ranking__position'>{index + 1}</td>
                  <td className='ranking__profile'>
                    <img
                      src={element.avatar}
                      width='50px'
                      className='user__image'
                      alt={element.name + '\'s avatar'} />
                    <h1>{element.name}</h1>
                  </td>
                </tr>
              )
            } else {
              return null
            }
          })
          }
          {Array.isArray(rankingData) && rankingData.map((element, index) => {
            if (index > 2) {
              return (
                <tr key={index}>
                  <td className='ranking__position'>{index + 1}</td>
                  <td className='ranking__profile'>
                    <img
                      src={element.avatar}
                      width='50px'
                      className='user__image'
                      alt={element.name + '\'s avatar'} />
                    <h1>{element.name}</h1>
                  </td>
                </tr>
              )
            } else {
              return null
            }
          })
          }
        </tbody>
      </table>
    </div>
  )
}

export default RankingTable
