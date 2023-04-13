import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import routes from "../index";
import logo from '../img/logo.gif'

function LandingPage({ network }) {
  const cookies = new Cookies();
  const [login, setLogin] = useState(false);

  const handleMessage = (event) => {
    if (event.isTrusted) {
      switch (event.data.type) {
        case 'welcome_message-updated':
          console.log(event.data.recievedData.msg);
          break;

        default:
          break;
      }
    } else {
      console.log("NOT TRUSTED");
    }
  }

  useEffect(() => {
    const token = new FormData();
    if (document.cookie.indexOf("token" + "=") == 0) {  //Si existe token en cookies hace la comprobación (sino da error)
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
            setLogin(true)
          }
        });
    }
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

        {/* <p className="landingPage__codexpert">CODEPERT</p> */}
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
