import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/normalize.css'
import '../styles/addQuestion.css'
import { Loading } from '../components/Loading'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import arrow from '../img/InputOutputArrow.png'

function AddQuestion() {
  const [questionData, setQuestionData] = useState({
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
  const navigate = useNavigate()

  const handleAddInputOutput = () => {
    if (inputsOutputs.length <= 10) {
      setInputsOutputs([...inputsOutputs, ''])
      setQuestionData({ ...questionData, outputs: [...questionData.inputs, ''], inputs: [...questionData.inputs, ''] })
    }
  }
  const handleRemoveInputOutput = (i) => {
    const array = [...questionData.inputs]
    const arrayInputs = questionData.inputs
    const arrayOutputs = questionData.outputs
    array.splice(i, 1)
    arrayInputs.splice(i, 1)
    arrayOutputs.splice(i, 1)
    document.getElementById('input' + i).value = arrayInputs[arrayInputs.length - 1]
    document.getElementById('output' + i).value = arrayOutputs[arrayOutputs.length - 1]
    setInputsOutputs(array)
    setQuestionData({ ...questionData, outputs: arrayOutputs, inputs: arrayInputs })
  }

  const handleAddQuestion = () => {
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
      .then((data) => {
        setError(data.error)
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
    isUserLogged()
  }, [])

  return (
    <>
    {userLogged
      ? <div className='addQuestionPixel__container'>
        <button className='pixel-button addQuestion-back' onClick={() => localStorage.getItem('lastPage') !== null ? navigate('/' + localStorage.getItem('lastPage')) : navigate('/')}>← Go back</button>
        <h1>Add question</h1>

    <div className='grid-inputs__container'>
      <div className='titleCheckbox__container'>
        <div className="row">
          <div className="title__container">
            <label>Title:</label>
          </div>
          <div className="input__container">
            <input tabIndex="1" placeholder='Uppercase' type="text" onChange={(e) => setQuestionData({ ...questionData, title: e.target.value })}></input>
          </div>
        </div>
        <div>

        </div>
        <label className='setPublic__label'>
          <input tabIndex="3" type='checkbox' onChange={(e) => { setQuestionData({ ...questionData, public: e.target.value }) }}></input><p>Set your question public to everyone</p>
        </label>
      </div>
      <div className='statement__container'>
        <p>Statement:</p>
        <textarea tabIndex="2" placeholder='Set the string input to Uppercase with str.toUpperCase().' onChange={(e) => { setQuestionData({ ...questionData, statement: e.target.value }) }}></textarea>
      </div>
    </div>
    <div className='addQuestionPixel__container grid__container'>
      <div className='inputOutput__container' id='scroll'>
        <div>
          <h2>INPUTS</h2>
          {inputsOutputs.map((element, index) => {
            return <input onChange={(e) => {
              const input = questionData.inputs
              input[index] = e.target.value
              setQuestionData({ ...questionData, inputs: input })
            }} placeholder={placeholder.input[index]} tabIndex={index + index + 3} key={index} id={'input' + index} type="text"></input>
          })}
        </div>
        <div className='inputArrows__conainer'>
          {inputsOutputs.map((element, index) => { return <div key={index}><img src={arrow}></img></div> })}
        </div>
        <div>
          <h2>OUTPUTS</h2>
          {inputsOutputs.map((element, index) => {
            return <input onChange={(e) => {
              const output = questionData.outputs
              output[index] = e.target.value
              setQuestionData({ ...questionData, outputs: output })
            }} tabIndex={index + index + 4} id={'output' + index} placeholder={placeholder.output[index]} key={index} type="text"></input>
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
    <button className='pixel-button' onClick={() => handleAddQuestion()}>Add</button>
  </div>
      : <Loading/>
    }

    </>
  )
}

export default AddQuestion
