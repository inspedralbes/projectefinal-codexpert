import '../styles/normalize.css'
import '../styles/eye.css'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import openEye from '../img/openEye.png'
import closedEye from '../img/closedEye.png'

Eye.propTypes = {
  id: PropTypes.string
}

function Eye({ id }) {
  const [pwdType, setPwdType] = useState(openEye)
  const handleEye = () => {
    const pwd = document.getElementById(id)
    if (pwd.type === 'password') {
      pwd.type = 'text'
      setPwdType(closedEye)
    } else {
      pwd.type = 'password'
      setPwdType(openEye)
    }
  }

  return (
    <div className='eye'>
      <button className='invisible eyeBtn' onClick={() => handleEye()}><img src={pwdType} width={'30px'} alt=''></img></button>
    </div>
  )
}

export default Eye
