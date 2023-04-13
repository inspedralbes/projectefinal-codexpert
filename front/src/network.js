import socketIO from "socket.io-client";
// import msgChanged from "./index.js";

let socket = socketIO("ws://localhost:7500", {
    withCredentials: true,
    cors: {
        origin: "*",
        credentials: true,
    },
    transports: ["websocket"],
})

const handleMessage = (event) => {
    // Event handle
    switch (event.data.type) {
        case 'send_token-emit':
            console.log(event.data.token);
            network.setToken(event.data.token);
            socket.emit("send_token", {
                token: event.data.token,
            })
            break;

        case "hello_firstTime-emit":
            socket.emit("hello_firstTime");
            break;

        case "new_lobby-emit":
            socket.emit("new_lobby", event.data.lobbyName);
            break;

        case "join_room-emit":
            socket.emit("join_room", {
                lobby_name: event.data.lobbyName,
                rank: event.data.rank,
            });
            break;

        default:
            break;
    }
}

class ConnectionNetwork {
    mensaje = "";
    token = "";
    lobby_name = "";
    userList = []

    setMensaje(msg) {
        this.mensaje = msg;
    }

    getMensaje() {
        return this.mensaje;
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
}

let network = new ConnectionNetwork();

// Window event listener for event handling
window.addEventListener('message', handleMessage);

// Eventos socket
socket.on("hello", (msg) => {
    network.setMensaje(msg);
    window.postMessage({ type: 'welcome_message-updated', recievedData: { msg: network.getMensaje() } }, '*')
})

socket.on("YOU_ARE_ON_LOBBY", (data) => {
    network.setLobbyName(data.lobby_name);
    window.postMessage({ type: 'YOU_ARE_ON_LOBBY-event' }, '*')
})

socket.on("lobbies_list", (data) => {
    network.setLobbyName(data.lobby_name);
    window.postMessage({ type: 'lobbies_list-event', lobbylist: network.getLobbyName() }, '*')
})

socket.on("lobby_user_list", (data) => {
    network.setLobbyUserList(data.list);
    window.postMessage({ type: 'lobby_user_list-event', list: network.getLobbyUserList() }, '*')
})

// ERROR EVENTS
socket.on("LOBBY_FULL_ERROR", (data) => {
    network.setMensaje(data.message);
    window.postMessage({ type: 'LOBBY_FULL_ERROR-event', message: network.getMensaje() }, '*')
})

export default network;
