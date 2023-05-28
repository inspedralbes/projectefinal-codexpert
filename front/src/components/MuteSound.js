import React, { useState } from 'react'
import '../styles/normalize.css'
import '../styles/MuteSound.css'
import enabled from '../img/music_enabled.png'
import disabled from '../img/music_disabled.png'

/**
 * Este componente se usa para ver las notificaciones recibidas de otros usuarios como la de solicitud de amistad.
 * @@function MuteSound
 */
function MuteSound() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  /**
 * Al clicar en el boton mutea o desmutea la musica
 * @function handleClick
 */
  const handleClick = () => {
    setSoundEnabled(!soundEnabled)

    window.postMessage({
      type: 'sound_enabled-msg',
      enabled: soundEnabled
    }, '*')
  }

  return (
    <div className="speaker__container">
      <img className='speaker-interact' src={soundEnabled ? enabled : disabled} width={40} onClick={() => handleClick()}></img>
    </div>
  )
}

export default MuteSound
