import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom' // Rutas
import './styles/index.css'
import './styles/mobileStyle.css'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Game from './pages/Game'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Lobbies from './pages/Lobbies'
import reportWebVitals from './reportWebVitals'
import AvatarMaker from './pages/AvatarMaker'
import Profile from './pages/Profile'
import Campaign from './pages/Campaign'
import Tutorial from './pages/Tutorial'
import './network.js'
import Error404 from './pages/404'
import Cookies from 'universal-cookie'
import SharedRanking from './pages/SharedRanking'
import Ranking from './pages/Ranking'
import Phaser from './pages/Phaser'

const cookies = new Cookies()

if (cookies.get('token') !== undefined && cookies.get('token') !== null) {
  window.postMessage({
    type: 'send_token-emit',
    token: cookies.get('token')
  }, '*')
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/'>
        <Route index element={<LandingPage />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='game' element={<Game />} />
        <Route path='forgotPassword' element={<ForgotPassword />} />
        <Route path='resetPassword' element={<ResetPassword />} />
        <Route path='avatarMaker' element={<AvatarMaker />} />
        <Route path='lobbies' element={<Lobbies />}></Route>
        <Route path='profile' element={<Profile />}></Route>
        <Route path='tutorial' element={<Tutorial />}></Route>
        <Route path='campaign' element={<Campaign />}></Route>
        <Route path='ranking' element={<Ranking />}></Route>
        <Route path='sharedRanking' element={<SharedRanking />}></Route>
        <Route path='phaser' element={<Phaser />}></Route>
        <Route path='404' element={<Error404 />}></Route>
        <Route path='*' element={<Navigate to='/404' />} />
      </Route>
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
