import React, { useEffect, useState } from 'react'
import Ranking from '../components/Ranking'
import ShareRanking from '../components/ShareRanking'
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
          <h1 className='game__yourResult'>{result}</h1>

          <div className='game__rewards'>
            <p className='rewards__list'>
              <a className='rewards__element'>+{rewards.coinsEarned} <img src={require('../img/monea.png')} height='20px' className='user__xp' alt='Experience points' /></a>
              <a className='rewards__element'>{'+' + rewards.xpEarned} <img src={require('../img/Experiencia.png')} height='20px' className='user__xp' alt='Experience points' /></a>
              <a className='rewards__element'>{'+' + rewards.eloEarned} Elo</a>
            </p>
          </div>

          <div className='ranking'>
            <Ranking rankingData={rankingData}></Ranking>
          </div>

          {idGame !== 0 && <ShareRanking idGame={idGame}></ShareRanking>}
        </main>
        : <Loading></Loading>
      }
    </>
  )
}

export default RankingPage
