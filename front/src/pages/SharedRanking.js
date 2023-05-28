import React, { useEffect, useState } from 'react'
import routes from '../conn_routes'
import RankingPodium from '../components/RankingPodium'
import RankingTable from '../components/RankingTable'
import Header from '../components/Header'
import { LoadingRanking } from '../components/Loading'
import '../styles/normalize.css'
import '../styles/rankingStyles.css'

/**
 * Pagina para mostrar el ranking que el usuario puede compartir al finalizar una partida
 * @function SharedRanking
 */
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
    <>
    <Header></Header>
    <div className='ranking sharedRanking'>
      {rankingData != null
        ? <div className='ranking__content sharedRanking__content' id='scroll'>
          <RankingPodium rankingData={rankingData}></RankingPodium>

          {rankingData.length > 3 && <RankingTable rankingData={rankingData}></RankingTable>}
        </div>
        : <LoadingRanking></LoadingRanking>}
    </div>
    </>
  )
}

export default SharedRanking
