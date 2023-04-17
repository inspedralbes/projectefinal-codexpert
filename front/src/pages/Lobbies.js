import React, { useEffect, useState } from "react";
import "../styles/normalize.css";
import "../styles/Lobbies.css";
import Chat from "../components/Chat";
import ConnectedUsers from "../components/ConnectedUsers";
import IconUser from "../components/IconUser";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import routes from "../index";
import { Blocks } from 'react-loader-spinner'
import lobbyTitle from '../img/lobbies.gif'
import arrow from '../img/arrow.gif'


const Lobbies = () => {
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyList, setLobbyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [joinedLobby, setJoined] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [fetchUser, setfetchUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleMessage = (event) => {
    let eventData = event.data

    switch (eventData.type) {
      case 'YOU_ARE_ON_LOBBY-event':
        setLobbyName(window.network.getLobbyName());
        setJoined(true);
        break;

      case 'lobbies_list-event':
        setLobbyList(window.network.getLobbyUserList());
        break;

      case 'game_started-event':
        navigate("/game");
        break;

      case 'LOBBY_FULL_ERROR-event':
        setLobbyName("");
        setJoined(false);
        setErrorMessage(window.ne.message)
        break;

      default:
        break;
    }
  }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    window.postMessage({
      type: 'new_lobby-emit',
      lobby_name: lobbyName
    }, '*')
    window.postMessage({
      type: 'join_room-emit',
      lobby_name: lobbyName,
      rank: "Owner",
    }, '*')
    setJoined(true);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setLobbyName(e.target.id);
    window.postMessage({
      type: 'join_room-emit',
      lobby_name: e.target.id,
      rank: "Member",
    }, '*')

    setJoined(true);
  };

  function startGame() {
    window.postMessage({
      type: 'start_game-emit'
    }, '*')
    navigate("/game");
  }

  useEffect(() => {
    if (document.cookie.indexOf("token" + "=") != -1) {
      const token = new FormData();
      token.append("token", cookies.get('token') !== undefined ? cookies.get("token") : null)
      fetch(routes.fetchLaravel + "isUserLogged", {
        method: "POST",
        mode: "cors",
        body: token,
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setfetchUser(true)
          } else {
            navigate("/login");
          }
        });
    } else {
      navigate("/login");
    }

    if (firstTime) {
      window.postMessage({
        type: 'hello_firstTime-emit'
      }, '*')
      setFirstTime(true);
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  if (fetchUser) {
    return (
      <div className="lobbies">

        {!joinedLobby && (
          <>
            <IconUser></IconUser>
            <div id="lobbyList" className="lobbies__lobbylist lobbylist">
              <div className="lobbylist__container">
                <img
                  className="lobbies__title"
                  src={lobbyTitle} alt="LOBBIES"
                />
                <ul className="lobbies__table table">
                  <li className="table__header">
                    <div className="col col-1">ID</div>
                    <div className="col col-2">Lobby Name</div>
                    <div className="col col-3">Owner</div>
                    <div className="col col-4">Players</div>
                  </li>
                  <div className="table__body">
                    {lobbyList.length == 0 &&
                      <div className="lobbies__noLobbies">
                        <h1>There are no lobbies yet</h1>
                        <h2>You can create one!!</h2>
                        <img
                          src={arrow} alt=" " height="100px"
                        />
                      </div>
                    }
                    {Array.isArray(lobbyList) ? lobbyList.map((element, index) => {
                      return (
                        <li
                          className="table__row row"
                          onClick={handleJoin}
                          key={index}
                          id={element.lobby_name}
                        >
                          <div
                            id={element.lobby_name}
                            className="col col-1"
                            data-label="Lobby Id"
                          >
                            {index + 1}
                          </div>
                          <div
                            id={element.lobby_name}
                            className="col col-2"
                            data-label="Lobby Name"
                          >
                            {element.lobby_name}
                          </div>
                          <div
                            id={element.lobby_name}
                            className="col col-3"
                            data-label="Owner"
                          >
                            {element.members[0].nom}
                          </div>
                          <div
                            id={element.lobby_name}
                            className="col col-4"
                            data-label="Players"
                          >
                            {element.members.length} / 4
                          </div>
                        </li>
                      );


                    }) : null}
                  </div>
                </ul>

                <form
                  className="lobbies__form"
                  onSubmit={handleSubmit}
                >
                  <div className="lobbiesForm__inputGroup">
                    <input
                      id="email"
                      className="lobbiesForm__input"
                      value={lobbyName}
                      placeholder="INTRODUCE LOBBY NAME"
                      type="text"
                      onChange={(e) => {
                        setLobbyName(e.target.value);
                      }}
                      autoComplete="off"
                      required
                    ></input>
                  </div>
                  <button className="lobbies__button" disabled={lobbyName === ""}>
                    Create lobby
                  </button>
                </form>
                {errorMessage != "" && <h2 className="lobbies__error">{errorMessage}</h2>}
              </div>
            </div>
          </>
        )}

        {joinedLobby && (
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
        )
        }
      </div >
    );
  } else {
    return (
      <>
        <h1>Loading</h1>
        <Blocks
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
        />
      </>
    );
  }

};

export default Lobbies;
