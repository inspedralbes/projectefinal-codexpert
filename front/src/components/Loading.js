import React from 'react'
import '../styles/normalize.css'
import '../styles/Loading.css'
import { Blocks } from 'react-loader-spinner'

function Loading() {
  return (
    <div className='Loading__container'>
      <h1>Loading...</h1>
      <Blocks
        visible={true}
        height='130'
        width='130'
        ariaLabel='blocks-loading'
        wrapperStyle={{}}
        wrapperClass='blocks-wrapper'
      />
    </div>
  )
}

function Loader() {
  return (
    <>
      <span className='loader'></span>
    </>
  )
}

export { Loading, Loader }
