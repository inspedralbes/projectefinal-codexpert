import "../styles/normalize.css";
import "../styles/LandingPage.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import routes from "../index";
import logo from '../img/logo.gif'

function LandingPage({ network }) {
  const cookies = new Cookies();
  const [login, setLogin] = useState(false);

  const handleMessage = (event) => {
    let eventData = event.data

    switch (eventData.type) {
      case 'welcome_message-updated':
        console.log(window.network.getMessage());
        break;

      default:
        break;
    }
  }

  useEffect(() => {
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
          setLogin(true)
        }
      });

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [])

  return (
    <div>
      <div className="landingPage">
        <img src={logo} alt="codeXpert"></img>
        <p>Welcome to <b>code<mark>X</mark>pert</b>, where your dreams come true.</p>
        <br />
        {!login && (
          <Link to="/login">
            <button className="pixel-button">Get Started</button>
          </Link>
        )}
        {login && (
          <Link to="/lobbies">
            <button className="pixel-button">Lobbies</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
