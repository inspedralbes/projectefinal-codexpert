import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import Ranking from '../components/Ranking'

function RankingPage() {
  const [rankingData, setRankingData] = useState([])

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'ranking-event':
        setRankingData(window.network.getRankingData())
        break

      default:
        break
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <>
      <Ranking rankingData={rankingData}></Ranking>
    </>
  )
}

export default RankingPage
