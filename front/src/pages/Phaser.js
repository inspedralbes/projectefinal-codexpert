import '../styles/normalize.css'
import React, { useEffect } from 'react'
import '../PhaserGame'
import { useNavigate } from 'react-router'

function Phaser() {
  const navigate = useNavigate()
  const handleMessage = (event) => {
    // console.log('hola')
    const eventData = event.data

    // Event handle
    switch (eventData.type) {
      case 'overlapped-msg':
        console.log('hola')
        if (eventData.value === 'casa') {
          navigate('/lobbies')
        }
        break
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])
  return (
    <div id='phaser-container'></div>
  )
}

export default Phaser
