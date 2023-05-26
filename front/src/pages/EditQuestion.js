import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/normalize.css'
import '../styles/addQuestion.css'
import { Loading } from '../components/Loading'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import arrow from '../img/InputOutputArrow.png'

function EditQuestion() {
  const [newQuestionData, setNewQuestionData] = useState({
    title: '',
    statement: '',
    inputs: ['', '', ''],
    outputs: ['', '', ''],
    public: false
  })
  const [userLogged, setUserLogged] = useState(false)
  const [error, setError] = useState(false)
  const [inputsOutputs, setInputsOutputs] = useState(['', '', ''])
  const placeholder = {
    input: ['Input/Output Example!', 'Hello World!', 'lorem ipsum1234'],
    output: ['INPUT/OUTPUT EXAMPLE!', 'HELLO WORLD!', 'LOREM IPSUM1234']
  }
  const cookies = new Cookies()
  const location = useLocation()
  const navigate = useNavigate()

  const handleAddInputOutput = () => {
    if (inputsOutputs.length <= 10) {
      setInputsOutputs([...inputsOutputs, ''])
      setNewQuestionData({ ...newQuestionData, outputs: [...newQuestionData.inputs, ''], inputs: [...newQuestionData.inputs, ''] })
    }
  }
  const handleRemoveInputOutput = (i) => {
    const array = [...newQuestionData.inputs]
    const arrayInputs = newQuestionData.inputs
    const arrayOutputs = newQuestionData.outputs
    array.splice(i, 1)
    arrayInputs.splice(i, 1)
    arrayOutputs.splice(i, 1)
    document.getElementById('input' + i).value = arrayInputs[arrayInputs.length - 1]
    document.getElementById('output' + i).value = arrayOutputs[arrayOutputs.length - 1]
    setInputsOutputs(array)
    setNewQuestionData({ ...newQuestionData, outputs: arrayOutputs, inputs: arrayInputs })
  }

  const handleEditQuestion = () => {
    const data = new FormData()
    data.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )
    data.append('questionId', location.state.questionId)
    data.append('title', newQuestionData.title)
    data.append('statement', newQuestionData.statement)
    data.append('inputs', JSON.stringify(newQuestionData.inputs))
    data.append('outputs', JSON.stringify(newQuestionData.outputs))
    data.append('public', JSON.stringify(newQuestionData.public))

    fetch(routes.fetchLaravel + 'editMyQuestion', {
      method: 'POST',
      mode: 'cors',
      body: data,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setError(data.error)
      })
  }

  const getLastData = () => {
    const lastData = new FormData()
    lastData.append('token', cookies.get('token'))
    lastData.append('questionId', location.state !== null ? location.state.questionId : navigate('/library'))
    fetch(routes.fetchLaravel + 'getMyQuestionWithId', {
      method: 'POST',
      mode: 'cors',
      body: lastData,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setNewQuestionData({ ...newQuestionData, title: data.title, statement: data.statement, public: data.public === '0', inputs: data.inputs, outputs: data.outputs })
        setInputsOutputs()
      })
  }

  const isUserLogged = () => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'isUserLogged', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.correct) {
          navigate('/login')
        } else {
          setUserLogged(true)
        }
      })
  }

  useEffect(() => {
    getLastData()
    isUserLogged()
  }, [])

  return (
    <>
    {userLogged
      ? <div className='addQuestionPixel__container'>
        <button className='pixel-button addQuestion-back' onClick={() => localStorage.getItem('lastPage') !== null ? navigate('/' + localStorage.getItem('lastPage')) : navigate('/')}>← Go back</button>
        <h1>Edit question</h1>

    <div className='grid-inputs__container'>
      <div className='titleCheckbox__container'>
        <div className="row">
          <div className="title__container">
            <label>Title:</label>
          </div>
          <div className="input__container">
            <input tabIndex="1" placeholder='Uppercase' type="text" value={newQuestionData.title} onChange={(e) => setNewQuestionData({ ...newQuestionData, title: e.target.value })}></input>
          </div>
        </div>
        <div>

        </div>
        <label className='setPublic__label'>
          <input tabIndex="3" type='checkbox' value={newQuestionData.public} onChange={(e) => { setNewQuestionData({ ...newQuestionData, public: e.target.value }) }}></input><p>Set your question public to everyone</p>
        </label>
      </div>
      <div className='statement__container'>
        <p>Statement:</p>
        <textarea tabIndex="2" placeholder='Set the string input to Uppercase with str.toUpperCase().' value={newQuestionData.statement} onChange={(e) => { setNewQuestionData({ ...newQuestionData, statement: e.target.value }) }}></textarea>
      </div>
    </div>
    <div className='addQuestionPixel__container grid__container'>
      <div className='inputOutput__container' id='scroll'>
        <div>
          <h2>INPUTS</h2>
          {inputsOutputs.map((element, index) => {
            return <input onChange={(e) => {
              const input = newQuestionData.inputs
              input[index] = e.target.value
              setNewQuestionData({ ...newQuestionData, inputs: input })
            }} placeholder={placeholder.input[index]} tabIndex={index + index + 3} value={newQuestionData.inputs[index]} key={index} id={'input' + index} type="text"></input>
          })}
        </div>
        <div className='inputArrows__conainer'>
          {inputsOutputs.map((element, index) => { return <div key={index}><img src={arrow}></img></div> })}
        </div>
        <div>
          <h2>OUTPUTS</h2>
          {inputsOutputs.map((element, index) => {
            return <input onChange={(e) => {
              const output = newQuestionData.outputs
              output[index] = e.target.value
              setNewQuestionData({ ...newQuestionData, outputs: output })
            }} tabIndex={index + index + 4} id={'output' + index} value={newQuestionData.outputs[index]} placeholder={placeholder.output[index]} key={index} type="text"></input>
          })}
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
    <p className='addQuestionError'>{error}</p>
    <button className='pixel-button' onClick={() => handleEditQuestion()}>Save</button>
  </div>
      : <Loading/>
    }

    </>
  )
}

export default EditQuestion
