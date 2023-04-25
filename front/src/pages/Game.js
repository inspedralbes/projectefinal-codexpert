/* eslint-disable */

import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import '../styles/game.css'
import '../styles/Lobbies.css'
import { useNavigate } from 'react-router-dom'
import ChatGame from '../components/ChatGame'
import ConnectedUsersInGame from '../components/ConnectedUsersInGame'
import CodeMirror from '../components/CodeMirror'

function Game () {
  const defaultCode = 'function yourCode(input){ \n  //code here\n  \n  return input\n}\nyourCode(input)'
  const [code, setCode] = useState(defaultCode)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const [winnerMessage, setWinnerMessage] = useState('')
  const [playable, setPlayable] = useState(true)
  const [rewards, setRewards] = useState({
    xpEarned: 0,
    coinsEarned: 0,
    eloEarned: 0
  })
  const [qst, setQst] = useState({
    statement: '',
    inputs: [''],
    output: ''
  })

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
        setPlayable(false)
        break

      case 'user_finished-event':
        setResult(window.network.getResult())
        setPlayable(false)
        break

      case 'stats-event':
        setRewards(window.network.getRewards())
        break

      case 'YOU_LEFT_LOBBY-event':
        navigate('/lobbies')
        break

      default:
        //
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

  function goBackToLobby () {
    navigate('/lobbies')
  }

  function leaveLobby () {
    window.postMessage({
      type: 'leave_lobby-emit',
      lobbyName: window.network.getLobbyName()
    }, '*')
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div>
      <div className='game__container '>

        <div className='container__left'>
          <ConnectedUsersInGame></ConnectedUsersInGame>
          <ChatGame className='chatGame__chatbox'></ChatGame>
        </div>

        <div className='container__right'>
          {playable && <div className='game__playing' >
            <div className='game__statement'>
              <h2>Statement:</h2>
              <h1 className='game__statementTitle'>{qst.statement}</h1>
            </div>
            <div className='game--grid'>

              <div className='game__expectedInput'>
                <h2>Example input:</h2>
                <h1>{qst.inputs[0].toString()}</h1>
              </div>

              <div className='game__expectedOutput'>
                <h2>Example output:</h2>
                <h1>{qst.output.toString()}</h1>
              </div>
            </div>

            <form className='editor' onSubmit={handleSubmit}>
              <CodeMirror code={code} setCode={setCode}></CodeMirror>
              {/* {Array.isArray(qst.inputs[0]) && `let input = [${qst.inputs[0].toString()}]`}
              {!Array.isArray(qst.inputs[0]) && `let input = '${qst.inputs[0].toString()}'`}<br /> */}
              <button className='game__submit' disabled={code === ''}>
                Submit
              </button>
            </form>

            {error !== '' && <div>{error}</div>}

          </div>}
          {!playable && <div className='game__results'>
            <h1 className='game__yourResult'>{result}</h1>
            <h2>{winnerMessage}</h2>
            <ul className='game__rewards'>
              <li>XP: {rewards.xpEarned}</li>
              <li>Coins: {rewards.coinsEarned}</li>
              <li>Elo: {rewards.eloEarned}</li>
            </ul>
            <p className='game__buttons'>
              <button className='pixel-button game__button' onClick={goBackToLobby}>GO BACK TO LOBBY</button>

              <button className='pixel-button game__button' onClick={leaveLobby}>LOBBY LIST</button>
            </p>
          </div>}
        </div>
      </div>
    </div >

  )
}

export default Game
