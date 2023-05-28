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
import { Loading } from '../components/Loading'

Modal.setAppElement('body')

/**
 * Pagina que sirve como tutorial del juego de nuestra pagina web.
 * @function Campaign
 */
function Campaign() {
  const [modal, setModal] = useState(false)
  const [tutorialList, setTutorialList] = useState([])
  const [lastQuestion, setLastQuestion] = useState('')
  const [userExperience, setUserExperience] = useState(true)
  const [tutorialsAnswered, setTutorialsAnswered] = useState([])
  const [lvlUnlocked, setLvlUnlocked] = useState(
    localStorage.getItem('lvlUnlocked') === null
      ? 0
      : localStorage.getItem('lvlUnlocked')
  )
  const cookies = new Cookies()
  const navigate = useNavigate()

  /**
 * Al clicar seleccionas si eres experto o novato para que se te desbloqueen más o menos niveles.
 * @function handleChoiseOption
 */
  const handleChoiseOption = (option) => {
    setModal(false)
    if (option === 'beginner') {
      localStorage.setItem('lvlUnlocked', 0)
    } else if (option === 'expert') {
      localStorage.setItem('lvlUnlocked', 5)
      setLvlUnlocked(localStorage.getItem('lvlUnlocked'))
    }
    localStorage.setItem('userExperience', option)
    const data = new FormData()
    data.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
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
        if (localStorage.getItem('tutorialsAnswered') !== null) {
          setTutorialsAnswered(
            JSON.parse(localStorage.getItem('tutorialsAnswered'))
          )
        }
      })
  }

  /**
 * Funcion que recibe
 * @function getTutorials
 */
  const getTutorials = () => {
    const data = new FormData()
    data.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
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
        setUserExperience(localStorage.getItem('lvlUnlocked'))
        setLastQuestion(data[data.length - 1].id)
      })
  }

  const getExpertise = () => {
    const data = new FormData()
    data.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'checkExpertiseChosen', {
      method: 'POST',
      mode: 'cors',
      body: data,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.chosenExpertise) {
          localStorage.setItem('userExperience', '')
        }
        if (localStorage.getItem('userExperience') === null) {
          setModal(true)
        } else {
          getTutorials()
        }
      })
  }

  useEffect(() => {
    getExpertise()
    getTutorials()
    if (localStorage.getItem('tutorialsAnswered') !== null) {
      setTutorialsAnswered(
        JSON.parse(localStorage.getItem('tutorialsAnswered'))
      )
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('tutorialsAnswered') !== []) {
      if (tutorialsAnswered.includes(lastQuestion)) {
        localStorage.setItem('tutorialPassed', JSON.stringify(true))
      }
    }
  }, [lastQuestion])

  return (
    <>
      {tutorialList.length > 0
        ? <div className="campaign">
          <Modal
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
              },
              overlay: {
                backgroundColor: 'white'
              }
            }}
            isOpen={modal}
          >
            <div className="modal__content">
              <h1>What are you?</h1>
              <p>
                If you choose <b>beginner</b>, the first level will be unlocked and
                you will have to complete all of them to finish the tutorial. If you
                choose <b>expert</b>, all levels will be unlocked, you can complete
                them all if you want, but you only need to complete the last one to
                pass the tutorial. Once you have completed the tutorial, you will
                have access to the multiplayer mode! To save which levels you have
                completed remember to create an account, you can do it after
                completing the tutorial or before :)
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
            </div>
          </Modal>
          <div className="campaignPixel__container">
            <h1>Tutorial list</h1>
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
                    <div className="campaignPixel__container level__container">
                      {lvlUnlocked >= index ||
                        element.locked === 0 ||
                        tutorialsAnswered.includes(element.id - 1)
                        ? (
                          <>
                            {element.passed || tutorialsAnswered.includes(element.id)
                              ? (
                                <>
                                  <img src={success}></img>
                                </>)
                              : (
                                <>
                                  <img src={unlocked}></img>
                                </>)}
                            <br></br>
                            <button
                              className="pixel-button"
                              onClick={() => navigate('/tutorial', { state: { id: element.id } })}
                            >
                              Play
                            </button>
                          </>)
                        : (
                          <>
                            <img src={locked}></img>
                            <br></br>
                            <button className="pixel-button locked">locked</button>
                          </>)}
                    </div>
                  </li>
                )
              })
              : <h1>HOLA</h1>}
          </ul>
          {localStorage.getItem('tutorialPassed') !== null && (
            <>
              {cookies.get('token') !== undefined && (
                <div className='campaign__button'>
                  <button
                    className="pixel-button"
                    onClick={() => navigate('/codeworld')}
                  >
                    GO CODEWORLD
                  </button>
                </div>
              )}
              {cookies.get('token') === undefined && (
                <div className="campaign__button">
                  <button
                    className="pixel-button"
                    onClick={() => navigate('/login')}
                  >
                    LOGIN / REGISTER
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        : <Loading></Loading>}
    </>
  )
}

export default Campaign
