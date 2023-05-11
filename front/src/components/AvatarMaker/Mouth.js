import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import { TwitterPicker } from 'react-color'

Mouth.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

function Mouth({
  currentColor,
  handleChangeComplete,
  setChanges,
  ArrayColors,
  changes
}) {
  return (
    <div className="avatar__options--grid">
      <div className="avatar__options" id="scroll">
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy01' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy01.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy02' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy02.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy03' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy03.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy04' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy04.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy05' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy05.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy06' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy06.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy07' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy07.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy08' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy08.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy09' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy09.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy10' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy10.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy11' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy11.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy12' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy12.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'happy13' })}
        >
          <img
            src={require('../../img/avatar/mouth/happy13.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad01' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad01.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad02' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad02.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad03' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad03.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad04' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad04.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad05' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad05.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad06' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad06.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad07' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad07.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad08' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad08.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad09' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad09.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
        <button
          className="avatar__optionsButton"
          onClick={() => setChanges({ ...changes, m: 'sad10' })}
        >
          <img
            src={require('../../img/avatar/mouth/sad10.png')}
            alt="Mouth"
            width="100px"
            height="100px"
          ></img>
        </button>
      </div>
      <div className="avatar__colorPicker">
        <TwitterPicker
          color={currentColor}
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, mC: color.hex.replace('#', '') })
          }
          colors={ArrayColors}
        />
      </div>
    </div>
  )
}

export default Mouth
