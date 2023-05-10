/* eslint-disable */

import '../styles/Tutorial.css'
import routes from '../conn_routes'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CodeMirror from '../components/CodeMirror'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom' // Rutas

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
      checkAnswer.append('evalPassed', evalPassedBoolean)
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
            let answered = false
            if (localStorage.getItem('tutorialsAnswered') !== null) {
              let tutorials = JSON.parse(
                localStorage.getItem('tutorialsAnswered')
              )
              for (let i = 0; i < tutorials.length; i++) {
                if (tutorials[i] === location.state.id) {
                  answered = true
                }
              }
              if (!answered) {
                tutorialsId = JSON.parse(
                  localStorage.getItem('tutorialsAnswered')
                )
              }
            }
            tutorialsId.push(location.state.id)
            tutorialsId.sort()
            localStorage.setItem(
              'tutorialsAnswered',
              JSON.stringify(tutorialsId)
            )

            if (location.state.id === 6) {
              localStorage.setItem(
                'tutorialPassed',
                JSON.stringify(true)
              )
            }

            navigate('/campaign')
          }
        })
    }
  }

  useEffect(() => {
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
        console.log(data)
        setQst(data)
      })
  }, [])

  return (
    <div className="tutorial__container">
      <div>
        <h1>Introduction</h1>
        <p>
          Lorem Ipsum et sit lorem apsum miau asdsa dsadsa dsad sad sa dsadsa
          dsa dsad asdsa dsa
        </p>
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
                <h1>{qst.inputs[0]}</h1>
              </div>

              <div className="tutorial__expectedOutput">
                <h2>Example output:</h2>
                <h1>{qst.output}</h1>
              </div>
              <div className="tutorial__expectedOutput tutorial__result">
                <h2>Result:</h2>
                <h1>{qst.output}</h1>
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
