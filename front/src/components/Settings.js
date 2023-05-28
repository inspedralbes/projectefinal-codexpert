import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import QuestionLibrary from './QuestionLibrary'
import '../styles/index.css'
import '../styles/settings.css'

Settings.propTypes = {
  fetchSettings: PropTypes.bool,
  errorMessage: PropTypes.string,
  saveSettings: PropTypes.number
}

/**
 * Componente de configuraciones de una partida.
 * @function Settings
 */
function Settings({ fetchSettings, errorMessage, saveSettings }) {
  const [overtimeDuration, setOvertimeDuration] = useState(30)
  const [heartAmount, setHeartAmount] = useState(0)
  const [questionAmount, setQuestionAmount] = useState(0)
  const [unlimitedHearts, setUnlimitedHearts] = useState(false)
  const [willHaveOvertime, setWillHaveOvertime] = useState(false)

  /**
 * Al clicar pones la opcion de vidas ilimitadas en true o viceversa.
 * @function handleChangeUnlimitedHearts
 */
  function handleChangeUnlimitedHearts() {
    setUnlimitedHearts(!unlimitedHearts)
  }

  /**
 * Al clicar cambia la opcion de si hay prorroga o no.
 * @function handleChangeWillHaveOvertime
 */
  function handleChangeWillHaveOvertime() {
    setWillHaveOvertime(!willHaveOvertime)
  }

  /**
 * Al clicar cambia el tiempo que se haya puesto de prorroga.
 * @function handleChangeOvertimeDuration
 */
  function handleChangeOvertimeDuration(e) {
    setOvertimeDuration(e.target.value)
  }

  /**
 * Al clicar cambia el número de vidas que se le haya establecido en el input de texto.
 * @function handleChangeHeartAmount
 */
  function handleChangeHeartAmount(e) {
    setHeartAmount(e.target.value)
  }

  /**
 * Al clicar cambia el número de preguntas que se le haya indicado en el input de texto.
 * @function handleChangeQuestionAmount
 */
  function handleChangeQuestionAmount(e) {
    setQuestionAmount(e.target.value)
  }

  /**
 * Recibe las configuraciones de la sala que estan guardadas en socket.
 * @function getSettings
 */
  const getSettings = () => {
    setHeartAmount(window.network.getHeartAmount())
    setOvertimeDuration(window.network.getOvertimeDuration())
    setUnlimitedHearts(window.network.getUnlimitedHearts())
    setQuestionAmount(window.network.getQuestionAmount())
    setWillHaveOvertime(window.network.getWillHaveOvertime())
  }

  useEffect(() => {
    if (fetchSettings) {
      getSettings()
    }
  }, [fetchSettings])

  useEffect(() => {
    if (saveSettings > 0) {
      window.network.setUnlimitedHearts(unlimitedHearts)
      window.network.setWillHaveOvertime(willHaveOvertime)
      window.network.setOvertimeDuration(overtimeDuration)
      window.network.setHeartAmount(heartAmount)
      window.network.setQuestionAmount(questionAmount)
    }
  }, [saveSettings])

  return (
    <div className='settings__container'>
      <div className='settingsMenu-button__container'>
        <button className='pixel-button' id="settingsButton" onClick={() => {
          document.getElementById('settings').style.display = 'block'
          document.getElementById('settingsButton').disabled = true
          document.getElementById('questionsButton').disabled = false
          document.getElementById('questions').style.display = 'none'
        }}>Game Settings</button>
        <button className='pixel-button settingsQuestion-button' id="questionsButton" onClick={() => {
          document.getElementById('questions').style.display = 'block'
          document.getElementById('questionsButton').disabled = true
          document.getElementById('settingsButton').disabled = false
          document.getElementById('settings').style.display = 'none'
        }}>Questions Settings</button>
      </div>
        <div className='settings__zone' id="settings">
          {errorMessage !== '' && <h2 className='lobbies__error'>{errorMessage}</h2>}
          <form className='AddCategory' autoComplete='off'>
            <div className='list__container__text settingCreator__checkbox'>
              <label htmlFor='check' className="form-control">
                <input id='check' type="checkbox" name="checkbox" value={willHaveOvertime}
                  onChange={handleChangeWillHaveOvertime}
                  checked={willHaveOvertime} />
                <span
                  htmlFor='overtime-check'
                  className='settings__zone__title'
                >You want to have an overtime?</span>
              </label>

            </div>

            <span className='addCategory__formSpanTA'>
              <p className='settings__zone__title'>Overtime duration (seconds)</p>
              <input className='profile__input' type='number' value={overtimeDuration} onChange={handleChangeOvertimeDuration} disabled={!willHaveOvertime} />
            </span>

            <span className='addCategory__formSpanTA'>
              <p className='settings__zone__title'>Amount of questions:</p>
              <input className='profile__input' type='number' value={questionAmount} onChange={handleChangeQuestionAmount} />
            </span>

            <span className='addCategory__formSpanTA'>
              <p className='settings__zone__title'>Amount of hearts per player:</p>
              <input className='profile__input' type='number' value={heartAmount} onChange={handleChangeHeartAmount} />
            </span>

            <div className='list__container__text settingCreator__checkbox'>
              <label htmlFor="unl_hearts-check" className="form-control">
                <input id='unl_hearts-check'
                  className='check'
                  type='checkbox'
                  value={unlimitedHearts}
                  onChange={handleChangeUnlimitedHearts}
                  checked={unlimitedHearts} />
                <span
                  htmlFor='unl_hearts-check'
                  className='settings__zone__title'
                >Unlimited hearts</span>
              </label>
            </div>
          </form>
        </div>
        <QuestionLibrary></QuestionLibrary>
    </div>
  )
}

export default Settings
