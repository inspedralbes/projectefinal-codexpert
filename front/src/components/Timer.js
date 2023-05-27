import '../styles/normalize.css'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

Timer.propTypes = {
  time: PropTypes.number,
  counter: PropTypes.number,
  setCounter: PropTypes.func
}

/**
 * Componente que sirve para mostrar el tiempo restante de la prorroga
 * @function Timer
 */
function Timer({ time, counter, setCounter }) {
  useEffect(() => {
    if (time > 0) {
      let cont

      cont = time / 1000
      console.log(cont)

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
      {time > 0 && counter > 0 ? <>{counter}</> : <></>}
    </>
  )
}

export default Timer
