import Phaser from 'phaser'

import Preloader from '../Phaser/scenes/Preloader'
import Game from '../Phaser/scenes/Game'
import InteractUI from '../Phaser/scenes/InteractUI'
import Header from '../components/Header'

import '../styles/normalize.css'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import DialogBox from '../Phaser/scenes/DialogBox'
import { Loading } from '../components/Loading'

/**
 * Pagina en la que se muestra el contenido de Phaser del mundo de codeXpert.
 * @function CodeWorld
 */
const CodeWorld = () => {
  const cookies = new Cookies()
  const navigate = useNavigate()
  const dataLoaded = false

  /**
 * Al clicar envia mensage de que un usuario ha entrado en el mundo en socket.
 * @function handleMessage
 */
  const handleMessage = (event) => {
    const eventData = event.data

    // Event handle
    switch (eventData.type) {
      case 'navigate_request-msg':
        window.postMessage({ type: 'left_phaser_world-emit' }, '*')
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
        scene: [Preloader, Game, InteractUI, DialogBox]
      }
      worldGame = new Phaser.Game(config)

      window.postMessage({
        type: 'connected_phaser_world-emit',
        x: 210,
        y: 690
      }, '*')
    }

    window.addEventListener('message', handleMessage)

    return () => {
      if (worldGame != null) {
        // Realizar las tareas de limpieza de Phaser si es necesario
        worldGame.destroy(true, false)
        worldGame = null
      }
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('lastPage', 'codeworld')
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
    <div ref={parentRef}>
      <Header></Header>
      {dataLoaded && <Loading></Loading>}
    </div>
  )
}

export default CodeWorld
