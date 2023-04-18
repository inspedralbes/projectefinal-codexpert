import "../styles/normalize.css";
import Chat from "../components/Chat";
import ConnectedUsers from "../components/ConnectedUsers";
import { useNavigate } from "react-router-dom";

function JoinedLobby({ lobbyName, setJoined, setLobbyName, setLobbyList }) {
    const navigate = useNavigate();
    const handleLeave = (e) => {
        e.preventDefault();
        console.log("has abandonat la sala " + lobbyName);
        window.postMessage({
            type: 'leave_lobby-emit',
            lobbyName: lobbyName
        }, '*')
        setJoined(false);
        setLobbyName("");
        setLobbyList([]);
    };



    function startGame() {
        window.postMessage({
            type: 'start_game-emit'
        }, '*')
        navigate("/game");
    }
    return (
        <div id="lobbyJoined" className="lobbies__lobby lobby">
            <button id="goBackToLobby__button" onClick={handleLeave}>
                <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                </span>
                <span className="button-text">LEAVE CURRENT LOBBY
                </span>
            </button>
            <ConnectedUsers></ConnectedUsers>
            <div className="button-startGame">
                <button className="startGame" id="startGame" onClick={startGame}>Start game</button>
            </div>
            <div className="lobby__chat">
                <Chat className="chat__chatbox" lobbyName={lobbyName}></Chat>
            </div>
        </div>
    );
}

export default JoinedLobby;
