import React from 'react'
import '../styles/normalize.css'
import '../styles/Header.css'
import Cookies from 'universal-cookie'
import IconUser from '../components/IconUser'
import Bell from '../components/Bell'

function Header() {
  const cookies = new Cookies()
  const userToken = cookies.get('token')

  return (
    <>
    {userToken !== undefined && (
      <div className='header__container'>
        <Bell></Bell>
        <IconUser></IconUser>
      </div>
    )}
    </>
  )
}

export default Header
