import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    eloEarned: 0,
    resultMessage: ''
  })
  const [dataLoaded, setDataLoaded] = useState(false)
  const navigate = useNavigate()

  const handleMessage = (event) => {
    const eventData = event.data

    switch (eventData.type) {
      case 'ranking-event':
        setRankingData(window.network.getRankingData())
        setIdGame(eventData.idGame)
        setRewards(window.network.getRewards())
        setDataLoaded(true)
        break

      default:
        break
    }
  }

  function goBackToLobby() {
    navigate('/lobbies')
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <>
      <button id='goBackToLobby__button' onClick={goBackToLobby}>
        <span className='circle' aria-hidden='true'>
          <span className='icon arrow'></span>
        </span>
        <span className='button-text'>GO BACK TO LOBBY
        </span>
      </button>
      {dataLoaded
        ? <main>
          <div className='game__yourResults yourResults'>
            <h1 className='yourResults__result'>{rewards.resultMessage}</h1>
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
