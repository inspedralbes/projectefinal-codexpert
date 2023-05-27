import React from 'react'
import '../styles/normalize.css'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

RankingPodium.propTypes = {
  rankingData: PropTypes.array
}

/**
 * Componente que muestra el podio de los tres usuarios que han quedado mejor en el juego.
 * @function RankingPodium
 */
function RankingPodium({ rankingData }) {
  const navigate = useNavigate()
  return (
    <div className='rankingPodium__content'>
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
                      onClick={() => navigate(`/profile?id=${element.id}`)}
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
                      alt={element.name + '\'s avatar'}
                      onClick={() => navigate(`/profile?id=${element.id}`)} />
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
                      alt={element.name + '\'s avatar'}
                      onClick={() => navigate(`/profile?id=${element.id}`)} />
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
        } else return null
      })
      }
    </div >
  )
}

export default RankingPodium
