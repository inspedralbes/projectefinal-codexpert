import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import '../styles/addQuestion.css'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'

function AddQuestion() {
  const [questionData, setQuestionData] = useState({
    title: '',
    statement: '',
    inputs: [],
    outputs: [],
    public: false
  })
  const cookies = new Cookies()

  useEffect(() => {
    setQuestionData()
    const data = new FormData()
    data.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )

    data.append('title', questionData.title)
    data.append('statement', questionData.statement)
    data.append('inputs', JSON.stringify(questionData.inputs))
    data.append('outputs', JSON.stringify(questionData.outputs))
    data.append('public', JSON.stringify(questionData.public))
    fetch(routes.fetchLaravel + 'addNewQuestion', {
      method: 'POST',
      mode: 'cors',
      body: data,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then(() => {

      })
  }, [])

  return (
    <div className='pixel__container'>
      <h1>Add question</h1>

      <div className='grid-inputs__container'>
        <div className='titleHint__container'>
          <div className="row">
            <div className="title__container">
              <label>Title:</label>
            </div>
            <div className="input__container">
              <input type="text"></input>
            </div>
          </div>
          <div>

          </div>
          <label className='setPublic__label'>
            <input type='checkbox'></input> Set your question public to everyone
          </label>
        </div>
        <div className='statement__container'>
          Statement:
          <textarea></textarea>
        </div>
      </div>
      <div className='pixel__container inputOutput__container'>
        <div>
          <h2>INPUTS</h2>
          <input type="text"></input>
          <input type="text"></input>
          <input type="text"></input>
        </div>
        <div className='inputArrows__conainer'>
          →<br></br>→<br></br>→
        </div>
        <div>
          <h2>OUTPUTS</h2>
          <input type="text"></input>
          <input type="text"></input>
          <input type="text"></input>
        </div>
        <div>
          <button>+</button>
        </div>
      </div>
      <br></br>

      <button>Add</button>
    </div>
  )
}

export default AddQuestion
