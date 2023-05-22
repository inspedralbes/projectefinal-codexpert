import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import '../styles/addQuestion.css'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import arrow from '../img/InputOutputArrow.png'

function AddQuestion() {
  const [questionData, setQuestionData] = useState({
    title: '',
    statement: '',
    inputs: [],
    outputs: [],
    public: false
  })
  const [inputsOutputs, setInputsOutputs] = useState(['', '', ''])
  const placeholder = 
  const cookies = new Cookies()

  const handleAddInputOutput = () => {
    if (inputsOutputs.length <= 10) {
      setInputsOutputs([...inputsOutputs, ''])
    }
  }
  const handleRemoveInputOutput = (i) => {
    const array = [...inputsOutputs]
    array.splice(i, 1)
    setInputsOutputs(array)
    console.log(inputsOutputs)
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
    <div className='addQuestionPixel__container'>
      <h1>Add question</h1>

      <div className='grid-inputs__container'>
        <div className='titleCheckbox__container'>
          <div className="row">
            <div className="title__container">
              <label>Title:</label>
            </div>
            <div className="input__container">
              <input tabIndex="1" type="text" onChange={(e) => { setQuestionData({ ...questionData, title: e.value }) }}></input>
            </div>
          </div>
          <div>

          </div>
          <label className='setPublic__label'>
            <input tabIndex="3" type='checkbox' onChange={(e) => { setQuestionData({ ...questionData, public: e.value }) }}></input><p>Set your question public to everyone</p>
          </label>
        </div>
        <div className='statement__container'>
          <p>Statement:</p>
          <textarea tabIndex="2" onChange={(e) => { setQuestionData({ ...questionData, statement: e.value }) }}></textarea>
        </div>
      </div>
      <div className='addQuestionPixel__container grid__container'>
        <div className='inputOutput__container' id='scroll'>
          <div>
            <h2>INPUTS</h2>
            {inputsOutputs.map((element, index) => { return <input onChange={(e) => { setQuestionData({ ...questionData, inputs: e.value }) }} tabIndex={index + index + 3} key={index} type="text"></input> })}
          </div>
          <div className='inputArrows__conainer'>
            {inputsOutputs.map((element, index) => { return <div key={index}><img src={arrow}></img></div> })}
          </div>
          <div>
            <h2>OUTPUTS</h2>
            {inputsOutputs.map((element, index) => { return <input tabIndex={index + +index + 4} key={index} type="text"></input> })}
          </div>
          <div className='removeItem__conainer'>
            {inputsOutputs.map((element, index) => { return <div key={index}><button onClick={() => handleRemoveInputOutput(index)} disabled={inputsOutputs.length <= 3}>delete</button><br></br></div> })}
          </div>
        </div>
        <div>
          <a className='addInputOutput-link' onClick={() => handleAddInputOutput()}>Add new input & output line</a>
        </div>
      </div>
      <br></br>

      <button className='pixel-button' onClick={() => handleAddQuestion()}>Add</button>
    </div>
  )
}

export default AddQuestion
