import React from 'react'
import '../styles/normalize.css'
import PropTypes from 'prop-types'

Ranking.propTypes = {
  rankingData: PropTypes.array
}

function Ranking({ rankingData }) {
  return (
    <div className='ranking__content'>
      {Array.isArray(rankingData) && rankingData.map((element, index) => {
        if (index <= 2) {
          return (
            <div className={index === 0 ? 'ranking__winner' : index === 1 ? 'ranking__second' : 'ranking__third'} key={index}>
              {index === 0 &&
                <>
                  <div className='winner__pic'>
                    <img
                      src={element.avatar}
                      width='50px'
                      className='user__image'
                      alt={element.name + '\'s avatar'}
                    />
                    <h1>{element.name}</h1>
                  </div>
                  <div className='winner__trophy'>
                    <img src={require('../img/ranking/Trofeo.png')}
                      height='50px'
                      className='user__position'
                      alt='Winner' />
                  </div>
                </>
              }
              {index === 1 &&
                <>
                  <div className='second__profile'>
                    <img
                      src={element.avatar}
                      width='50px'
                      className='user__image'
                      alt={element.name + '\'s avatar'} />
                    <h1>{element.name}</h1>
                  </div>
                  <div className='second__medal'>
                    <img src={require('../img/ranking/segundo.png')}
                      height='50px'
                      className='user__position'
                      alt='Second' />
                  </div>
                </>
              }
              {index === 2 &&
                <>
                  <div className='third__profile'>
                    <img
                      src={element.avatar}
                      width='50px'
                      className='user__image'
                      alt={element.name + '\'s avatar'} />
                    <h1>{element.name}</h1>
                  </div>
                  <div className='third__medal'>
                    <img src={require('../img/ranking/tercero.png')}
                      height='50px'
                      className='user__position'
                      alt='Third' />
                  </div>
                </>
              }

            </div>
          )
        } else {
          return (
            <div key={index}>
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
                  })}
                </tbody>
              </table>
            </div >
          )
        }
      })
      }
    </div >
  )
}

export default Ranking
