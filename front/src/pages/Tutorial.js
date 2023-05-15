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
              className='awa'
                defaultControlsConfig={{
                  style: {},
                  containerClassName: 'containerCarousel',
                  nextButtonClassName: introduction.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'nextButtonCarousel',
                  prevButtonClassName: introduction.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'prevButtonCarousel',
                  pagingDotsContainerClassName: introduction.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'dotsCarousel',
                  
                  nextButtonText: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="68"
                      height="68"
                      viewBox="0 0 68 68"
                    >
                      <g
                        id="Group_8"
                        data-name="Group 8"
                        transform="translate(-1309 -621)"
                      >
                        <rect
                          id="Box"
                          width="68"
                          height="68"
                          transform="translate(1309 621)"
                          fill="none"
                        />
                        <path
                          id="Icon_Keyboard_Arrow_-_Up_Dark"
                          data-name="Icon / Keyboard Arrow - Up / Dark"
                          d="M30.033,20.967,17,7.933,3.967,20.967,0,17,17,0,34,17Z"
                          transform="translate(1353.483 637.15) rotate(90)"
                          fill="#fff"
                        />
                      </g>
                    </svg>
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
        <div className="tutorial__statement">
          <h2>Statement:</h2>
          <h1 className="tutorial__statementTitle">{qst.statement}</h1>
        </div>
        <div className="tutorial--grid">
          <div className="editor--div">
            <div className="editor__expected">
              <div className="tutorial__expectedInput">
                <h2>Example input:</h2>
                <h1>{qst.inputs[0].toString()}</h1>
              </div>

              <div className="tutorial__expectedOutput">
                <h2>Example output:</h2>
                <h1>{qst.output.toString()}</h1>
              </div>
              <div className="tutorial__expectedOutput tutorial__result">
                <h2>Result:</h2>
                <h1>{error !== '' && <div>{error}</div>}</h1>
              </div>
            </div>
            <form className="editor" onSubmit={handleSubmit}>
              <CodeMirror code={code} setCode={setCode}></CodeMirror>
              <button
                className="pixel-button tutorial__submit"
                disabled={code === ''}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
