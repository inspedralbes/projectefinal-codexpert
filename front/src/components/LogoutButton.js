import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import routeFetch from "../index"
import session from "./UserSession";


function Login() {
    const [login, setLogin] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mantenerSesion, setMantenerSesion] = useState(false);

    useEffect(() => {

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
            }
            );

    }, [login]);
    return (
        <div>
            <button>Logout</button>
        </div>
    );
}

export default Login;
