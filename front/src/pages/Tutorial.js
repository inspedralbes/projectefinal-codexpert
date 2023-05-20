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
import introduction from '../localData/Introductions.json'
import arrowLeft from '../img/corousel-arrowLeft.png'
import arrowRight from '../img/corousel-arrowRight.png'

function Tutorial() {
  const location = useLocation()
  const cookies = new Cookies()
  const navigate = useNavigate()
  const defaultCode =
    'function yourCode(input){ \n  //code here\n  \n  return input\n}\nyourCode(input)'
  const [code, setCode] = useState(defaultCode)
  const [error, setError] = useState('')
  const [qst, setQst] = useState({
    statement: '',
    inputs: [''],
    output: ''
  })

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

  useEffect(() => {
    if (location.state === null) {
      navigate('/campaign')
    } else {
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

  return (
    <div className="tutorial__container">
      <div className="introduction__container">
        <h1>Introduction:</h1>
        {introduction.introductions[location.state.id - 1].introduction[0] !==
          '' && (
            <>
              <Carousel
              
                adaptiveHeight={true}
                defaultControlsConfig={{
                  containerClassName: 'containerCarousel',
                  nextButtonClassName: introduction.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'nextButtonCarousel',
                  prevButtonClassName: introduction.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'prevButtonCarousel',
                  pagingDotsContainerClassName: introduction.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'dotsCarousel',

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
                {introduction.introductions[
                  location.state.id - 1
                ].introduction.map((element, index) => {
                  return <div key={index}>{parse(element)}</div>
                })}
              </Carousel>
            </>
          )}
      </div>
      <div>
        <div className="game__statement">
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

export default Tutorial
