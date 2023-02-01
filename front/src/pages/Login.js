import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import routeFetch from "../index"
import session from "../components/UserSession";


function Login() {
  const [login, setLogin] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mantenerSesion, setMantenerSesion] = useState(false);

  useEffect(() => {
    if (login != 0) {
      const user = new FormData()
      user.append("email", email);
      user.append("password", password);

      fetch(routeFetch + "/api/login", {
        method: 'POST',
        body: user
      })
        .then((response) => response.json())
        .then((data) => {
          session.setData(data);
          console.log(session.getData());
        }
        );
    }

  }, [login]);
  return (
    <div className="login">
      <h1>LOG IN</h1>
      <br />
      <div className="login__form">
        <div className="login__inputGroup">
          <input id="email" className="login__input" placeholder=" " type="text" onChange={(e) => setEmail(e.target.value)} required></input>
          <span className="login__inputBar"></span>
          <label htmlFor="email" className="login__inputlabel">E-mail</label>
        </div>
        <div className="login__inputGroup">
          <input id="password" className="login__input" placeholder=" " type="password" onChange={(e) => setPassword(e.target.value)} required></input>
          <span className="login__inputBar"></span>
          <label htmlFor="password" className="login__inputlabel">Password</label>
          <br />
          <div className="login__checkboxInput">
            <label className="login__checkboxLabel"><input className="login__inputCheckbox" type="checkbox" onChange={(e) => setMantenerSesion(!mantenerSesion)}></input> mantener sesión iniciada</label>
          </div>
        </div>

      </div>
      <div className="login__buttonsLinks">
        <div className="login__buttons">
          <Link to="/">
            <div className="login__goBack">
              <div className="login__button--flex">
                <button id="goBack__button">
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">GO BACK</span>
                </button>
              </div>
            </div>
          </Link>

          <div className="login__submit submit">
            <button onClick={() => setLogin(login + 1)} id="submit__button">
              <span className="circle2" aria-hidden="true">
                <span className="icon2 arrow2"></span>
              </span>
              <span className="button-text">SUBMIT</span>
            </button>
          </div>
        </div>
        <div className="login__links link">
          <Link className="link__ForgotPass" to="/forgotPassword">
            <p>Forgot your password?</p>
          </Link>
          <Link className="link__CreateAcc" to="/register">
            <p>Create account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
