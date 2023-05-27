import '../styles/normalize.css'
import '../styles/eye.css'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import openEye from '../img/openEye.png'
import closedEye from '../img/closedEye.png'

Eye.propTypes = {
  id: PropTypes.string
}

/**
 * Este componente sirve para mostrar un botón de ver o no ver contraseñas.
 * @param id Id del elemento a cambiar el tipo de input de password a text.
 */
function Eye({ id }) {
  const [pwdType, setPwdType] = useState(openEye)
  /**
 * Función para cambiar el tipo del input pasado.
 * @function handleEye
 */
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
