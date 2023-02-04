import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; //Rutas
import './index.css';
import './mobileStyle.css';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'
import Lobbies from "./pages/Lobbies";
import reportWebVitals from './reportWebVitals';
import AvatarMaker from "./pages/AvatarMaker";
import socketIO from "socket.io-client";
// console.log("BEFORE CONNECT");

//window.ce_socket = socketIO.connect("http://localhost:4000");
window.ce_socket = socketIO("http://localhost:4000", {
  //withCredentials: true,
  //   cors: {
  //   origin: "http://localhost:3000",
  //   credentials: true
  //   },
  // //, 
  //noServer: true  
}
);

// 
// console.log("AFTER CONNECTION");


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="game" element={<Game />} />
          <Route path="forgotPassword" element={<ForgotPassword />} />
          <Route path="resetPassword" element={<ResetPassword />} />
          <Route path="avatarMaker" element={<AvatarMaker />} />
          <Route path="lobbylist" element={<Lobbies/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

const routeFetch = "http://localhost:8000"
const routeNodeServer = "http://localhost:4000"
export default routeFetch;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
