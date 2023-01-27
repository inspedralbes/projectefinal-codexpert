import "../normalize.css";
import { Link } from "react-router-dom";


function App() {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link to="/login">
        <button>Get Started</button>
      </Link>
    </div>
  );
}

export default App;
