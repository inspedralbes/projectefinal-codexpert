import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import { SliderPicker } from 'react-color'

Hair.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

function Hair({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {
  return (
    <>
      <div className='avatar__colorPicker'>

        <SliderPicker
          color={currentColor}
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, hC: color.hex.replace('#', '') })
          }
          colors={ArrayColors}
        />
      </div>
      <div className='avatar__options'>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long01' })}>
          <img src={require('../../img/avatar/hair/long01.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long02' })}>
          <img src={require('../../img/avatar/hair/long02.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long03' })}>
          <img src={require('../../img/avatar/hair/long03.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long04' })}>
          <img src={require('../../img/avatar/hair/long04.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long05' })}>
          <img src={require('../../img/avatar/hair/long05.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long06' })}>
          <img src={require('../../img/avatar/hair/long06.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long07' })}>
          <img src={require('../../img/avatar/hair/long07.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long08' })}>
          <img src={require('../../img/avatar/hair/long08.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long09' })}>
          <img src={require('../../img/avatar/hair/long09.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long10' })}>
          <img src={require('../../img/avatar/hair/long10.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long11' })}>
          <img src={require('../../img/avatar/hair/long11.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long12' })}>
          <img src={require('../../img/avatar/hair/long12.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long13' })}>
          <img src={require('../../img/avatar/hair/long13.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long14' })}>
          <img src={require('../../img/avatar/hair/long14.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long15' })}>
          <img src={require('../../img/avatar/hair/long15.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long16' })}>
          <img src={require('../../img/avatar/hair/long16.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long17' })}>
          <img src={require('../../img/avatar/hair/long17.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long18' })}>
          <img src={require('../../img/avatar/hair/long18.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long19' })}>
          <img src={require('../../img/avatar/hair/long19.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long20' })}>
          <img src={require('../../img/avatar/hair/long20.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'long21' })}>
          <img src={require('../../img/avatar/hair/long21.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short01' })}>
          <img src={require('../../img/avatar/hair/short01.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short02' })}>
          <img src={require('../../img/avatar/hair/short02.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short03' })}>
          <img src={require('../../img/avatar/hair/short03.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short04' })}>
          <img src={require('../../img/avatar/hair/short04.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short05' })}>
          <img src={require('../../img/avatar/hair/short05.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short06' })}>
          <img src={require('../../img/avatar/hair/short06.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short07' })}>
          <img src={require('../../img/avatar/hair/short07.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short08' })}>
          <img src={require('../../img/avatar/hair/short08.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short09' })}>
          <img src={require('../../img/avatar/hair/short09.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short10' })}>
          <img src={require('../../img/avatar/hair/short10.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short11' })}>
          <img src={require('../../img/avatar/hair/short11.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short12' })}>
          <img src={require('../../img/avatar/hair/short12.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short13' })}>
          <img src={require('../../img/avatar/hair/short13.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short14' })}>
          <img src={require('../../img/avatar/hair/short14.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short15' })}>
          <img src={require('../../img/avatar/hair/short15.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short16' })}>
          <img src={require('../../img/avatar/hair/short16.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short17' })}>
          <img src={require('../../img/avatar/hair/short17.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short18' })}>
          <img src={require('../../img/avatar/hair/short18.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short19' })}>
          <img src={require('../../img/avatar/hair/short19.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short20' })}>
          <img src={require('../../img/avatar/hair/short20.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short21' })}>
          <img src={require('../../img/avatar/hair/short21.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short22' })}>
          <img src={require('../../img/avatar/hair/short22.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short23' })}>
          <img src={require('../../img/avatar/hair/short23.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, h: 'short24' })}>
          <img src={require('../../img/avatar/hair/short24.png')} alt='Hair' width='100px' height='100px'></img>
        </button>
      </div>
    </>
  )
}

export default Hair
