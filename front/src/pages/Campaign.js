import '../styles/normalize.css'
import '../styles/campaign.css'
import routes from '../conn_routes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

Modal.setAppElement('body')

function Campaign() {
  const [modal, setModal] = useState(false)
  const [tutorialList, setTutorialList] = useState([])
  const [lvlUnlocked, setLvlUnlocked] = useState(localStorage.getItem('lvlUnlocked') === null ? 0 : localStorage.getItem('lvlUnlocked'))
  const navigate = useNavigate()

  const handleChoiseOption = (option) => {
    setModal(false)
    localStorage.setItem('campaign', option)
    if (option === 'beginner') {
      localStorage.setItem('lvlUnlocked', 0)
    } else if (option === 'expert') {
      localStorage.setItem('lvlUnlocked', 5)
      setLvlUnlocked(localStorage.getItem('lvlUnlocked'))
    }
  }

  useEffect(() => {
    if (localStorage.getItem('campaign') === null) {
      setModal(true)
    }

    fetch(routes.fetchLaravel + 'getTutorials', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setTutorialList(data)
      })
  }, [])

  return (
    <div className='campaign'>
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
        isOpen={modal}
      >
        <button className='cross' onClick={() => setModal(false)}></button>

        <h1>What are you?</h1>
        <br></br>
        <div className='profile__buttons'>
          <button className='pixel-button modalBtn' onClick={() => handleChoiseOption('beginner')}>Beginner</button>
          <button className='pixel-button modalBtn' onClick={() => handleChoiseOption('expert')}>Expert</button>
        </div>
      </Modal>
      <h1>Campaign</h1>
      <ul>
        {Array.isArray(tutorialList)
          ? tutorialList.map((element, index) => {
            return (
              <li
                key={element.id}
              >
                <h3>{element.title}</h3>
                <div>
                  {lvlUnlocked >= index
                    ? <button onClick={() => navigate('/tutorial', { state: { id: element.id } })}>Play</button>
                    : <span>locked</span>
                  }
                </div>
              </li>
            )
          })
          : null}
      </ul>
    </div>
  )
}

export default Campaign
