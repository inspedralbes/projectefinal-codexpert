import routes from '../conn_routes'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function Tutorial() {
  const location = useLocation()
  useEffect(() => {
    const tutorialId = new FormData()
    tutorialId.append('id', location.state.id)
    fetch(routes.fetchLaravel + 'getTutorialFromId', {
      method: 'POST',
      mode: 'cors',
      body: tutorialId,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
  }, [])

  return (
    <div className='tutorial'>
    </div>
  )
}

export default Tutorial
