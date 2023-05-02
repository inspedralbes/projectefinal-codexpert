import React, { useEffect, useState } from 'react'
import Ranking from '../components/Ranking'
import ShareRanking from '../components/ShareRanking'
import { LoadingRanking } from '../components/Loading'
import '../styles/normalize.css'
import '../styles/rankingStyles.css'

function RankingPage() {
  const [rankingData, setRankingData] = useState(null)
  const [idGame, setIdGame] = useState(0)

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'ranking-event':
        setRankingData(window.network.getRankingData())
        setIdGame(eventData.idGame)
        // setIdGame(window.)
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
      <div className='ranking'>
        <h1>RANKING</h1>
        {rankingData != null
          ? <Ranking rankingData={rankingData}></Ranking>
          : <LoadingRanking></LoadingRanking>}
      </div>
      {idGame !== 0 && <ShareRanking idGame={idGame}></ShareRanking>}
    </>
  )
}

export default RankingPage
