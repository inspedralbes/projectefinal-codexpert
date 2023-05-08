import '../styles/normalize.css'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

Timer.propTypes = {
  time: PropTypes.number
}

function Timer({ time }) {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    if (time > 0) {
      let cont = time / 1000
      const timer = setInterval(() => {
        setCounter(cont)
        cont--

        if (counter < 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  }, [time])

  return (
    <>
      {time > 0 ? <>{counter}</> : <></>}
    </>
  )
}

export default Timer
