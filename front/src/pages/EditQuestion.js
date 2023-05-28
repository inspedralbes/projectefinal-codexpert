import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/normalize.css'
import '../styles/addQuestion.css'
import { Loading } from '../components/Loading'
import Header from '../components/Header'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import arrow from '../img/InputOutputArrow.png'
import Modal from 'react-modal'
import informationIcon from '../img/information_icon.gif'

/**
 * Pagina para editar las preguntas de la biblioteca de preguntas del usuario.
 * @function EditQuestion
 */
function EditQuestion() {
  const [newQuestionData, setNewQuestionData] = useState({
    title: '',
    statement: '',
    inputs: ['', '', ''],
    outputs: ['', '', ''],
    public: false
  })
  const [exampleModal, setExampleModal] = useState(false)
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

  /**
 * Al clicar añade el número de inputs y outputs a poder poner como tests.
 * @function handleAddInputOutput
 */
  const handleAddInputOutput = () => {
    if (inputsOutputs.length <= 10) {
      setInputsOutputs([...inputsOutputs, ''])
      setNewQuestionData({ ...newQuestionData, outputs: [...newQuestionData.inputs, ''], inputs: [...newQuestionData.inputs, ''] })
    }
  }

  /**
 * Al clicar disminuye la cantidad de inputs y outputs a poder poner como tests.
 * @function handleRemoveInputOutput
 */
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

  /**
 * Al clicar comprueva si puede editar la pregunta a la base de datos y en caso afirmativo la edita.
 * @function handleEditQuestion
 */
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
        if (data.error) {
          setError(data.error !== undefined)
        } else {
          navigate('/library')
        }
      })
  }

  /**
 * Funcion que recibe los datos de la pregunta a editar
 * @function getLastData
 */
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
        setNewQuestionData({ ...newQuestionData, title: data.title, statement: data.statement, public: data.public === '0', inputs: data.inputs, outputs: data.outputs })
        setInputsOutputs(newQuestionData.inputs)
      })
  }

  /**
 * Funcion que comprueva si el usuario esta registrado para poder acceder a esta pagina.
 * @function isUserLogged
 */
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
    <Header></Header>
    {userLogged
      ? <div className='addQuestionPixel'>
        <button className='pixel-button addQuestion-back' onClick={() => localStorage.getItem('lastPage') !== null ? navigate('/' + localStorage.getItem('lastPage')) : navigate('/')}>← Go back</button>
        <h1>Edit question</h1>

    <div className='addQuestionPixel__container'>
      <div className='addQuestionPixel__titleCheckbox'>
        <div className="row">
          <div className="addQuestionPixel__title">
            <label>Title:</label>
          </div>
          <div className="addQuestionPixel__input">
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
        <textarea id='scroll' tabIndex="2" placeholder='Set the string input to Uppercase with str.toUpperCase().' value={newQuestionData.statement} onChange={(e) => { setNewQuestionData({ ...newQuestionData, statement: e.target.value }) }}></textarea>
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
              for (let i = 0; i < input.length; i++) {
                if (input[i].includes('[') && input[i].includes(']')) { // Comprueba si es un array
                  input[i] = input[i].replace('[', '')
                  input[i] = input[i].replace(']', '')
                  input[i] = input[i].split(',')
                  for (let j = 0; j < input[i].length; j++) { // Mira dentro del array si es string o no.
                    if (/^-?\d+$/.test(input[i][j])) { // /^-?\d+$/.test Comprueba si és un valor numerico.
                      input[i][j] = parseInt(input[i][j])
                    }
                  }
                }
                if (/^-?\d+$/.test(input[i])) { // /^-?\d+$/.test Comprueba si és un valor numerico.
                  input[i] = parseInt(input[i])
                }
              }
              setNewQuestionData({ ...newQuestionData, inputs: input })
            }} placeholder={placeholder.input[index]} tabIndex={index + index + 3} value={newQuestionData.inputs[index]} key={index} id={'input' + index} type="text"></input>
          })}
        </div>
        <div className='inputArrows__container'>
          {inputsOutputs.map((element, index) => { return <div key={index}><img src={arrow}></img></div> })}
        </div>
        <div>
          <h2>OUTPUTS</h2>
          {inputsOutputs.map((element, index) => {
            return <input onChange={(e) => {
              const output = newQuestionData.outputs
              output[index] = e.target.value
              for (let i = 0; i < output.length; i++) {
                if (output[i].includes('[') && output[i].includes(']')) { // Comprueba si es un array
                  output[i] = output[i].replace('[', '')
                  output[i] = output[i].replace(']', '')
                  output[i] = output[i].split(',')
                  for (let j = 0; j < output[i].length; j++) { // Mira dentro del array si es string o no.
                    if (/^-?\d+$/.test(output[i][j])) { // /^-?\d+$/.test Comprueba si és un valor numerico.
                      output[i][j] = parseInt(output[i][j])
                    }
                  }
                }
                if (/^-?\d+$/.test(output[i])) { // /^-?\d+$/.test Comprueba si és un valor numerico.
                  output[i] = parseInt(output[i])
                }
              }
              setNewQuestionData({ ...newQuestionData, outputs: output })
            }} tabIndex={index + index + 4} id={'output' + index} value={newQuestionData.outputs[index]} placeholder={placeholder.output[index]} key={index} type="text"></input>
          })}
        </div>
        <div className='removeItem__conainer'>
        <p onClick={() => setExampleModal(true)}>example <img width='20px' src={informationIcon}></img></p>
                <Modal // Example modal
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 2
                },
                content: {
                  padding: 0,
                  height: '85%',
                  width: '60%',
                  backgroundColor: '#fff'
                }
              }}
              onRequestClose={() => setExampleModal(false)}
              shouldCloseOnOverlayClick={true}
              isOpen={exampleModal}
            >
              <div>
                <h1>ADD QUESTION EXAMPLES</h1>
                <h3>Numbers:</h3>
                <div className='inputOutputExample__container' id='scroll'>
                  <div>
                    <h2>INPUT</h2>
                    <input value="53" readOnly></input>
                  </div>
                  <div className='inputArrows__container'>
                    <img src={arrow}></img>
                  </div>
                  <div>
                    <h2>OUTPUT</h2>
                    <input value="42" readOnly></input>
                  </div>
                </div>
                <h3>Strings:</h3>
                <div className='inputOutputExample__container' id='scroll'>
                  <div>
                    <h2>INPUT</h2>
                    <input value='"Text example input"' readOnly></input>
                  </div>
                  <div className='inputArrows__container'>
                    <img src={arrow}></img>
                  </div>
                  <div>
                    <h2>OUTPUT</h2>
                    <input value='"Text example output"' readOnly></input>
                  </div>
                </div>
                <h3>Arrays:</h3>
                <div className='inputOutputExample__container' id='scroll'>
                  <div>
                    <h2>INPUT</h2>
                    <input value='[1,2,3]' readOnly></input>
                  </div>
                  <div className='inputArrows__container'>
                    <img src={arrow}></img>
                  </div>
                  <div>
                    <h2>OUTPUT</h2>
                    <input value='["hellow","world","!"]' readOnly></input>
                  </div>
                </div>
                <br></br>
                <button className='pixel-button' onClick={() => {
                  setExampleModal(false)
                }}>CLOSE</button>
              </div>
            </Modal>
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
