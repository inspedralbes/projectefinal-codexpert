import React from 'react'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import { SliderPicker } from 'react-color'
import ShadeSlider from '@uiw/react-color-shade-slider';


SkinColor.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

function SkinColor({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });
  
  return (
    <>
      <div className='avatar__colorPicker'>
        <SliderPicker
          color={currentColor}
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, sC: color.hex.replace('#', '') })
          }
          colors={ArrayColors}
        />
        <ShadeSlider
           hsva={hsva}
           onChange={(newShade) => {
             setHsva({ ...hsva, ...newShade });
           }}
        />
      </div>
      <div className='avatar__options'><h1>This element has no type uwu</h1></div>
    </>
  )
}

export default SkinColor
