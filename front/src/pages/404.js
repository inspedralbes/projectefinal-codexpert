import React from 'react'
import '../styles/normalize.css'
import '../styles/404.css'
import ErrorGif from '../img/Error.gif'
import { useNavigate } from 'react-router-dom' // Rutas

/**
 * Pagina que se muestra al intentar entrar en una ruta no existente de la web.
 * @function E404
 */
function E404() {
  const navigate = useNavigate()
  return (
    <div className='E404'>
      <img src={ErrorGif}></img>
      <h1>404 ERROR</h1>
      <button className='pixel-button' onClick={() => localStorage.getItem('lastPage') !== null ? navigate('/' + localStorage.getItem('lastPage')) : navigate('/')}>Go back</button>
    </div>
  )
}

export default E404
