import "../normalize.css";
import { Link } from "react-router-dom";
import routes from "../index";

function App() {
  return (
    <div>
      <div>
        <h1>Landing Page</h1>
        <Link to="/login">
          <button>Get Started</button>
        </Link>
        <Link to="/lobbies">
          <button>Lobbies</button>
        </Link>
      </div>
    </div>
  );
}

export default App;
