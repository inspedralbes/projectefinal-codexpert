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
        <div>
            <h1>Login</h1>
            <input placeholder="email" type="email" onChange={(e) => setEmail(e.target.value)}></input>
            <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)}></input>
            <input type="checkbox" onChange={(e) => setMantenerSesion(!mantenerSesion)}></input>
            <p>mantener sesión iniciada</p>
            <Link to="/">
                <button>Go back</button>
            </Link>
            <button onClick={() => setLogin(login + 1)}>Login</button>
            <Link to="/forgotPassword">
                I forgot my password
            </Link>
            <Link to="/register">
                Create account
            </Link>
        </div>
    );
}

export default Login;
