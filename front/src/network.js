import socketIO from 'socket.io-client'
import ConnectionNetwork from './ConnectionNetwork.js'

const socket = socketIO('ws://localhost:7500', {
  withCredentials: true,
  cors: {
    origin: '*',
    credentials: true
  },
  transports: ['websocket']
})

window.network = new ConnectionNetwork()

const handleMessage = (event) => {
  const eventData = event.data

  // Event handle
  switch (eventData.type) {
    case 'send_token-emit':
      window.network.setToken(eventData.token)
      socket.emit('send_token', {
        token: eventData.token
      })
      break

    case 'hello_firstTime-emit':
      socket.emit('hello_firstTime')
      break

    case 'new_lobby-emit':
      socket.emit('new_lobby', eventData.lobby_name)
      break

    case 'join_room-emit':
      socket.emit('join_room', {
        lobby_name: eventData.lobby_name,
        rank: eventData.rank
      })
      break

    case 'lobby_data_pls-emit':
      socket.emit('lobby_data_pls')
      break

    case 'chat_message-emit':
      socket.emit('chat_message', {
        message: eventData.message
      })
      break

    case 'leave_lobby-emit':
      socket.emit('leave_lobby')
      break

    case 'start_game-emit':
      socket.emit('start_game')
      break

    case 'check_answer-emit':
      socket.emit('check_answer', {
        resultsEval: eventData.resultsEval,
        evalPassed: eventData.evalPassed
      })
      break

    case 'save_settings-emit':
      console.log('EMIT Qamt', window.network.getQuestionAmount())
      socket.emit('save_settings', {
        gameDuration: window.network.getGameDuration(),
        heartAmount: window.network.getHeartAmount(),
        unlimitedHearts: window.network.getUnlimitedHearts(),
        questionAmount: window.network.getQuestionAmount()
      })
      break

    default:
      // UNKNOWN EVENT
      break
  }
}

// Window event listener for event handling
window.addEventListener('message', handleMessage)

// Eventos socket
socket.on('YOU_ARE_ON_LOBBY', (data) => {
  window.network.setLobbyName(data.lobby_name)
  window.postMessage({ type: 'YOU_ARE_ON_LOBBY-event' }, '*')
})

socket.on('lobby_name', (data) => {
  window.network.setLobbyName(data.lobby_name)
  window.postMessage({ type: 'lobby_name-event' }, '*')
})

socket.on('lobbies_list', (data) => {
  window.network.setLobbyList(data)
  window.postMessage({ type: 'lobbies_list-event' }, '*')
})

socket.on('lobby_user_list', (data) => {
  window.network.setLobbyUserList(data.list)
  window.postMessage({ type: 'lobby_user_list-event' }, '*')
})

socket.on('lobby_message', function (data) {
  window.network.setLobbyMessages(data.messages)
  window.postMessage({ type: 'lobby_message-event' }, '*')
})

socket.on('game_started', () => {
  window.postMessage({ type: 'game_started-event' }, '*')
})

socket.on('lobby_name', (data) => {
  window.postMessage({ type: 'lobby_name-event' }, '*')
})

socket.on('question_data', function (data) {
  window.network.setQuestionData(data)
  window.postMessage({ type: 'question_data-event' }, '*')
})

socket.on('game_over', function (data) {
  window.network.setWinnerMessage(data.message)
  window.postMessage({ type: 'game_over-event' }, '*')
})

socket.on('user_finished', function (data) {
  window.network.setResult(data.message)
  window.postMessage({ type: 'user_finished-event' }, '*')
})

socket.on('stats', (data) => {
  window.postMessage({ type: 'stats-event' }, '*')
  window.network.setRewards({
    xpEarned: data.xpEarned,
    coinsEarned: data.coinsEarned,
    eloEarned: data.eloEarned
  })
})

socket.on('YOU_LEFT_LOBBY', () => {
  window.postMessage({ type: 'YOU_LEFT_LOBBY-event' }, '*')
})

socket.on('show_settings', (data) => {
  window.network.setShowSettings(data.show)
  window.postMessage({ type: 'show_settings-event' }, '*')
})

socket.on('lobby_settings', (data) => {
  window.network.setGameDuration(data.gameDuration)
  window.network.setHeartAmount(data.heartAmount)
  window.network.setUnlimitedHearts(data.unlimitedHearts)
  window.network.setQuestionAmount(data.questionAmount)
  window.postMessage({ type: 'lobby_settings-event' }, '*')
})

socket.on('ALREADY_ON_LOBBY', (data) => {
  window.network.setMessage(data.message)
  window.postMessage({ type: 'ALREADY_ON_LOBBY-event' }, '*')
})

socket.on('starting_errors', (data) => {
  window.postMessage({ type: 'starting_errors-event', valid: data.valid }, '*')
})

// ERROR EVENTS
socket.on('LOBBY_FULL_ERROR', (data) => {
  window.network.setMessage(data.message)
  window.postMessage({ type: 'LOBBY_FULL_ERROR-event' }, '*')
})

socket.on('LOBBY_ALREADY_EXISTS', (data) => {
  window.network.setMessage(data.message)
  window.postMessage({ type: 'LOBBY_ALREADY_EXISTS-event' }, '*')
})

socket.on('GAME_TIME_UNDER_MIN', (data) => {
  window.network.setErrorMessage(`Selected game duration was too low -> Minimum: ${data.min}`)
  window.postMessage({ type: 'GAME_TIME_UNDER_MIN-event' }, '*')
})

socket.on('GAME_TIME_ABOVE_MAX', (data) => {
  window.network.setErrorMessage(`Selected game duration was too high -> Maximum: ${data.max}`)
  window.postMessage({ type: 'GAME_TIME_ABOVE_MAX-event' }, '*')
})

socket.on('HEARTS_AMT_UNDER_MIN', (data) => {
  window.network.setErrorMessage(`Selected amount of hearts was too low -> Minimum: ${data.min}`)
  window.postMessage({ type: 'HEARTS_AMT_UNDER_MIN-event' }, '*')
})

socket.on('HEARTS_AMT_ABOVE_MAX', (data) => {
  window.network.setErrorMessage(`Selected amount of hearts was too high -> Maximum: ${data.max}`)
  window.postMessage({ type: 'HEARTS_AMT_ABOVE_MAX-event' }, '*')
})

socket.on('QUESTION_AMT_UNDER_MIN', (data) => {
  window.network.setErrorMessage(`Selected amount of questions was too low -> Minimum: ${data.min}`)
  window.postMessage({ type: 'QUESTION_AMT_UNDER_MIN-event' }, '*')
})

socket.on('QUESTION_AMT_ABOVE_MAX', (data) => {
  window.network.setErrorMessage(`Selected amount of questions was too high -> Maximum: ${data.max}`)
  window.postMessage({ type: 'QUESTION_AMT_ABOVE_MAX-event' }, '*')
})

socket.on('INVALID_SETTINGS', () => {
  window.network.setErrorMessage('Can\'t start the game with invalid settings')
  window.postMessage({ type: 'INVALID_SETTINGS-event' }, '*')
})
