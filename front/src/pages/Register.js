import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom"; //Rutas
import routes from "../index";
import session from "../components/UserSession";


function Register() {
    const [registro, setRegistro] = useState(0);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValidation, setPasswordValidation] = useState("");
    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (registro != 0) {
            const user = new FormData()
            user.append("name", username);
            user.append("email", email);
            user.append("password", password);
            user.append("password_confirmation", passwordValidation);

            fetch(routes.fetchLaravel + "/index.php/register", {
                method: 'POST',
                mode: 'cors',
                body: user,
                credentials: 'include'
            }).then((response) => response.json()).then((data) => {
                if (data.valid) { // Si registro es valido
                    console.log(data);
                    cookies.set('token', data.token, { path: '/' });
                    navigate("/avatarMaker")
                } else {
                    console.log(data);
                }
            }
            );
        }
    }, [registro]);

    return (
        <div className="form register">
            <h1>REGISTER</h1>
            <br />
            <div className="form__form">
                <div className="form__inputGroup">
                    <input className="form__input" placeholder=" " type="text" onChange={(e) => setUsername(e.target.value)} required></input>
                    <span className="form__inputBar"></span>
                    <label className="form__inputlabel">Username</label>
                </div>
                <div className="form__inputGroup">
                    <input className="form__input" placeholder=" " type="text" onChange={(e) => setEmail(e.target.value)} required></input>
                    <span className="form__inputBar"></span>
                    <label className="form__inputlabel">E-mail</label>
                </div>
                <div className="form__inputGroup">
                    <input className="form__input" placeholder=" " type="password" name="password" onChange={(e) => setPassword(e.target.value)} required></input>
                    <span className="form__inputBar"></span>
                    <label className="form__inputlabel">Password</label>
                </div>
                <div className="form__inputGroup">
                    <input className="form__input" placeholder=" " type="password" onChange={(e) => setPasswordValidation(e.target.value)} required></input>
                    <span className="form__inputBar"></span>
                    <label className="form__inputlabel">Repeat password</label>
                </div>
            </div>

            <div className="form__buttonsLinks">
                <div className="form__buttons">
                    <Link to="/login">
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
                        <button onClick={() => setRegistro(registro + 1)} id="submit__button">
                            <span className="circle2" aria-hidden="true">
                                <span className="icon2 arrow2"></span>
                            </span>
                            <span className="button-text">REGISTER</span>
                        </button>
                    </div>
                </div>
            </div>
            <Link to="/avatarMaker">
                <button>Avatar</button>
            </Link>
        </div>

    );
}

export default Register;
