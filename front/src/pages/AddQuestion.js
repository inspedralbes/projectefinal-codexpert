import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/normalize.css'
import '../styles/addQuestion.css'
import { Loading } from '../components/Loading'
import Header from '../components/Header'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import arrow from '../img/InputOutputArrow.png'
import informationIcon from '../img/information_icon.gif'
import Modal from 'react-modal'

/**
 * Pagina para añadir preguntas en la libreria de preguntas del usuario.
 * @function AddQuestion
 */
function AddQuestion() {
  const [questionData, setQuestionData] = useState({
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
  const navigate = useNavigate()

  /**
 * Al clicar añade el número de inputs y outputs a poder poner como tests.
 * @function handleAddInputOutput
 */
  const handleAddInputOutput = () => {
    if (inputsOutputs.length <= 10) {
      setInputsOutputs([...inputsOutputs, ''])
      setQuestionData({ ...questionData, outputs: [...questionData.outputs, ''], inputs: [...questionData.inputs, ''] })
    }
  }

  /**
 * Al clicar disminuye la cantidad de inputs y outputs a poder poner como tests.
 * @function handleRemoveInputOutput
 */
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

  /**
 * Al clicar comprueva si puede añadir la pregunta a la base de datos y en caso afirmativo la añade.
 * @function handleAddQuestion
 */
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
        if (data.created) {
          navigate('/library')
        } else {
          setError(data.error)
        }
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
    isUserLogged()
  }, [])

  return (
    <>
    <Header></Header>
      {userLogged
        ? <div className='addQuestionPixel'>
          <button className='pixel-button addQuestion-back' onClick={() => localStorage.getItem('lastPage') !== null ? navigate('/' + localStorage.getItem('lastPage')) : navigate('/')}>← Go back</button>
          <h1>Add question</h1>

          <div className='addQuestionPixel__container'>
            <div className='addQuestionPixel__titleCheckbox'>
              <div className="row">
                <div className="addQuestionPixel__title">
                  <label>Title:</label>
                </div>
                <div className="addQuestionPixel__input">
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
              <textarea id='scroll' tabIndex="2" placeholder='Set the string input to Uppercase with str.toUpperCase().' onChange={(e) => { setQuestionData({ ...questionData, statement: e.target.value }) }}></textarea>
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
                    setQuestionData({ ...questionData, inputs: input })
                  }} placeholder={placeholder.input[index]} tabIndex={index + index + 3} key={index} id={'input' + index} type="text"></input>
                })}
              </div>
              <div className='inputArrows__container'>
                {inputsOutputs.map((element, index) => { return <div key={index}><img src={arrow}></img></div> })}
              </div>
              <div>
                <h2>OUTPUTS</h2>
                {inputsOutputs.map((element, index) => {
                  return <input onChange={(e) => {
                    const output = questionData.outputs
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
                    setQuestionData({ ...questionData, outputs: output })
                  }} tabIndex={index + index + 4} id={'output' + index} placeholder={placeholder.output[index]} key={index} type="text"></input>
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
                    <input value='["hello","world","!"]' readOnly></input>
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
          <button className='pixel-button' onClick={() => handleAddQuestion()}>Add</button>
        </div>
        : <Loading />
      }
    </>
  )
}

export default AddQuestion
