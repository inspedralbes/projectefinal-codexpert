import React, { useEffect, useState } from 'react'
import RankingPodium from '../components/RankingPodium'
import RankingTable from '../components/RankingTable'
import ShareRanking from '../components/ShareRanking'
import Rewards from '../components/Rewards'
import { Loading } from '../components/Loading'
import '../styles/normalize.css'
import '../styles/rankingStyles.css'

function RankingPage() {
  const [rankingData, setRankingData] = useState(null)
  const [idGame, setIdGame] = useState(0)
  const [rewards, setRewards] = useState({
    xpEarned: 0,
    coinsEarned: 0,
    eloEarned: 0
  })
  const [result, setResult] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'ranking-event':
        setRankingData(window.network.getRankingData())
        setIdGame(eventData.idGame)
        setRewards(window.network.getRewards())
        setResult(window.network.getResult())
        setDataLoaded(true)
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
      {dataLoaded
        ? <main>
          <div className='game__yourResults yourResults'>
            <h1 className='yourResults__result'>{result}</h1>
          </div>

          <div className='ranking'>
            <div className='ranking__content' id='scroll'>
              <RankingPodium rankingData={rankingData}></RankingPodium>

              <div className='ranking__rewards'>
                <Rewards rewards={rewards}></Rewards>
              </div>

              {rankingData.length > 3 && <RankingTable rankingData={rankingData}></RankingTable>}
            </div>
          </div>

          {idGame !== 0 && <ShareRanking idGame={idGame}></ShareRanking>}
        </main>
        : <Loading></Loading>
      }
    </>
  )
}

export default RankingPage
