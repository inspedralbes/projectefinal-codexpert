import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import { CirclePicker } from 'react-color'

Glasses.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

function Glasses({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {
  return (
    <>
      <div className='avatar__colorPicker'>
        <CirclePicker
          color={currentColor}
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, gC: color.hex.replace('#', '') })
          }
          colors={ArrayColors}
        />
      </div>
      <div className='avatar__options'>

        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, gP: '0' })}>
          <img src={require('../../img/x.png')} alt='No Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'dark01', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/dark01.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'dark02', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/dark02.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'dark03', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/dark03.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'dark04', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/dark04.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'dark05', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/dark05.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'dark06', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/dark06.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'dark07', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/dark07.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'light01', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/light01.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'light02', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/light02.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'light03', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/light03.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'light04', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/light04.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'light05', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/light05.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'light06', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/light06.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, g: 'light07', gP: '100' })}>
          <img src={require('../../img/avatar/glasses/light07.png')} alt='Glasses' width='100px' height='100px'></img>
        </button>
      </div>
    </>
  )
}

export default Glasses
