import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../styles/index.css'

Settings.propTypes = {
  fetchSettings: PropTypes.bool,
  errorMessage: PropTypes.string
}

function Settings({ fetchSettings, errorMessage }) {
  const [overtimeDuration, setOvertimeDuration] = useState(30)
  const [heartAmount, setHeartAmount] = useState(0)
  const [questionAmount, setQuestionAmount] = useState(0)
  const [unlimitedHearts, setUnlimitedHearts] = useState(false)
  const [willHaveOvertime, setWillHaveOvertime] = useState(false)

  function handleChangeUnlimitedHearts() {
    setUnlimitedHearts(!unlimitedHearts)
    window.network.setUnlimitedHearts(!unlimitedHearts)
  }

  function handleChangeWillHaveOvertime() {
    setWillHaveOvertime(!willHaveOvertime)
    window.network.setWillHaveOvertime(!willHaveOvertime)
  }

  function handleChangeOvertimeDuration(e) {
    setOvertimeDuration(e.target.value)
    window.network.setOvertimeDuration(e.target.value)
  }

  function handleChangeHeartAmount(e) {
    setHeartAmount(e.target.value)
    window.network.setHeartAmount(e.target.value)
  }

  function handleChangeQuestionAmount(e) {
    setQuestionAmount(e.target.value)
    window.network.setQuestionAmount(e.target.value)
    console.log(window.network.getQuestionAmount())
  }

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

  return (
    <>
      <div className='settings__zone'>
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
    </>

  )
}

export default Settings
