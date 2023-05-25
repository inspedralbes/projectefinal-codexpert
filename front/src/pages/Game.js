/* eslint-disable */

import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import '../styles/game.css'
import '../styles/Lobbies.css'
import persiana from '../img/persiana.png'
import { useNavigate } from 'react-router-dom'
import ChatGame from '../components/ChatGame'
import ConnectedUsersInGame from '../components/ConnectedUsersInGame'
import { Loading } from '../components/Loading'
import CodeMirror from '../components/CodeMirror'
import Timer from '../components/Timer'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import heart from '../img/corazon_roto.gif'
import jose from '../img/jose.gif'
import Modal from 'react-modal'

function Game() {
  const defaultCode = 'function yourCode(input){ \n  //code here\n  \n  return input\n}\nyourCode(input)'
  const [code, setCode] = useState(defaultCode)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const [winnerMessage, setWinnerMessage] = useState('')
  const [playable, setPlayable] = useState(true)
  const [counter, setCounter] = useState(0)
  const [roundResult, setRoundResult] = useState(null)
  const [CmodalIsOpen, setCIsOpen] = useState(false)
  const [ImodalIsOpen, setIIsOpen] = useState(false)
  const [userLogged, setUserLogged] = useState(false)

  const cookies = new Cookies()

  const [qst, setQst] = useState({
    statement: '',
    inputs: [''],
    output: ''
  })
  const [overtimeDuration, setOvertimeDuration] = useState(0)

  const navigate = useNavigate()

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'question_data-event':
        setQst(window.network.getQuestionData())
        setCode(defaultCode)
        break

      case 'game_over-event':
        setWinnerMessage(window.network.getWinnerMessage())
        setOvertimeDuration(0)
        setPlayable(false)
        navigate('/ranking')
        break

      case 'user_finished-event':
        setResult(window.network.getResult())
        setPlayable(false)
        break

      case 'answer_correct-event':
        setRoundResult(eventData.correct)

        break

      case 'overtime_starts-event':
        setOvertimeDuration(eventData.time)
        break

      case 'YOU_LEFT_LOBBY-event':
        navigate('/lobbies')
        break

      default:
        break
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code !== '') {
      const resultsEvalRecieved = []
      let evalPassedBoolean = true

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

      window.postMessage({
        type: 'check_answer-emit',
        resultsEval: resultsEvalRecieved,
        evalPassed: evalPassedBoolean
      }, '*')
    }
  }

  function goBackToLobby() {
    navigate('/lobbies')
  }

  function leaveLobby() {
    window.postMessage({
      type: 'leave_lobby-emit',
      lobbyName: window.network.getLobbyName()
    }, '*')
  }

  function afterOpenModal() {
    setTimeout(() => {
      setCIsOpen(false)
      setIIsOpen(false)
    }, 4000)
  }

  useEffect(() => {
    if (roundResult) {
      setCIsOpen(true)
    } else if (roundResult == false) {
      setIIsOpen(true)
    }
    setRoundResult(null)
  }, [roundResult])

  const isUserLogged = () => {
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
        if (!data.correct) {
          navigate('/login')
        }else {
          setUserLogged(true)
        }
      })
  }

  useEffect(() => {
    isUserLogged()
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <>
    {userLogged
      ? <div className='game'>
      {overtimeDuration > 0 && playable
        && <>
        <img src={persiana}
          id='persiana'
          className='persiana'
          style={{ animation: `persianaAnim ${(overtimeDuration / 1000)}s cubic-bezier(0.01, 0.01, 0, 0.47) 1` }}
          alt=""></img>}
          <div className='game__timer'>
            {overtimeDuration != 0 ? <h1>TIME LEFT: <Timer id="timer" time={overtimeDuration} counter={counter} setCounter={setCounter}></Timer></h1> : <></>}
          </div>
        </>
      }
      <div className='game__container '>

        <div className='container__left'>
          <Modal
            className='correctAnsw game__modal'
            isOpen={CmodalIsOpen}
            onAfterOpen={afterOpenModal}
          >
            YOU DID IT!! :)
            <img src={jose} alt='' height={'300px'}></img>
          </Modal>
          <Modal
            className='incorrectAnsw game__modal animate__animated animate__tada'
            isOpen={ImodalIsOpen}
            onAfterOpen={afterOpenModal}
          >
            TRY AGAIN!!
            <img src={heart} alt='' height={'300px'}></img>
          </Modal>
          <div className={playable ? 'started__game' : 'ended__game'}>
            {overtimeDuration != 0 ? <h1>Overtime duration left: <Timer id="timer" time={overtimeDuration} counter={counter} setCounter={setCounter}></Timer></h1> : <></>}
          </div>
          <ConnectedUsersInGame></ConnectedUsersInGame>
          <ChatGame className='chatGame__chatbox'></ChatGame>
        </div>

        <div className='container__right'>
          {playable && <div className='game__playing' >
            <div className='game__statement'>
              <h2>Statement:</h2>
              <h1 className='game__statementTitle' id="scroll">{qst.statement}</h1>
            </div>
            <div>
              progres bar
            </div>
            <div className='game--grid'>
              <div className='editor--div'>
                <div className='pixelart-to-css'></div>
                <div className='editor__expected'>
                  <div className='game__expectedInput'>
                    <h2>Example input:</h2>
                    <h1>{qst.inputs[0].toString()}</h1>
                  </div>
                  <div className='game__expectedOutput'>
                    <h2>Example output:</h2>
                    <h1>{qst.output.toString()}</h1>
                  </div>
                </div>
                <form className="editor" onSubmit={handleSubmit}>
                <CodeMirror id="codemirror" code={code} setCode={setCode}></CodeMirror>
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

        </div>}
        {!playable && <div className='game__results'>
          <h1 className='game__yourResult'>{result}</h1>
          <h2>{winnerMessage}</h2>
          <p className='game__buttons'>
            <button className='pixel-button game__button' onClick={goBackToLobby}>GO BACK TO LOBBY</button>

            <button className='pixel-button game__button' onClick={leaveLobby}>LOBBY LIST</button>
          </p>
        </div>}
      </div>
      </div>
      </div>
      :<Loading></Loading>
    }
    </>

  )
}

export default Game
