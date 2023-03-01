import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import routes from "../index";
import logo from "../img/logo.gif";

function App() {
  const cookies = new Cookies();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const token = new FormData();
    if (document.cookie.indexOf("token" + "=") == 0) {
      //Si existe token en cookies hace la comprobación (sino da error)
      token.append("token", cookies.get("token"));
      fetch(routes.fetchLaravel + "/index.php/isUserLogged", {
        method: "POST",
        mode: "cors",
        body: token,
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setLogin(true);
          }
        });
    }
  }, []);
  return (
    <div>
      <div className="landingPage">
        <img src={logo} alt="codeXpert"></img>
        <p>
          Welcome to{" "}
          <b>
            code<mark>X</mark>pert
          </b>
          , where your dreams come true.
        </p>

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
      <div className="blog">
        <h1>Blog</h1>
        <h2>Welcome to the best competitive online programming game!</h2>
        <p>sdsadsa</p><p>sdsadsa</p><p>sdsadsa</p><p>sdsadsa</p><p>sdsadsa</p><p>sdsadsa</p>
      </div>
    </div>
  );
}

export default App;
