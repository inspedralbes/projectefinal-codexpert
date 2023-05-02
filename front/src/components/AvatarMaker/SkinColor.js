import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import { TwitterPicker } from 'react-color'

SkinColor.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

function SkinColor({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {
  return (
    <div className='avatar__options--grid'>
      <div className='avatar__options' id="scroll">
        <h1>This element has no type.</h1>
      </div>
      <div className='avatar__colorPicker'>
        <TwitterPicker
          triangle={
            'hide'
          }
          color={currentColor}
          colors={ArrayColors}
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, cC: color.hex.replace('#', '') })
          }>
        </TwitterPicker>
      </div>
    </div>
  )
}

export default SkinColor