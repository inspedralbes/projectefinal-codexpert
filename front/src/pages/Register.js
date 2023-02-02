import "../normalize.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import routeFetch from "../index"

function Register() {
    const [registro, setRegistro] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValidation, setPasswordValidation] = useState("");
    useEffect(() => {
        const user = new FormData()
        user.append("name", username);
        user.append("email", email);
        user.append("password", password);
        user.append("password_confirmation", passwordValidation);

        fetch(routeFetch + "/index.php/register", {
            method: 'POST',
            body: user
        }).then((response) => response.json()).then((data) => {
            if (data.valid) {
                //Se ha creado el usuario
            } else {
                //no se ha creado hacemos otra cosa
            }
        }
        );
    }, [registro]);

    return (
        <div>
            <h1>Register</h1>
            <input placeholder="nickname" type="text" onChange={(e) => setUsername(e.target.value)}></input>
            <input placeholder="email" type="email" onChange={(e) => setEmail(e.target.value)}></input>
            <input placeholder="password" type="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
            <input placeholder="repeat password" type="password" onChange={(e) => setPasswordValidation(e.target.value)}></input>
            <Link to="/login">
                <button>Go back</button>
            </Link>

            <button onClick={() => setRegistro(!registro)}>Register</button>
            <Link to="/avatarMaker">
                <button>Avatar</button>
            </Link>
        </div>
    );
}

export default Register;
