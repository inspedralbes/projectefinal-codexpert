import "../styles/normalize.css";
import { Link } from "react-router-dom";

function ResetPassword() {
    return (
        <div>
            <h1>Reset your password</h1>
            <input placeholder="Email" type="email"></input>
            <input placeholder="password" type="password"></input>
            <input placeholder="repeat password" type="password"></input>
            <Link to="/login">
                <button>Done</button>
            </Link>
        </div>
    );
}

export default ResetPassword;