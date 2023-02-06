import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import routeFetch from "../index"


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

      fetch(routeFetch + "/index.php/login", {
        method: 'POST',
        mode: 'cors',
        body: user,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        }
        );
    }

  }, [login]);

  useEffect(() => {
    if (mantenerSesion) {
      document.getElementById('checkboxText').style.color = '#ad7bf8';
      document.getElementById('checkboxText').style.transition = 'all 0.3s';
    }

    if (!mantenerSesion) {
      document.getElementById('checkboxText').style.color = '#b9b9b9';
    }
  }, [mantenerSesion])
  return (
    <div className="form">
      <h1>LOG IN</h1>
      <br />
      <div className="form__form">
        <div className="form__inputGroup">
          <input id="email" className="form__input" placeholder=" " type="text" onChange={(e) => setEmail(e.target.value)} required></input>
          <span className="form__inputBar"></span>
          <label className="form__inputlabel">E-mail</label>
        </div>
        <div className="form__inputGroup">
          <input id="password" className="form__input" placeholder=" " type="password" onChange={(e) => setPassword(e.target.value)} required></input>
          <span className="form__inputBar"></span>
          <label className="form__inputlabel">Password</label>
          <br />
          <div className="form__checkboxInput">
            <label id="switch" className="form__checkboxLabel"><input id="checkbox" className="form__inputCheckbox" type="checkbox" onChange={(e) => setMantenerSesion(!mantenerSesion)}></input> <div className="slider round"></div></label><label className="form__checkboxText" htmlFor="checkbox"><p id="checkboxText">mantener sesión iniciada</p></label>
          </div>
        </div>

      </div>
      <div className="form__buttonsLinks">
        <div className="form__buttons">
          <Link to="/">
            <div className="form__goBack">
              <div className="form__button--flex">
                <button id="goBack__button">
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">GO BACK</span>
                </button>
              </div>
            </div>
          </Link>

          <div className="form__submit submit">
            <button onClick={() => setLogin(login + 1)} id="submit__button">
              <span className="circle2" aria-hidden="true">
                <span className="icon2 arrow2"></span>
              </span>
              <span className="button-text">SUBMIT</span>
            </button>
          </div>
        </div>
        <div className="form__links link">
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
