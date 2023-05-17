import React from 'react'
import '../styles/normalize.css'
import '../styles/Loading.css'
import loading from '../img/Loading.gif'
import loader from '../img/loader.gif'
import { Blocks } from 'react-loader-spinner'

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

function Loader() {
  return (
    <>
      <span className="loader"></span>
    </>
  )
}

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
