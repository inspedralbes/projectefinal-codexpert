import React from 'react'
import '../styles/normalize.css'
import { Link } from 'react-router-dom'

function E404 () {
  return (
    <div>
      <h1>404 Error</h1>
      <Link to='/'>
        <button>Go to Home</button>
      </Link>
    </div>
  )
}

export default E404
