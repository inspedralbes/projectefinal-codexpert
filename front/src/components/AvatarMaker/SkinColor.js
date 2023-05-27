import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import arrow from '../../img/AvatarArrow.gif'
import { TwitterPicker } from 'react-color'

SkinColor.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

function SkinColor({
  currentColor,
  handleChangeComplete,
  setChanges,
  ArrayColors,
  changes
}) {
  return (
    <div className="avatar__options--grid">
      <div className="avatar__options" id="scroll">
        <h1 className="noElement">
          This element has no type, but you can still change the color!
        </h1>
        <img className="Avatar__arrow" src={arrow} alt="" height="300px"></img>
      </div>
      <div className="avatar__colorPicker noscroll" >
        <TwitterPicker
          triangle={'hide'}
          color={currentColor}
          colors={ArrayColors}
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, sC: color.hex.replace('#', '') })
          }
        ></TwitterPicker>
      </div>
    </div>
  )
}

export default SkinColor
