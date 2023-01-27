import "../normalize.css";
import { Link } from "react-router-dom";


function Login() {
    return (
        <div>
            <h1>Login</h1>
            <input placeholder="email" type="email"></input>
            <input placeholder="password" type="password"></input>
            <input type="checkbox"></input>
            <p>mantener sesión iniciada</p>
            <Link to="/">
                <button>Go back</button>
            </Link>
            <Link to="/game">
                <button>Login</button>
            </Link>
            <Link to="/forgotPassword">
                <a>I forgot my password</a>
            </Link>
            <Link to="/register">
                <a>Create account</a>
            </Link>
        </div>
    );
}

export default Login;
