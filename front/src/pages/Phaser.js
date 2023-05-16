import '../styles/normalize.css'
import React, { useEffect } from 'react'
import '../PhaserGame'
import { useNavigate } from 'react-router'

function Phaser() {
  const navigate = useNavigate()

  const handleMessage = (event) => {
    const eventData = event.data

    // Event handle
    switch (eventData.type) {
      case 'overlapped-msg':
        if (eventData.value === 'casa') {
          navigate('/campaign')
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
