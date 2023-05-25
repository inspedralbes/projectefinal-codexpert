import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import { TwitterPicker } from 'react-color' // Importamos el 'TwitterPicker' de react-color, es un input de colores

function Accessories({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {
  return (
    <div className='avatar__options--grid'>

      <div className='avatar__options' id="scroll">

        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, aP: '0' })}>
          <img src={require('../../img/x.png')} alt='No Accessories' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, a: 'variant01', aP: '100' })} >
          <img src={require('../../img/avatar/accessories/variant01.png')} alt='Accessories' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, a: 'variant02', aP: '100' })}>
          <img src={require('../../img/avatar/accessories/variant02.png')} alt='Accessories' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, a: 'variant03', aP: '100' })}>
          <img src={require('../../img/avatar/accessories/variant03.png')} alt='Accessories' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, a: 'variant04', aP: '100' })}>
          <img src={require('../../img/avatar/accessories/variant04.png')} alt='Accessories' width='100px' height='100px'></img>
        </button>
      </div>
      <div className='avatar__colorPicker' id='scroll'>
        <TwitterPicker // Llamamos al color picker y le pasamos los parametros que creamos necesarios
          color={currentColor} // Guardamos el color escogido
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, aC: color.hex.replace('#', '') })// Apliccamos el color a aC que es el accesories Color
          }
          colors={ArrayColors}
        />
      </div>
    </div>
  )
}

Accessories.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

export default Accessories
