import React from 'react'
import '../styles/normalize.css'
import '../styles/Loading.css'
import loading from '../img/Loading.gif'
import loader from '../img/loader.gif'
import { Blocks } from 'react-loader-spinner'

/**
 * Funcion para mostrar loading grande de la pagina.
 * @function Loading
 */
function Loading() {
  return (
    <div className="Loading__container animate__animated animate__bounce">
      <img
        src={loading}
        alt=''
        height={'70px'}
      />
      <img
        src={loader}
        alt=''
        height={'70px'}
      />
    </div>
  )
}

/**
 * Funcion para mostrar el loading pequeño de la pagina.
 * @function Loader
 */
function Loader() {
  return (
    <>
      <span className="loader"></span>
    </>
  )
}

/**
 * Funcion para mostrar el loading de Ranking.
 * @function LoadingRanking
 */
function LoadingRanking() {
  return (
    <div className="Loading__container Loading__container-ranking">
      <h1>Loading...</h1>
      <Blocks
        visible={true}
        height="5vw"
        width="5vw"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
      />
    </div>
  )
}

export { Loading, Loader, LoadingRanking }
