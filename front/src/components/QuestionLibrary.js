import '../styles/normalize.css'
import '../styles/Lobbies.css'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

QuestionLibrary.propTypes = {
  questionsData: PropTypes.array
}

function QuestionLibrary({ questionsData }) {
  const [checked, setChecked] = useState([])

  const handleCheck = (event) => {
    let updatedList = [...checked]
    if (event.target.checked) {
      updatedList = [...checked, event.target.value]
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1)
    }
    setChecked(updatedList)
  }

  useEffect(() => {
    window.postMessage(
      {
        type: 'set_questions-emit',
        ids: checked
      },
      '*'
    )
  }, [checked])

  return (
    <div className='checkList'>
      <div className='list__container default'>
        <h3 className='title'>Default</h3>
        <div id='list__container_li'>
          {Array.isArray(questionsData.default)
            ? questionsData.default.map((item, index) => (
              <div key={index} className='list__container__text'>
                <input
                  value={item.questionId}
                  type='checkbox'
                  id={item.questionId}
                  className='check'
                  onChange={handleCheck}
                />
                <label
                  htmlFor={item.questionId}
                  className='list__container__text__label'
                >
                  <span
                    htmlFor={item.questionId}
                  >{`${item.title}`}</span>
                </label>
              </div>
            ))
            : null}
        </div>
      </div>
      <div className='list__container public'>
        <h3 className='title'>Public</h3>
        <div id='list__container_li'>
          {Array.isArray(questionsData.public) && questionsData.public !== []
            ? questionsData.public.map((item, index) => (
              <div key={index} className='list__container__text'>
                <input
                  value={item.questionId}
                  type='checkbox'
                  id={item.questionId}
                  className='check'
                  onChange={handleCheck}
                />
                <label
                  htmlFor={item.questionId}
                  className='list__container__text__label'
                >
                  <span htmlFor={item.questionId} >
                    {`${item.title}`}
                    <i className='icon-info-circle'>
                      <div className='icon-info-circle__content'>
                        Create By: {item.createdBy.name}
                        <br />
                        Nº Words: {item.numberOfWords}
                        <br />
                        Words:{' '}
                        {
                          Array.isArray(item.words)
                            ? (item.words.map((word, index) => (<li key={index}>{word.name}</li>)))
                            : (<></>)}
                      </div>
                    </i>
                  </span>
                </label>
              </div>
            ))
            : null}
        </div>
      </div>

      <div className='list__container private'>
        <h3 className='title'>My categories</h3>
        {Array.isArray(questionsData.myCategories) &&
          questionsData.myCategories !== []
          ? questionsData.myCategories.map((item, index) => (
            <div key={index} className='list__container__text'>
              <input
                value={item.questionId}
                type='checkbox'
                id={item.questionId}
                className='check'
                onChange={handleCheck}
              />
              <label
                htmlFor={item.questionId}
                className='list__container__text__label'
              >
                <svg width='300' height='50' viewBox='0 0 500 100'>
                  <rect
                    x='0'
                    y='15'
                    width='50'
                    height='50'
                    stroke='black'
                    fill='none'
                    className='list__container__checkbox'
                  />
                  <g transform='translate(-10,-962.36218)'>
                    <path
                      d='m 13,983 c 33,6 40,26 55,48 '
                      stroke='black'
                      strokeWidth='3'
                      className='path1'
                      fill='none'
                    />
                    <path
                      d='M 75,970 C 51,981 34,1014 25,1031 '
                      stroke='black'
                      strokeWidth='3'
                      className='path1'
                      fill='none'
                    />
                  </g>
                </svg>
                <span
                  htmlFor={item.questionId}
                >{`${item.title}`}</span>
              </label>
            </div>
          ))
          : null}
      </div>
    </div>
  )
}

export default QuestionLibrary
