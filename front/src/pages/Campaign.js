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
          If you choose <b>beginner</b>, the first level will be unlocked and you will have to complete all of them to finish the tutorial. If you choose <b>expert</b>, all levels will be unlocked, you can complete them all if you want, but you only need to complete the last one to pass the tutorial. Once you have completed the tutorial, you will have access to the multiplayer mode! To save which levels you have completed remember to create an account, you can do it after completing the tutorial or before :)
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
        <>
          {cookies.get('token') !== undefined && (
            <div className="lobbies-button">
              <button className="pixel-button" onClick={() => navigate('/lobbies')}>
                GO LOBBIES
              </button>
            </div>
          )}
          {cookies.get('token') === undefined && (
            <div className="lobbies-button">
              <button className="pixel-button" onClick={() => navigate('/login')}>
                LOGIN/REGISTER
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Campaign
