import React from 'react'
import '../styles/normalize.css'
import PropTypes from 'prop-types'

Rewards.propTypes = {
  rewards: PropTypes.object
}

function Rewards({ rewards }) {
  return (
    <p className='rewards__list'>
      <a className='rewards__element'>+{rewards.coinsEarned} <img src={require('../img/monea.png')} height='20px' className='user__xp' alt='Experience points' /></a>
      <a className='rewards__element'>{'+' + rewards.xpEarned} <img src={require('../img/Experiencia.png')} height='20px' className='user__xp' alt='Experience points' /></a>
      <a className='rewards__element'>{'+' + rewards.eloEarned} Elo</a>
    </p>
  )
}

export default Rewards
