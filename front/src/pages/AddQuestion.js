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
  const [inputsOutputs, setInputsOutputs] = useState(['', '', ''])
  const cookies = new Cookies()

  const handleAddInputOutput = () => {
    setInputsOutputs([...inputsOutputs, ''])
  }
  const handleRemoveInputOutput = () => {
    setInputsOutputs([...inputsOutputs, ''])
  }

  const handleAddQuestion = () => {
    const data = new FormData()
    data.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )

    if (questionData.title !== '') {
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
    }
  }

  useEffect(() => {
  }, [])

  return (
    <div className='pixel__container'>
      <h1>Add question</h1>

      <div className='grid-inputs__container'>
        <div className='titleCheckbox__container'>
          <div className="row">
            <div className="title__container">
              <label>Title:</label>
            </div>
            <div className="input__container">
              <input type="text" onChange={(e) => { setQuestionData({ ...questionData, title: e.value }) }}></input>
            </div>
          </div>
          <div>

          </div>
          <label className='setPublic__label'>
            <input type='checkbox' onChange={(e) => { setQuestionData({ ...questionData, public: e.value }) }}></input><p>Set your question public to everyone</p>
          </label>
        </div>
        <div className='statement__container'>
          <p>Statement:</p>
          <textarea onChange={(e) => { setQuestionData({ ...questionData, statement: e.value }) }}></textarea>
        </div>
      </div>
      <div className='pixel__container grid__container'>
        <div className='inputOutput__container' id='scroll'>
          <div>
            <h2>INPUTS</h2>
            {inputsOutputs.map((element, index) => { return <input onChange={(e) => { setQuestionData({ ...questionData, inputs: e.value }) }} key={index} type="text"></input> })}
          </div>
          <div className='inputArrows__conainer'>
            {inputsOutputs.map((element, index) => { return <div key={index}> → </div> })}
          </div>
          <div>
            <h2>OUTPUTS</h2>
            {inputsOutputs.map((element, index) => { return <input key={index} type="text"></input> })}
          </div>
          <div className='removeItem__conainer'>
            {inputsOutputs.map((element, index) => { return <button key={index} onClick={() => handleRemoveInputOutput()} disabled={inputsOutputs.length <= 3}>-</button> })}
          </div>
        </div>
        <div>
          <button className='pixel-button' onClick={() => handleAddInputOutput()}>+</button>
        </div>
      </div>
      <br></br>

      <button className='pixel-button' onClick={() => handleAddQuestion()}>Add</button>
    </div>
  )
}

export default AddQuestion
