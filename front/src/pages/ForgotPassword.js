import "../normalize.css";
import { Link } from "react-router-dom";


function ForgotPassword() {
    return (
        <div>
            <h1>Forgot your password?</h1>
            <input placeholder="Email" type="email"></input>
            <Link to="/login">
                <button>Go back</button>
            </Link>
            <button>Reset your password</button>
        </div>
    );
}

export default ForgotPassword;