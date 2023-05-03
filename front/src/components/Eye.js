import '../styles/normalize.css'
import PropTypes from 'prop-types'
import React from 'react'

Eye.propTypes = {
  id: PropTypes.string
}

function Eye({ id }) {
  const handleEye = () => {
    const pwd = document.getElementById(id)
    if (pwd.type === 'password') {
      pwd.type = 'text'
    } else {
      pwd.type = 'password'
    }
  }

  return (
    <>
      <button onClick={() => handleEye()}>Eie</button>
    </>
  )
}

export default Eye
