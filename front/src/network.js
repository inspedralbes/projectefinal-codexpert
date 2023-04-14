import socketIO from "socket.io-client";

let socket = socketIO("ws://localhost:7500", {
    withCredentials: true,
    cors: {
        origin: "*",
        credentials: true,
    },
    transports: ["websocket"],
})

const handleMessage = (event) => {
    let eventData = event.data

    // Event handle
    switch (eventData.type) {
        case 'send_token-emit':
            window.network.setToken(eventData.token);
            socket.emit("send_token", {
                token: eventData.token,
            })
            break;

        case "hello_firstTime-emit":
            socket.emit("hello_firstTime");
            break;

        case "new_lobby-emit":
            socket.emit("new_lobby", eventData.lobby_name);
            break;

        case "join_room-emit":
            socket.emit("join_room", {
                lobby_name: eventData.lobby_name,
                rank: eventData.rank,
            });
            break;

        case "send_token-emit":
            socket.emit("send_token", {
                token: eventData.token,
            });
            break;

        case "lobby_data_pls-emit":
            socket.emit("lobby_data_pls");
            break;

        case "chat_message-emit":
            socket.emit("chat_message", {
                message: eventData.message,
                room: eventData.lobbyName,
            });
            break;

        case "leave_lobby-emit":
            socket.emit("leave_lobby", eventData.lobbyName);
            break;

        case "start_game-emit":
            socket.emit("start_game");
            break;

        case "check_answer-emit":
            socket.emit("check_answer", {
                resultsEval: eventData.resultsEval,
                evalPassed: eventData.evalPassed,
            });
            break;

        default:
            break;
    }
}

class ConnectionNetwork {
    message = "";
    token = "";
    lobby_name = "";
    userList = [];
    lobbyMessages = [];
    questionData = {};
    winnerMessage = "";
    result = "";
    rewards = {};

    setMessage(msg) {
        this.message = msg;
    }

    getMessage() {
        return this.message;
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    setLobbyName(lobby_name) {
        this.lobby_name = lobby_name;
    }

    getLobbyName() {
        return this.lobby_name;
    }

    setLobbyUserList(userList) {
        this.userList = userList;
    }

    getLobbyUserList() {
        return this.userList;
    }

    setLobbyMessages(list) {
        this.lobbyMessages = list;
    }

    getLobbyMessages() {
        return this.lobbyMessages;
    }

    setQuestionData(data) {
        this.questionData = data;
    }

    getQuestionData() {
        return this.questionData;
    }

    setWinnerMessage(msg) {
        this.winnerMessage = msg;
    }

    getWinnerMessage() {
        return this.winnerMessage;
    }

    setResult(result) {
        this.result = result;
    }

    getResult() {
        return this.result;
    }

    setRewards(rewards) {
        this.rewards = rewards;
    }

    getRewards() {
        return this.rewards;
    }
}

window.network = new ConnectionNetwork();

// Window event listener for event handling
window.addEventListener('message', handleMessage);

// Eventos socket
socket.on("hello", (msg) => {
    window.network.setMessage(msg);
    window.postMessage({ type: 'welcome_message-updated' }, '*')
})

socket.on("YOU_ARE_ON_LOBBY", (data) => {
    window.network.setLobbyName(data.lobby_name);
    window.postMessage({ type: 'YOU_ARE_ON_LOBBY-event' }, '*')
})

socket.on("lobbies_list", (data) => {
    window.network.setLobbyName(data.lobby_name);
    window.postMessage({ type: 'lobbies_list-event' }, '*')
})

socket.on("lobby_user_list", (data) => {
    window.network.setLobbyUserList(data.list);
    window.postMessage({ type: 'lobby_user_list-event' }, '*')
})

socket.on("lobby_message", function (data) {
    window.network.setLobbyMessages(data.messages);
    window.postMessage({ type: 'lobby_message-event' }, '*')
});

socket.on("game_started", () => {
    window.postMessage({ type: 'game_started-event' }, '*')
});

socket.on("lobby_name", (data) => {
    window.postMessage({ type: 'lobby_name-event' }, '*')
})

socket.on("question_data", function (data) {
    window.network.setQuestionData(data)
    window.postMessage({ type: 'question_data-event' }, '*')
});

socket.on("game_over", function (data) {
    window.network.setWinnerMessage(data.message);
    window.postMessage({ type: 'game_over-event' }, '*')
});

socket.on("user_finished", function (data) {
    window.network.setResult(data.message);
    window.postMessage({ type: 'user_finished-event' }, '*')
});

socket.on("stats", (data) => {
    window.postMessage({ type: 'stats-event' }, '*')
    window.network.setRewards({
        xpEarned: data.xpEarned,
        coinsEarned: data.coinsEarned,
        eloEarned: data.eloEarned,
    })
})

socket.on("YOU_LEFT_LOBBY", () => {
    window.postMessage({ type: 'YOU_LEFT_LOBBY-event' }, '*')
})

// ERROR EVENTS
socket.on("LOBBY_FULL_ERROR", (data) => {
    window.network.setMessage(data.message);
    window.postMessage({ type: 'LOBBY_FULL_ERROR-event' }, '*')
})
