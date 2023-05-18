import * as Phaser from 'phaser'

import Preloader from '../Phaser/scenes/Preloader'
import Game from '../Phaser/scenes/Game'
import InteractUI from '../Phaser/scenes/InteractUI'

import '../styles/normalize.css'
import React, { useEffect, useRef } from 'react'
// import '../PhaserGame'
import { useNavigate } from 'react-router'

const CodeWorld = () => {
  const navigate = useNavigate()

  const handleMessage = (event) => {
    const eventData = event.data

    // Event handle
    switch (eventData.type) {
      case 'navigate_request-msg':
        console.log(eventData.value)
        navigate('/' + eventData.value)
        break
    }
  }

  const parentRef = useRef(null)
  let game = null

  useEffect(() => {
    if (parentRef.current) {
      const config = {
        // Configuración de Phaser
        type: Phaser.AUTO,
        parent: parentRef.current,
        backgroundColor: '#60A0A8',
        scale: {
          // mode: Phaser.Scale.ScaleModes.RESIZE,
          width: window.innerWidth / 2.5,
          height: window.innerHeight / 2.5,
          zoom: 2.5
        },
        dom: {
          createContainer: true
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        scene: [Preloader, Game, InteractUI]
      }
      game = new Phaser.Game(config)
    }

    window.addEventListener('message', handleMessage)

    return () => {
      if (game != null) {
        // Realizar las tareas de limpieza de Phaser si es necesario
        // game.destroy()
        game = null
      }
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div ref={parentRef}></div>
  )
}

export default CodeWorld
