import "../styles/normalize.css";
import ChatLobby from "../components/ChatLobby";
import ConnectedUsers from "../components/ConnectedUsers";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Settings from './Settings';
import Modal from 'react-modal';

Modal.setAppElement('body');

function JoinedLobby({ lobbyName, setJoined, setLobbyName, setLobbyList, errorMessage }) {
    const [sent, setSent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [fetchSettings, setFetchSettings] = useState(false);

    const navigate = useNavigate();

    const handleMessage = (event) => {
        let eventData = event.data

        switch (eventData.type) {
            case 'starting_errors-event':
                if (eventData.valid) {
                    if (!sent) {
                        window.postMessage({
                            type: 'start_game-emit'
                        }, '*')
                    }
                    setSent(true);
                }
                break;

            case 'show_settings-event':
                setShowSettings(window.network.getShowSettings())
                break;

            case 'lobby_settings-event':
                setFetchSettings(true);
                break;

            default:
                break;
        }
    }

    const handleLeave = (e) => {
        e.preventDefault();
        window.postMessage({
            type: 'leave_lobby-emit'
        }, '*')
        setJoined(false);
        setLobbyName("");
        setLobbyList([]);
    };

    function startGame(e) {
        e.preventDefault();
        setSent(false);
        window.postMessage({
            type: 'start_game-emit'
        }, '*')
        navigate("/game");
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [])

    return (
        <div id="lobbyJoined" className="lobbies__lobby lobby">
            <button id="goBackToLobby__button" onClick={handleLeave}>
                <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                </span>
                <span className="button-text">LEAVE CURRENT LOBBY
                </span>
            </button>
            {showSettings ?
                <>
                    <button onClick={() => setShowModal(true)}>Settings</button>
                    <Modal
                        style={{ //QUITAR Y PERSONALIZAR ESTILOS CUANDO SE APLIQUE CSS
                            content: {
                                top: '50%',
                                left: '50%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                padding: "5%"
                            },
                        }}
                        onRequestClose={() => setShowModal(false)}
                        shouldCloseOnOverlayClick={true}
                        isOpen={showModal}
                    >
                        <Settings fetchSettings={fetchSettings}></Settings>
                    </Modal>
                </> :
                <></>}
            {errorMessage != "" && <h2 className="lobbies__error">{errorMessage}</h2>}
            <ConnectedUsers></ConnectedUsers>
            {showSettings &&
                <div className="button-startGame">
                    <button className="startGame" id="startGame" onClick={startGame}>Start game</button>
                </div>}
            <div className="lobby__chat">
                <ChatLobby className="chat__chatbox" lobbyName={lobbyName}></ChatLobby>
            </div>
        </div>
    );
}

export default JoinedLobby;
