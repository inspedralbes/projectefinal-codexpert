class ConnectionNetwork {
  message = ''
  userLogged = false
  username = 'Guest'
  winnerMessage = ''
  errorMessage = ''
  token = ''
  lobby_name = ''
  lobbyList = []
  userList = []
  lobbyMessages = []
  rankingData = []
  questionData = {}
  result = ''
  rewards = {}
  showSettings = false
  socketId = ''
  phaserId
  settings = {
    heartAmount: 0,
    overtimeDuration: 0,
    questionAmount: 0,
    unlimitedHearts: false,
    willHaveOvertime: true
  }

  setPhaserId(phaserId) {
    this.phaserId = phaserId
  }

  getPhaserId() {
    return this.phaserId
  }

  setSocketId(socketId) {
    this.socketId = socketId
  }

  getSocketId() {
    return this.socketId
  }

  setUsername(username) {
    this.username = username
  }

  getUsername() {
    return this.username
  }

  setUserLogged(isUserLogged) {
    this.userLogged = isUserLogged
  }

  getUserLogged() {
    return this.userLogged
  }

  setMessage(msg) {
    this.message = msg
  }

  getMessage() {
    return this.message
  }

  setErrorMessage(msg) {
    this.errorMessage = msg
  }

  getErrorMessage() {
    return this.errorMessage
  }

  setWinnerMessage(msg) {
    this.winnerMessage = msg
  }

  getWinnerMessage() {
    return this.winnerMessage
  }

  setToken(token) {
    this.token = token
  }

  getToken() {
    return this.token
  }

  setLobbyName(lobbyName) {
    this.lobby_name = lobbyName
  }

  getLobbyName() {
    return this.lobby_name
  }

  setLobbyList(lobbyList) {
    this.lobbyList = lobbyList
  }

  getLobbyList() {
    return this.lobbyList
  }

  setLobbyUserList(userList) {
    this.userList = userList
  }

  getLobbyUserList() {
    return this.userList
  }

  setLobbyMessages(list) {
    this.lobbyMessages = list
  }

  getLobbyMessages() {
    return this.lobbyMessages
  }

  setQuestionData(data) {
    this.questionData = data
  }

  getQuestionData() {
    return this.questionData
  }

  setResult(result) {
    this.result = result
  }

  getResult() {
    return this.result
  }

  setRewards(rewards) {
    this.rewards = rewards
  }

  getRewards() {
    return this.rewards
  }

  setOvertimeDuration(duration) {
    this.settings.overtimeDuration = duration
  }

  setWillHaveOvertime(willHave) {
    this.settings.willHaveOvertime = willHave
  }

  setHeartAmount(amt) {
    this.settings.heartAmount = amt
  }

  setQuestionAmount(amt) {
    this.settings.questionAmount = amt
  }

  setUnlimitedHearts(unlimited) {
    this.settings.unlimitedHearts = unlimited
  }

  getWillHaveOvertime() {
    return this.settings.willHaveOvertime
  }

  getOvertimeDuration() {
    return this.settings.overtimeDuration
  }

  getHeartAmount() {
    return this.settings.heartAmount
  }

  getQuestionAmount() {
    return this.settings.questionAmount
  }

  getUnlimitedHearts() {
    return this.settings.unlimitedHearts
  }

  setShowSettings(show) {
    this.showSettings = show
  }

  getShowSettings() {
    return this.showSettings
  }

  setRankingData(data) {
    this.rankingData = data
  }

  getRankingData() {
    return this.rankingData
  }
}

export default ConnectionNetwork
