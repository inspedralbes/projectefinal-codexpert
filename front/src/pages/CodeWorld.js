import Phaser from 'phaser'

import Preloader from '../Phaser/scenes/Preloader'
import Game from '../Phaser/scenes/Game'
import InteractUI from '../Phaser/scenes/InteractUI'

import '../styles/normalize.css'
import React, { useEffect, useRef } from 'react'
// import '../PhaserGame'
import { useNavigate } from 'react-router'

import Cookies from 'universal-cookie'
import routes from '../conn_routes'

const CodeWorld = () => {
  const cookies = new Cookies()
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
  let worldGame = null

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
            debug: true
          }
        },
        scene: [Preloader, Game, InteractUI]
      }
      worldGame = new Phaser.Game(config)
    }

    window.addEventListener('message', handleMessage)

    return () => {
      if (worldGame) {
        console.log(worldGame)
        worldGame.events.off(); // Desconecta los eventos del juego
  
        // Detener cada escena individualmente
        worldGame.scene.scenes.forEach((scene) => {
          worldGame.scene.stop(scene.scene.key);
          scene.input.keyboard.enabled = false;
        });

        // worldGame.destroy(true); // Destruye el juego (incluyendo el canvas y los recursos)
        // worldGame.runDestroy(); // Ejecuta las funciones de limpieza adicionales (si las tienes definidas en tus escenas)
        worldGame = null; // Asigna null a la variable para indicar que el juego se ha destruido
      }
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  useEffect(() => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'isUserLogged', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        window.network.setUserLogged(data.correct)
      })
  }, [])

  return (
    <div ref={parentRef}></div>
  )
}

export default CodeWorld
