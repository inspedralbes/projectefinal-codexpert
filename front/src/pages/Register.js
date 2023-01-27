import "../normalize.css";
import { Link } from "react-router-dom";

function Register() {
    return (
        <div>
            <h1>Register</h1>
            <input placeholder="nickname" type="text"></input>
            <input placeholder="email" type="email"></input>
            <input placeholder="password" type="password"></input>
            <input placeholder="repeat password" type="password"></input>
            <Link to="/login">
                <button>Go back</button>
            </Link>
            <Link to="/game">
                <button>Register</button>
            </Link>
        </div>
    );
}

export default Register;
