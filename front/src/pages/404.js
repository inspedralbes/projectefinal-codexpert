import "../normalize.css";
import { Link } from "react-router-dom";


function Game() {
  return (
    <div>
      <h1>404 Error</h1>
      <Link to="/">
        <button>Go to landing Page</button>
      </Link>
    </div>
  );
}

export default Game;
