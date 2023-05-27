import React, { useState } from 'react'
import '../styles/normalize.css'
import PropTypes from 'prop-types'
import routes from '../conn_routes'

ShareRanking.propTypes = {
  idGame: PropTypes.number
}
/**
 * Componente que muestra un ranking que puede ver todo el mundo el qual esta pensado que el usuario lo pueda compartir.
 * @function ShareRanking
 */
function ShareRanking({ idGame }) {
  const [shareUrl, setShareUrl] = useState(routes.frontRoute + `/sharedranking?id=${idGame}`)

  /**
 * Funcion que sirve para copiar el enlace que se ha creado para el ranking.
 * @function copyToClipboard
 */
  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl)
  }

  return (
    <div className='ShareResults__element'>
      <h1>Share results:</h1>
      <div className="ShareResults__url">
        <div className="ShareResults__copyurl">
          <input type="text" id='copyLink' className="ShareResults__link" value={shareUrl} onChange={(e) => setShareUrl(e.target.value)} disabled />
          <img src={require('../img/copy_to_clipboard_white.png')}
            width='25px'
            className='ShareResults__copyurl-icon'
            alt='Copy to clipboard'
            onClick={copyToClipboard} />
        </div>
        <span className="ShareResults__text">Share this URL with your friends!</span>
      </div>
    </div>
  )
}

export default ShareRanking
