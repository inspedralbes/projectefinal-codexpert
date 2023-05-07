import React from 'react'
import '../styles/normalize.css'
import '../styles/404.css'
import { Link } from 'react-router-dom'
import ErrorGif from '../img/Error.gif'
import { useNavigate } from 'react-router-dom' // Rutas

function E404() {
  const navigate = useNavigate()
  if (localStorage.getItem('lastPage') !== null) {
    navigate('/profile')
  } else {
    navigate('/')
  }
  return (
    <div className='E404'>
      <img src={ErrorGif}></img>
      <h1>404 ERROR</h1>
        <button className='pixel-button' onClick={() => localStorage.getItem("lastPage") !== undefined ? navigate("/" + localStorage.getItem("lastPage")) : navigate('/')}>Go back</button>
    </div>
  )
}

export default E404