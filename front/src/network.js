import socketIO from "socket.io-client";

var socket = socketIO("ws://localhost:7500", {
    withCredentials: true,
    cors: {
        origin: "*",
        credentials: true,
    },
    transports: ["websocket"],
});

class ConnectionNetwork {
    mensaje = "";

    setMensaje(msg) {
        this.mensaje = msg;
    }

    getMensaje() {
        return this.mensaje;
    }
}

let network = new ConnectionNetwork;

socket.on("hello", (msg) => {
    network.setMensaje(msg);
    console.log(network.getMensaje());
})

export default [network, socket];
