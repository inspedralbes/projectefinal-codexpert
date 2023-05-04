import '../styles/normalize.css'
import '../styles/LandingPage.css'
import routes from '../conn_routes'
import Modal from 'react-modal'
import React, { useState } from 'react'

Modal.setAppElement('body')

function Campaign() {
  const [modal, setModal] = useState(true)
  fetch(routes.fetchLaravel + 'getTutorials', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
  return (
    <div>
      <Modal
        style={{ // QUITAR Y PERSONALIZAR ESTILOS CUANDO SE APLIQUE CSS
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
        onRequestClose={() => setModal(false)}
        shouldCloseOnOverlayClick={true}
        isOpen={modal}
      >
        <button className='cross' onClick={() => setModal(false)}></button>

        <h1>Change your username</h1>.
        <br></br>
        <div className='profile__buttons'>
          <button className='pixel-button modalBtn close' onClick={() => setModal(false)}>Close</button>
        </div>
      </Modal>
    </div>
  )
}

export default Campaign
