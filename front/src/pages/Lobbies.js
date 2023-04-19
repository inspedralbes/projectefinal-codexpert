import React, { useEffect, useState } from "react";
import "../styles/normalize.css";
import "../styles/Lobbies.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import routes from "../index";
import Loading from "../components/Loading";
import LobbyList from "../components/LobbyList";
import JoinedLobby from "../components/JoinedLobby";
import { Blocks } from 'react-loader-spinner';
import lobbyTitle from '../img/lobbies.gif';


Modal.setAppElement('body');

const Lobbies = () => {
  const [lobbyList, setLobbyList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [lobbyName, setLobbyName] = useState("");
  const [joinedLobby, setJoined] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [fetchUser, setfetchUser] = useState(false);


  const navigate = useNavigate();
  const cookies = new Cookies();


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
          setFetchUser(true)
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


}, []);


if (fetchUser) {
  return (
    <div className="lobbies">

      {!joinedLobby && (
        <LobbyList lobbyName={lobbyName} setLobbyName={setLobbyName} lobbyList={lobbyList} errorMessage={errorMessage} setJoined={setJoined}></LobbyList>
      )}

      {joinedLobby && (
        <JoinedLobby lobbyName={lobbyName} setJoined={setJoined} setLobbyName={setLobbyName} setLobbyList={setLobbyList} showSettings={showSettings} errorMessage={errorMessage} setSent={setSent}></JoinedLobby>
      )
      }
    </div>
  );
} else {
  return (
    <Loading></Loading>
  );
}

export default Lobbies;
