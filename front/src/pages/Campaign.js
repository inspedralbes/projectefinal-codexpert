/* eslint-disable */

import '../styles/normalize.css'
import '../styles/campaign.css'
import routes from '../conn_routes'
import Modal from 'react-modal'
import unlocked from '../img/campaign/unlocked.png'
import locked from '../img/campaign/locked.png'
import success from '../img/campaign/success.png'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'

Modal.setAppElement('body')

function Campaign() {
  const [modal, setModal] = useState(false)
  const [tutorialList, setTutorialList] = useState([])
  const [userExperience, setUserExperience] = useState('')
  const [tutorialsAnswered, setTutorialsAnswered] = useState([])
  const [lvlUnlocked, setLvlUnlocked] = useState(
    localStorage.getItem('lvlUnlocked') === null
      ? 0
      : localStorage.getItem('lvlUnlocked')
  )
  const cookies = new Cookies()
  const navigate = useNavigate()

  const handleChoiseOption = (option) => {
    setModal(false)
    localStorage.setItem('userExperience', option)

    const data = new FormData()
    data.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )
    data.append('userExperience', option)
    fetch(routes.fetchLaravel + 'setExpertise', {
      method: 'POST',
      mode: 'cors',
      body: data,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then(() => {
        setUserExperience(option)
        getTutorials()
        if (localStorage.getItem('tutorialsAnswered') !== null) {
          setTutorialsAnswered(
            JSON.parse(localStorage.getItem('tutorialsAnswered'))
          )
        }
      })
    if (option === 'beginner') {
      localStorage.setItem('lvlUnlocked', 0)
    } else if (option === 'expert') {
      localStorage.setItem('lvlUnlocked', 5)
      setLvlUnlocked(localStorage.getItem('lvlUnlocked'))
    }
  }

  const getTutorials = () => {
    const data = new FormData()
    data.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )
    data.append('userExperience', localStorage.getItem('userExperience'))
    fetch(routes.fetchLaravel + 'getTutorials', {
      method: 'POST',
      mode: 'cors',
      body: data,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setTutorialList(data)
        console.log(data)
        setUserExperience(localStorage.getItem('lvlUnlocked'))
      })
  }

  useEffect(() => {
    if (localStorage.getItem('userExperience') === null) {
      setModal(true)
    } else {
      getTutorials()
    }
    if (localStorage.getItem('tutorialsAnswered') !== null) {
      setTutorialsAnswered(
        JSON.parse(localStorage.getItem('tutorialsAnswered'))
      )
    }
  }, [])

  return (
    <div className="campaign">
      <Modal
        style={{
          // QUITAR Y PERSONALIZAR ESTILOS CUANDO SE APLIQUE CSS
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
        <h1>What are you?</h1>
        <p>
          Para adaptarnos a tus conocimientos primero de todo queremos saber si
          tienes los conocimientos minimos para poder competir con otras
          personas sin ir totalmente perdido. Si eliges principiante se te
          desbloqueará el primer nivel e iras desbloquenado mediante vayas
          completando más. Si eliges experto se te desbloquearan todos los
          niveles pero tendras que hacer la prueba final y así desbloquear el
          modo competitivo. (Si quieres que se guarden los niveles desbloquedos,
          te recomendamos que primero te crees una cuenta)
        </p>
        <br></br>
        <div className="profile__buttons">
          <button
            className="pixel-button modalBtn"
            onClick={() => handleChoiseOption('beginner')}
          >
            Beginner
          </button>
          <button
            className="pixel-button modalBtn"
            onClick={() => handleChoiseOption('expert')}
          >
            Expert
          </button>
        </div>
      </Modal>
      <div className="pixel__container">
        <h1>Campaign</h1>
      </div>
      <h2>Tutorial:</h2>
      <ul className="levels__list">
        {userExperience !== ''
          ? tutorialList.map((element, index) => {
              return (
                <li key={element.id}>
                  <div className="levels-title__container">
                    <h3>{element.title}</h3>
                  </div>
                  <div className="pixel__container level__container">
                    {lvlUnlocked >= index ||
                    element.locked === 0 ||
                    tutorialsAnswered.includes(element.id - 1) ? (
                      <>
                      {console.log(tutorialsAnswered)}
                        {element.passed ||
                        tutorialsAnswered.includes(element.id) ? (
                          <>
                            <img src={success}></img>
                          </>
                        ) : (
                          <>
                            <img src={unlocked}></img>
                          </>
                        )}
                        <br></br>
                        <button
                          className="pixel-button"
                          onClick={() =>
                            navigate('/tutorial', { state: { id: element.id } })
                          }
                        >
                          Play
                        </button>
                      </>
                    ) : (
                      <>
                        <img src={locked}></img>
                        <br></br>
                        <button className="pixel-button locked">locked</button>
                      </>
                    )}
                  </div>
                </li>
              )
            })
          : null}
      </ul>
      {localStorage.getItem('tutorialPassed') !== null && (
        <div className="lobbies-button">
          <button className="pixel-button" onClick={() => navigate('/lobbies')}>
            GO LOBBIES
          </button>
        </div>
      )}
    </div>
  )
}

export default Campaign
