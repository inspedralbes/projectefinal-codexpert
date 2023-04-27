import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import { SliderPicker } from 'react-color'
import ShadeSlider from '@uiw/react-color-shade-slider';
import { hsvaToHex } from '@uiw/color-convert'


Cloth.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

function Cloth({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {

  return (
    <>
      <div className='avatar__colorPicker'>
        <SliderPicker
          color={currentColor}
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, cC: color.hex.replace('#', '') })
          }
        />
        <br />
        <ShadeSlider
          hsva={{ h: 0, s: 0, v: 100, a: 1 }}
          onChange={(hsva) => {
            hsva = hsvaToHex(hsva)
            console.log(hsva);
            setChanges({ ...changes, cC: hsva.replace('#', '') });
          }}
        />
      </div>
      <div className='avatar__options'>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant01' })}>
          <img src={require('../../img/avatar/cloth/variant01.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant02' })}>
          <img src={require('../../img/avatar/cloth/variant02.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant03' })}>
          <img src={require('../../img/avatar/cloth/variant03.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant04' })}>
          <img src={require('../../img/avatar/cloth/variant04.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant05' })}>
          <img src={require('../../img/avatar/cloth/variant05.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant06' })}>
          <img src={require('../../img/avatar/cloth/variant06.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant07' })}>
          <img src={require('../../img/avatar/cloth/variant07.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant08' })}>
          <img src={require('../../img/avatar/cloth/variant08.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant09' })}>
          <img src={require('../../img/avatar/cloth/variant09.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant10' })}>
          <img src={require('../../img/avatar/cloth/variant10.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant11' })}>
          <img src={require('../../img/avatar/cloth/variant11.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant12' })}>
          <img src={require('../../img/avatar/cloth/variant12.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant13' })}>
          <img src={require('../../img/avatar/cloth/variant13.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant14' })}>
          <img src={require('../../img/avatar/cloth/variant14.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant15' })}>
          <img src={require('../../img/avatar/cloth/variant15.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant16' })}>
          <img src={require('../../img/avatar/cloth/variant16.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant17' })}>
          <img src={require('../../img/avatar/cloth/variant17.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant18' })}>
          <img src={require('../../img/avatar/cloth/variant18.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant19' })}>
          <img src={require('../../img/avatar/cloth/variant19.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant20' })}>
          <img src={require('../../img/avatar/cloth/variant20.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant21' })}>
          <img src={require('../../img/avatar/cloth/variant21.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant22' })}>
          <img src={require('../../img/avatar/cloth/variant22.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
        <button className='avatar__optionsButton' onClick={() => setChanges({ ...changes, c: 'variant23' })}>
          <img src={require('../../img/avatar/cloth/variant23.png')} alt='Cloth' width='100px' height='100px'></img>
        </button>
      </div>
    </>
  )
}

export default Cloth
