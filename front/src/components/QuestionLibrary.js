import '../styles/normalize.css'
import '../styles/settings.css'
import React, { useState, useEffect } from 'react'
import Tippy from '@tippyjs/react' // Tooltip
import 'tippy.js/dist/tippy.css' // Tooltip styles
import 'tippy.js/themes/light-border.css' // Tooltip theme
import 'tippy.js/animations/shift-away-extreme.css' // Tooltip animation
import Cookies from 'universal-cookie'
import routes from '../conn_routes'
import PropTypes from 'prop-types'
import informationIcon from '../img/information_icon.gif'

QuestionLibrary.propTypes = {
  nQuestions: PropTypes.number
}

/**
 * Componente de configuraciones de que preguntas quieres en tu partida.
 * @function QuestionLibrary
 */
function QuestionLibrary(nQuestions) {
  const cookies = new Cookies()
  const [questionsData, setQuestionsData] = useState([])
  const [checked, setChecked] = useState([])
  const [nChecked, setNChecked] = useState(0)

  /**
 * Guardar las configuraciones hechas de preguntas.
 * @function handleCheck
 */
  const handleCheck = (event) => {
    let updatedList = [...checked]
    let checkedNumber = nChecked
    if (event.target.checked) {
      updatedList = [...checked, event.target.value]
      checkedNumber += 1
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1)
      checkedNumber -= 1
    }
    if (nQuestions.nQuestions >= checkedNumber) {
      document.getElementById('saveSettings').disabled = false
      document.getElementById('settingsWarning').style.color = 'orangered'
    } else {
      document.getElementById('saveSettings').disabled = true
      document.getElementById('settingsWarning').style.color = 'red'
    }
    setNChecked(checkedNumber)
    setChecked(updatedList)
  }

  /**
 * Recibe las preguntas para que las puede elegir el usuario.
 * @function getQuestionsData
 */
  const getQuestionsData = () => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'getAllQuestions', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestionsData(data)
      })
  }

  useEffect(() => {
    getQuestionsData()
    window.postMessage(
      {
        type: 'set_questions-emit',
        ids: checked
      },
      '*'
    )
  }, [checked])

  return (
    <main className='questionSettings__container' style={{ display: 'none' }} id="questions">
      <div className='list__container default'>
        <h3 className='title'>System questions</h3>
        <div id='scroll' className='list__container_li'>
          {Array.isArray(questionsData.default)
            ? questionsData.default.map((item, index) => (
              <p key={index} className='list__container__text'>
                <input
                  value={item.id}
                  type='checkbox'
                  id={item.id}
                  onChange={handleCheck}
                />
                <label
                  htmlFor={item.id}
                  className='list__container__text__label'
                >
                  <span
                    htmlFor={item.id}
                  >{`${item.title}`}
                    <Tippy
                      theme={'light-border'}
                      content={`Created By: ${item.createdBy}`}
                      placement={'right'}
                      animation={'shift-away-extreme'}
                    >
                      <img src={informationIcon} alt="" height="20px" />
                    </Tippy>
                  </span>
                </label>
              </p>
            ))
            : null}
        </div>
      </div>
      <div className='publicAndMyQuestions__grid'>
        <div className='list__container'>
          <h3>Public</h3>
          <div id='scroll' className='list__container_li'>
            {Array.isArray(questionsData.public) && questionsData.public !== [] && questionsData.public.length > 0
              ? questionsData.public.map((item, index) => (
                <div key={index} className='list__container__text'>
                  <input
                    value={item.id}
                    type='checkbox'
                    id={item.id}

                    onChange={handleCheck}
                  />
                  <label
                    htmlFor={item.id}
                    className='list__container__text__label'
                  >
                    <span htmlFor={item.id} >
                      {`${item.title}`}
                      <i className='icon-info-circle'>
                        <div className='icon-info-circle__content'>
                          Create By: {item.createdBy.name}
                        </div>
                      </i>
                    </span>
                  </label>
                </div>
              ))
              : <p>No questions available!</p>}
          </div>
        </div>

        <div className='list__container private'>
          <h3 className='title'>My questions</h3>
          <div id='scroll' className='list__container_li'>
            {Array.isArray(questionsData.myQuestions) &&
              questionsData.myQuestions !== [] && questionsData.myQuestions.length > 0
              ? questionsData.myQuestions.map((item, index) => (
                <p key={index} className='list__container__text'>
                  <input
                    value={item.id}
                    type='checkbox'
                    id={item.id}

                    onChange={handleCheck}
                  />
                  <label
                    htmlFor={item.id}
                    className='list__container__text__label'
                  >
                    <span htmlFor={item.id} >
                      {`${item.title}`}
                      <Tippy
                        theme={'light-border'}
                        content={`Created By: ${item.createdBy.name}`}
                        placement={'right'}
                        animation={'shift-away-extreme'}
                      >
                        <img src={informationIcon} alt="" height="20px" />
                      </Tippy>
                    </span>
                  </label>
                </p>
              ))
              : <p>No questions available!</p>}
          </div>
        </div>
      </div>
      <p className='warningSettings-text' id="settingsWarning">There must be an equal or lower amount of questions selected from Settings and questions Library!</p>
    </main>
  )
}

export default QuestionLibrary
