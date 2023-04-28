import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import routes from '../conn_routes'
import Ranking from '../components/Ranking'

function SharedRanking() {
  const [rankingData, setRankingData] = useState([])

  function getCurrentURL() {
    return window.location.href
  }

  useEffect(() => {
    const url = new URL(getCurrentURL())
    const idGame = url.searchParams.get('id')

    fetch(routes.fetchLaravel + 'ranking/' + idGame, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setRankingData(data)
      })
  }, [])

  return (
    <>
      <Ranking rankingData={rankingData}></Ranking>
    </>
  )
}

export default SharedRanking
