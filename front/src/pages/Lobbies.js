import React, { useEffect, useState } from "react";
import "../normalize.css";
import "../Lobbies.css";
import Chat from "../components/Chat";
import ConnectedUsers from "../components/ConnectedUsers";
import IconUser from "../components/IconUser";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import routes from "../index";
import { Blocks } from 'react-loader-spinner'
import lobbyTitle from '../img/lobbies.gif'
import arrow from '../img/arrow.gif'

// socket.io

const Lobbies = ({ socket }) => {
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyList, setLobbyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [joinedLobby, setJoined] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [fetchUser, setfetchUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLeave = (e) => {
    e.preventDefault();
    console.log("has abandonat la sala " + lobbyName);
    socket.emit("leave lobby", lobbyName);
    setJoined(false);
    setLobbyName("");
    setLobbyList([]);
    // setMessages([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("new lobby", lobbyName);
    socket.emit("join room", {
      lobby_name: lobbyName,
      rank: "Owner",
    });
    setJoined(true);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setLobbyName(e.target.id);
    socket.emit("join room", {
      lobby_name: e.target.id,
      rank: "Member",
    });

    // console.log(socket);
    setJoined(true);
  };

  function startGame() {
    socket.emit("start_game");
    navigate("/game");
  }

  useEffect(() => {
    if (document.cookie.indexOf("token" + "=") != -1) {
      const token = new FormData();
      token.append("token", cookies.get('token'))
      fetch(routes.fetchLaravel + "/index.php/isUserLogged", {
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
      socket.emit("hello", "gimme gimme");
      setFirstTime(true);
    }

    socket.on("lobbies list", function (lobbylist) {
      setLobbyList(lobbylist);
    });

    socket.on("player joined", (id) => {
      console.log(id + " joined the lobby");
    });

    socket.on("game_started", () => {
      navigate("/game");
    });

    socket.on("YOU_ARE_ON_LOBBY", (data) => {
      setLobbyName(data.lobby_name);
      setJoined(true);
    })

    socket.on("LOBBY_FULL_ERROR", (data) => {
      setLobbyName("");
      setJoined(false);
      setErrorMessage(data.message)
    })

    socket.on("YOU_LEFT_LOBBY", () => {
      setJoined(false);
      setLobbyName("");
    })

  }, []);


  if (fetchUser) {
    return (
      <div className="lobbies">
        
        {!joinedLobby && (
          <>
          <IconUser></IconUser>
          <div id="lobbyList" className="lobbies__lobbylist lobbylist">
            <IconUser></IconUser>

            <div className="lobbylist__container">
              <img
                className="lobbies__title"
                src={lobbyTitle} alt="LOBBIES"
              />
              {/* onClick={() => {
                  socket.emit("hello", "gimme gimme");
                }} */}
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
            <ConnectedUsers socket={socket} ></ConnectedUsers>
            <button className="pixel-button" onClick={startGame}>Start game</button>
            <Chat className="chat__chatbox" socket={socket} lobbyName={lobbyName}></Chat>
          </div>
        )}
      </div>
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
