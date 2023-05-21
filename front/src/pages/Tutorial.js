/* eslint-disable */

import '../styles/Tutorial.css'
import routes from '../conn_routes'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CodeMirror from '../components/CodeMirror'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom' // Rutas
import Carousel from 'nuka-carousel'
import parse from 'html-react-parser'
import introductionData from '../localData/IntroductionsData.json'
import arrowLeft from '../img/corousel-arrowLeft.png'
import arrowRight from '../img/corousel-arrowRight.png'
import Modal from 'react-modal'

Modal.setAppElement('body')

function Tutorial() {
  const location = useLocation()
  const cookies = new Cookies()
  const navigate = useNavigate()
  const defaultCode =
    'function yourCode(input){ \n  //code here\n  \n  return input\n}\nyourCode(input)'
  const [code, setCode] = useState(defaultCode)
  const [error, setError] = useState('')
  const [modal, setModal] = useState({
    hello: true,
    introduction: true,
    hint: true,
    statement: true,
    inputOutput: true,
    codeEditor: true,
    submit: true,
  })
  const [qst, setQst] = useState({
    statement: '',
    inputs: [''],
    output: ''
  })
  useEffect(() => {
    if (location.state === null) {
      navigate('/campaign')
    } else {
      let scroll = document.getElementsByClassName('slider-container')
      scroll[0].id = "scroll"
      const tutorialData = new FormData()
      tutorialData.append('id', location.state.id)
      tutorialData.append(
        'token',
        cookies.get('token') !== undefined ? cookies.get('token') : null
      )
      fetch(routes.fetchLaravel + 'getTutorialFromId', {
        method: 'POST',
        mode: 'cors',
        body: tutorialData,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          setQst(data)
        })
    }
  }, [])

  const handleHint = () => {
    document.getElementById('hint').style.display = 'none'
  }

  const handleSubmit = (e) => {
    let tutorialsId = []
    e.preventDefault()
    if (code !== '') {
      const resultsEvalRecieved = []
      let evalPassedBoolean = true
      console.log(qst)
      qst.inputs.forEach((inp) => {
        let input = inp
        try {
          const res = eval(code)
          resultsEvalRecieved.push(res)
          setError('')
        } catch (e) {
          setError(e.message)
          evalPassedBoolean = false
        }
      })

      const checkAnswer = new FormData()
      checkAnswer.append('idQuestion', location.state.id)
      checkAnswer.append('evalRes', JSON.stringify(resultsEvalRecieved))
      checkAnswer.append('evalPassed', JSON.stringify(evalPassedBoolean))
      checkAnswer.append(
        'token',
        cookies.get('token') !== undefined ? cookies.get('token') : null
      )
      fetch(routes.fetchLaravel + 'checkTutorialAnswer', {
        method: 'POST',
        mode: 'cors',
        body: checkAnswer,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.correct) {
            if (localStorage.getItem('tutorialsAnswered') !== null) {
              tutorialsId = JSON.parse(
                localStorage.getItem('tutorialsAnswered')
              )
            }
            if (!tutorialsId.includes(location.state.id)) {
              tutorialsId.push(location.state.id)
            }
            tutorialsId.sort()
            localStorage.setItem(
              'tutorialsAnswered',
              JSON.stringify(tutorialsId)
            )
            tutorialsId.sort()

            navigate('/campaign')
          }
        })
    }
  }

  if(location.state === null) {
    return ( null)
  }else {
    return (
      <div className="tutorial__container">
        
        {location.state.id - 1 === 0 && ( // INTERFACE TUTORIAL
          <>
          <Modal
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                zIndex: 2
              }
            }}
              onRequestClose={() => setModal(prev => ({ ...prev, hello: false }))}
              shouldCloseOnOverlayClick={false}
              isOpen={modal.hello}
            >
              <div>
                <h1>Hello to your first Tutorial!</h1>
                <p>This is your <b>first tutorial</b>, so let us show you how the interface works so you can learn <b>better</b>.</p>
                <button className='pixel-button' onClick={() => setModal(prev => ({ ...prev, hello: false }))}>START</button>
              </div>
            </Modal>
          <Modal
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                zIndex: 2
              },
              content: {
                position: 'absolute',
                top: '-400px',
                left: '635px',
                right: '0px',
                
              }
            }}
              onRequestClose={() => setModal(prev => ({ ...prev, introduction: false }))}
              isOpen={modal.introduction}
            >
              <div>
                <h1>Introduction</h1>
                <p>This is your <b>first tutorial</b>, so let us show you how the interface works so you can learn <b>better</b>.</p>
                <button className='pixel-button'>START</button>
              </div>
            </Modal>
          </>
        )}
        <div className="introduction__container">
          <h1>Introduction:</h1>
          {introductionData.introductions[location.state.id - 1].introduction[0] !==
            '' && (
              <>
                <Carousel
                  adaptiveHeight={true}
                  defaultControlsConfig={{
                    containerClassName: 'containerCarousel',
                    nextButtonClassName: introductionData.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'nextButtonCarousel',
                    prevButtonClassName: introductionData.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'prevButtonCarousel',
                    pagingDotsContainerClassName: introductionData.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'dotsCarousel',
  
                    prevButtonText: (
                      <img src={arrowLeft} width="50px">
                      </img>
                    ),
  
                    nextButtonText: (
                      <img src={arrowRight} width="50px">
                      </img>
                    ),
  
                    pagingDotsStyle: {
                      fill: "green"
                    }
                  }}
                >
                  {introductionData.introductions[
                    location.state.id - 1
                  ].introduction.map((element, index) => {
                    return <div key={index}>{parse(element)}</div>
                  })}
                </Carousel>
                {introductionData.hints[location.state.id - 1] !== "" && (
                  <>
                    <div className='hint__cover' id="hint">
                      <h1>Hint</h1>
                      <img onClick={() => handleHint()}></img>
                    </div>
                    <div className='hint__container'>
                      <div id="scroll">
                        {parse(introductionData.hints[location.state.id - 1])}
                      </div>
                    </div>
                  </>
                )}
                
              </>
            )}
        </div>
        <div>
          <div className="game__statement tutorial__statement">
            <h2>Statement:</h2>
            <h1 className="game__statementTitle" id="scroll">{qst.statement}</h1>
          </div>
          <div className="game--grid">
            <div className="editor--div">
              <div className="editor__expected">
                <div className="game__expectedInput">
                  <h2>Example input:</h2>
                  <h1>{qst.inputs[0].toString()}</h1>
                </div>
  
                <div className="game__expectedOutput">
                  <h2>Example output:</h2>
                  <h1>{qst.output.toString()}</h1>
                </div>
              </div>
              <form className="editor" onSubmit={handleSubmit}>
                <CodeMirror code={code} setCode={setCode}></CodeMirror>
                <div className='result__container'>
                  <div className="game__result">
                    <h1>{error !== '' && <div>{error}</div>}</h1>
                  </div>
                  <button
                    className="pixel-button game__submit"
                    disabled={code === ''}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
}

export default Tutorial
