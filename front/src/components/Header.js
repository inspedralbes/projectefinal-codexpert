import React from 'react'
import '../styles/normalize.css'
import '../styles/Header.css'
import IconUser from '../components/IconUser'
import Bell from '../components/Bell'

function Header() {
  return (
    <div className='header__container'>
      <Bell></Bell>
      <IconUser></IconUser>
    </div>
  )
}

export default Header
