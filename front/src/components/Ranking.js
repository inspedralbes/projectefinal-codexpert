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
            <div className='ranking__podium' key={index}>
                {index === 0 &&
                  <div className='ranking__winner winner'>
                    <div className='winner__pic'>
                      <img
                        src={element.avatar}
                        width='50px'
                        className='user__image'
                        alt={element.name + '\'s avatar'}
                      />
                    </div>
                    <div className='winner__profile'>
                      <img src={require('../img/ranking/Trofeo.png')}
                        height='50px'
                        className='user__position'
                        alt='Winner' />
                      <h1>{element.name}</h1>
                    </div>
                  </div>
                }
                {index === 1 &&
                  <div className='ranking__second second'>
                    <div className='second__profile'>
                      <img
                        src={element.avatar}
                        width='50px'
                        className='user__image'
                        alt={element.name + '\'s avatar'} />
                      <h1>{element.name}</h1>
                    </div>
                    <div className='second__pic'>
                      <img src={require('../img/ranking/segundo.png')}
                        height='50px'
                        className='user__position'
                        alt='Second' />
                    </div>
                  </div>
                }
                {index === 2 &&
                  <div className='ranking__third third'>
                    <div className='third__profile'>
                      <img
                        src={element.avatar}
                        width='50px'
                        className='user__image'
                        alt={element.name + '\'s avatar'} />
                      <h1>{element.name}</h1>
                    </div>
                    <div className='third__pic'>
                      <img src={require('../img/ranking/tercero.png')}
                        height='50px'
                        className='user__position'
                        alt='Third' />
                    </div>
                  </div>
                }

            </div>
          )
        } else {
          return (<></>)
        }
      })
      }
    </div >
  )
}

export default Ranking
