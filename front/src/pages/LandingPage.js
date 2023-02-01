import "../normalize.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Lobbies from "./Lobbies";
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

function App() {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/lobbylist" element={<Lobbies socket={socket} />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
      <div>
        <h1>Landing Page</h1>
        <Link to="/login">
          <button>Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default App;
