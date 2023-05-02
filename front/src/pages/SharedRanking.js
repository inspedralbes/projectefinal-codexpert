import React, { useEffect, useState } from 'react'
import routes from '../conn_routes'
import Ranking from '../components/Ranking'
import { LoadingRanking } from '../components/Loading'
import '../styles/normalize.css'
import '../styles/rankingStyles.css'

function SharedRanking() {
  const [rankingData, setRankingData] = useState(null)

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
    <div className='ranking'>
      {rankingData != null
        ? <Ranking rankingData={rankingData}></Ranking>
        : <LoadingRanking></LoadingRanking>}
    </div>
  )
}

export default SharedRanking
