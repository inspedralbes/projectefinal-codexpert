/* eslint-disable */

import '../styles/Tutorial.css'
import '../styles/game.css'
import routes from '../conn_routes'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CodeMirror from '../components/CodeMirror'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom' // Rutas
import Carousel from 'nuka-carousel'
import parse from 'html-react-parser'
import introductionData from '../localData/IntroductionsData.json'
import arrowLeft from '../img/corousel-arrowLeft.png'
import heart from '../img/corazon_roto.gif'
import jose from '../img/jose.gif'
import arrowRight from '../img/corousel-arrowRight.png'
import closedEye from '../img/closedEye.png'
import Modal from 'react-modal'

Modal.setAppElement('body')

/**
 * Pagina que varia segun la id de pregunta que se le pase por la ruta, el objetivo de esta es enseñar al usuario a programar en JavaScript.
 * @function Tutorial
 */
function Tutorial() {
  const [introductionExample, setIntroductionExample] = useState([
    "<p>Hello World!</p>",
    "<p>Well done!</p>"
  ])
  const location = useLocation()
  const cookies = new Cookies()
  const navigate = useNavigate()
  const defaultCode =
    'function yourCode(input){ \n  //code here\n  \n  return input\n}\nyourCode(input)'
  const [code, setCode] = useState(defaultCode)
  const [error, setError] = useState('')
  const [CmodalIsOpen, setCIsOpen] = useState(false)
  const [ImodalIsOpen, setIIsOpen] = useState(false)
  const [enableIntroductionNextButton, setEnableIntroductionNextButton] = useState({
    introduction: true,
    hint: true
  })
  const [modal, setModal] = useState({
    hello: false,
    introduction: false,
    hint: false,
    statement: false,
    inputOutput: false,
    codeEditor: false,
    submit: false,
  })
  const [qst, setQst] = useState({
    statement: '',
    inputs: [''],
    output: ''
  })



  useEffect(() => {
    if (location.state === null) {
      navigate('/campaign')
    } else {
      if (location.state.id === 1) {
        setModal(prev => ({ ...prev, hello: true }))
      }
      let scroll = document.getElementsByClassName('slider-container')
      scroll[0].id = "scroll"
      const tutorialData = new FormData()
      tutorialData.append('id', location.state.id)
      tutorialData.append(
        'token',
        cookies.get('token') !== undefined ? cookies.get('token') : null
      )
      fetch(routes.fetchLaravel + 'getTutorialFromId', {
        method: 'POST',
        mode: 'cors',
        body: tutorialData,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          setQst(data)
        })
    }

  }, [])

  /**
 * Duración del modal de correcto e incorrecto al submitear una pregunta.
 * @function afterOpenModal
 */
  function afterOpenModal() {
    setTimeout(() => {
      setCIsOpen(false)
      setIIsOpen(false)
    }, 4000)
  }

  /**
 * Al clicar el icono de la pista se desbloqueara visualmente esta.
 * @function handleHint
 */
  const handleHint = () => {
    document.getElementById('hint').style.display = 'none'
    setEnableIntroductionNextButton(prev => ({ ...prev, hint: false }))
  }

  /**
 * Al clicar en el boton de submit esta función evalua el codigo del usuario con los tests y comprueba si esta bien o si esta mal.
 * @function sendTutorialLocalStorageData
 */
  const handleSubmit = async (e) => {
    let tutorialsId = []
    e.preventDefault()
    if (code !== '') {
      const resultsEvalRecieved = []
      let evalPassedBoolean = true
      qst.inputs.forEach((inp) => {
        let input = inp
        try {
          const res = eval(code)
          resultsEvalRecieved.push(res)
          setError('Result: ' + res)
        } catch (e) {
          setError(e.message)
          evalPassedBoolean = false
        }
      })

      const checkAnswer = new FormData()
      checkAnswer.append('idQuestion', location.state.id)
      checkAnswer.append('evalRes', JSON.stringify(resultsEvalRecieved))
      checkAnswer.append('evalPassed', JSON.stringify(evalPassedBoolean))
      checkAnswer.append(
        'token',
        cookies.get('token') !== undefined ? cookies.get('token') : null
      )
      fetch(routes.fetchLaravel + 'checkTutorialAnswer', {
        method: 'POST',
        mode: 'cors',
        body: checkAnswer,
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.correct) {
            if (localStorage.getItem('tutorialsAnswered') !== null) {
              tutorialsId = JSON.parse(
                localStorage.getItem('tutorialsAnswered')
              )
            }
            if (!tutorialsId.includes(location.state.id)) {
              tutorialsId.push(location.state.id)
            }
            tutorialsId.sort()
            localStorage.setItem(
              'tutorialsAnswered',
              JSON.stringify(tutorialsId)
            )
            tutorialsId.sort()
            setCIsOpen(true)
            setTimeout(() => {
              navigate('/campaign')
            }, 4000)
          } else {
            setIIsOpen(true)
          }
        })
    }
  }

  if (location.state === null) {
    return (null)
  } else {
    return (
      <div className="tutorial__container">

        {location.state.id - 1 === 0 && ( // Interface tutorial
          <>
            <Modal // Welcome Modal
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 2
                },
                content: {
                  backgroundColor: '#d3ffcd'
                }
              }}
              onRequestClose={() => setModal(prev => ({ ...prev, hello: false }))}
              shouldCloseOnOverlayClick={false}
              isOpen={modal.hello}
            >
              <div>
                <h1>Hello to your first Tutorial!</h1>
                <p style={{ padding: 30 }}>Let us show you how the interface works.</p>
                <button className='pixel-button' onClick={() => {
                  setModal(prev => ({ ...prev, hello: false }))
                  setModal(prev => ({ ...prev, introduction: true }))
                  document.querySelectorAll('.slider-container')[0].style.zIndex = 3
                  document.querySelectorAll('.slider-container')[0].style.border = "10px solid black"
                }}>START</button>
              </div>
            </Modal>
            <Modal // Introduction Modal
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 2
                },
                content: {
                  position: 'absolute',
                  top: '-43%',
                  left: '40%',
                  backgroundColor: '#d3ffcd'
                }
              }}
              onRequestClose={() => setModal(prev => ({ ...prev, introduction: false }))}
              shouldCloseOnOverlayClick={false}
              isOpen={modal.introduction}
            >
              <div>
                <h1>Introduction</h1>
                <p>This section only appears in the tutorial and serves to teach you everything you need to learn how to program. <b>Use its arrows <img src={arrowRight} width={30} height={30} style={{ backgroundColor: '#008000' }}></img> to switch pages.</b></p>
                <button className='pixel-button next-carousel' disabled={enableIntroductionNextButton.introduction} onClick={() => {
                  setModal(prev => ({ ...prev, introduction: false }))
                  setModal(prev => ({ ...prev, hint: true }))
                  setIntroductionExample(introductionData.introductions[location.state.id - 1].introduction)
                  document.querySelectorAll('.slider-container')[0].style.zIndex = 1
                  document.querySelectorAll('.slider-container')[0].style.border = "3px solid black"
                  setTimeout(() => {
                    document.querySelectorAll('.hint__container')[0].style.zIndex = 3
                    document.querySelectorAll('.hint__container')[0].style.border = "3px solid black"
                  }, 500)
                  document.querySelectorAll('.hint__cover')[0].style.zIndex = 4
                  document.querySelectorAll('.hint__cover')[0].style.border = "10px solid black"

                }}>NEXT</button>
              </div>
            </Modal>
            <Modal // Hint Modal
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 2
                },
                content: {
                  position: 'absolute',
                  top: '58%',
                  left: '40%',
                  backgroundColor: '#d3ffcd'
                }
              }}
              onRequestClose={() => setModal(prev => ({ ...prev, hint: false }))}
              shouldCloseOnOverlayClick={false}
              isOpen={modal.hint}
            >
              <div>
                <h1>hint</h1>
                <p>A little help never hurts!
                  <b>Click on the eye
                    <img src={closedEye} width={30} height={30} style={{ borderRadius: '50%', backgroundColor: 'rgb(214, 214, 214)', border: '2px solid #88D34A' }}></img> to see the hint
                  </b>
                </p>
                <br></br>
                <p style={{ fontSize: '15px' }}>(we recommend its use only if necessary ;D)</p>
                <button className='pixel-button next-carousel' id="next" disabled={enableIntroductionNextButton.hint} onClick={() => {
                  setModal(prev => ({ ...prev, hint: false }))
                  setModal(prev => ({ ...prev, statement: true }))
                  document.querySelectorAll('.hint__cover')[0].style.zIndex = 1
                  document.querySelectorAll('.hint__cover')[0].style.border = "1px solid black"
                  document.querySelectorAll('.hint__container')[0].style.zIndex = 1
                  document.querySelectorAll('.hint__container')[0].style.border = "1px solid black"
                  document.querySelectorAll('.tutorial__statement')[0].style.zIndex = 3
                  document.querySelectorAll('.tutorial__statement')[0].style.border = "10px solid black"
                }}>NEXT</button>
              </div>
            </Modal>
            <Modal // Statement Modal
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 2
                },
                content: {
                  position: 'absolute',
                  top: '-55%',
                  left: '-57%',
                  width: '40%',
                  backgroundColor: '#d3ffcd'
                }
              }}
              onRequestClose={() => setModal(prev => ({ ...prev, statement: false }))}
              shouldCloseOnOverlayClick={false}
              isOpen={modal.statement}
            >
              <div>
                <h1>Statement</h1>
                <p>You will find it in every game, <b>read it well if you want to have a perfect result!</b></p>
                <button className='pixel-button next-carousel' id="next" disabled={enableIntroductionNextButton.hint} onClick={() => {
                  setModal(prev => ({ ...prev, statement: false }))
                  setModal(prev => ({ ...prev, inputOutput: true }))
                  document.querySelectorAll('.tutorial__statement')[0].style.zIndex = 1
                  document.querySelectorAll('.tutorial__statement')[0].style.border = "6px solid black"
                  document.querySelectorAll('.tutorial__statement')[0].style.borderWidth = "6px 0"
                  document.querySelectorAll('.editor__expected')[0].style.zIndex = 3
                  document.querySelectorAll('.editor__expected')[0].style.border = "10px solid black"

                }}>NEXT</button>
              </div>
            </Modal>
            <Modal // Input and Output Modal
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 2
                },
                content: {
                  position: 'absolute',
                  top: '-5%',
                  left: '-57%',
                  width: '43%',
                  backgroundColor: '#d3ffcd'
                }
              }}
              onRequestClose={() => setModal(prev => ({ ...prev, inputOutput: false }))}
              shouldCloseOnOverlayClick={false}
              isOpen={modal.inputOutput}
            >
              <div>
                <h1>Input and Output</h1>
                <p>The input is the variable we are going to give you, and the output is what we want to receive. <b>Be careful! there is not only one output check!</b></p>
                <button className='pixel-button next-carousel' id="next" onClick={() => {
                  setModal(prev => ({ ...prev, inputOutput: false }))
                  setModal(prev => ({ ...prev, codeEditor: true }))
                  document.querySelectorAll('.editor__expected')[0].style.zIndex = 1
                  document.querySelectorAll('.editor__expected')[0].style.border = "0px solid black"
                  document.querySelectorAll('.codemirror__editor')[0].style.zIndex = 3
                  document.querySelectorAll('.codemirror__editor')[0].style.border = "10px solid black"
                }}>NEXT</button>
              </div>
            </Modal>
            <Modal // CodeEditor Modal
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 2
                },
                content: {
                  position: 'absolute',
                  top: '42%',
                  left: '-57%',
                  width: '40%',
                  backgroundColor: '#d3ffcd'
                }
              }}
              onRequestClose={() => setModal(prev => ({ ...prev, codeEditor: false }))}
              shouldCloseOnOverlayClick={false}
              isOpen={modal.codeEditor}
            >
              <div>
                <h1>Code editor</h1>
                <p>Here is where you are going to <b>be the protagonist</b>, and where you are going to write your code and show the program that <b>you can</b>.</p>
                <br></br>
                <p style={{ fontSize: '15px' }}>(We always recommend to return the input variable and start writing where it says "//code here")</p>
                <button className='pixel-button next-carousel' id="next" onClick={() => {
                  setModal(prev => ({ ...prev, codeEditor: false }))
                  setModal(prev => ({ ...prev, submit: true }))
                  document.querySelectorAll('.codemirror__editor')[0].style.zIndex = 1
                  document.querySelectorAll('.codemirror__editor')[0].style.border = "0px solid black"
                  document.querySelectorAll('.game__submit')[0].style.zIndex = 3
                  document.querySelectorAll('.game__submit')[0].style.border = "10px solid black"
                }}>NEXT</button>
              </div>
            </Modal>
            <Modal // Submit Modal
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 2
                },
                content: {
                  position: 'absolute',
                  top: '35%',
                  left: '58.5%',
                  width: '40%',
                  backgroundColor: '#d3ffcd'
                }
              }}
              onRequestClose={() => setModal(prev => ({ ...prev, submit: false }))}
              shouldCloseOnOverlayClick={false}
              isOpen={modal.submit}
            >
              <div>
                <h1>Submit</h1>
                <p>When you are sure you have done everything right, be sure to click this button to check that everything went well!</p>
                <button className='pixel-button next-carousel' id="next" onClick={() => {
                  setModal(prev => ({ ...prev, submit: false }))
                  document.querySelectorAll('.game__submit')[0].style.zIndex = 1
                  document.querySelectorAll('.game__submit')[0].style.border = "6px solid black"
                  document.querySelectorAll('.game__submit')[0].style.borderWidth = "6px 0"
                }}>FINISH</button>
              </div>
            </Modal>
          </>
        )}
        <div className="introduction__container">
          <button className='pixel-button goBack-button' onClick={() => navigate('/campaign')}>go back</button>
          <h1 className='introduction-title'>Introduction:</h1>
          {introductionData.introductions[location.state.id - 1].introduction[0] !==
            '' && (
              <>
                <Carousel
                  defaultControlsConfig={{
                    containerClassName: 'containerCarousel',
                    nextButtonClassName: 'nextButtonCarousel',
                    prevButtonClassName: 'prevButtonCarousel',
                    pagingDotsContainerClassName: introductionData.introductions[location.state.id - 1].introduction.length === 1 ? 'hiddenCarousel' : 'dotsCarousel',
                    nextButtonOnClick: () => setEnableIntroductionNextButton(prev => ({ ...prev, introduction: false })),

                    prevButtonText: (
                      <img src={arrowLeft} width="50px">
                      </img>
                    ),

                    nextButtonText: (
                      <img src={arrowRight} width="50px">
                      </img>
                    ),

                    pagingDotsStyle: {
                      fill: "green"
                    }
                  }}
                >
                  {!enableIntroductionNextButton || location.state.id !== 1
                    ? introductionData.introductions[
                      location.state.id - 1
                    ].introduction.map((element, index) => {
                      return <div key={index}>{parse(element)}</div>
                    })
                    : introductionExample.map((element, index) => {
                      return <div key={index}>{parse(element)}</div>
                    })
                  }
                </Carousel>
                <Modal
                  className='correctAnsw game__modal'
                  style={{
                    overlay: {
                      zIndex: 2
                    },
                    content: {
                      position: 'absolute',
                      top: '0%',
                      left: '30%',
                      width: '40%',
                      height: '40%',
                    }
                  }}
                  isOpen={CmodalIsOpen}
                  onAfterOpen={afterOpenModal}
                >
                  YOU DID IT ! ! :)
                  <img src={jose} alt='' height={'300px'}></img>
                </Modal>
                <Modal
                  className='incorrectAnsw game__modal animate__animated animate__tada'
                  style={{
                    overlay: {
                      zIndex: 2
                    },
                    content: {
                      position: 'absolute',
                      top: '0%',
                      left: '30%',
                      width: '40%',
                      height: '40%',
                    }
                  }}
                  shouldCloseOnOverlayClick={false}
                  isOpen={ImodalIsOpen}
                  onAfterOpen={afterOpenModal}
                >
                  <div>
                    <p>TRY AGAIN!!</p>
                    <img src={heart} alt='' height={'300px'}></img>
                  </div>
                </Modal>
                {introductionData.hints[location.state.id - 1] !== "" && (
                  <>
                    <div className='hint__cover' id="hint">
                      <h1>Hint</h1>
                      <img onClick={() => handleHint()}></img>
                    </div>
                    <div className='hint__container'>
                      <div id="scroll">
                        {parse(introductionData.hints[location.state.id - 1])}
                      </div>
                    </div>
                  </>
                )}

              </>
            )}
        </div>
        <div>
          <div className="game__statement tutorial__statement">
            <h2>Statement:</h2>
            <h1 className="game__statementTitle" id="scroll">{parse(qst.statement)}</h1>
          </div>
          <div className="game--grid tutorial__game--grid">
            <div className="editor--div">
              <div className="editor__expected">
                <div className="game__expectedInput">
                  <h2>Example input:</h2>
                  <h1>{qst.inputs[0].toString()}</h1>
                </div>

                <div className="game__expectedOutput">
                  <h2>Example output:</h2>
                  <h1>{qst.output.toString()}</h1>
                </div>
              </div>
              <form className="editor" onSubmit={handleSubmit}>
                <CodeMirror id="codemirror" code={code} setCode={setCode}></CodeMirror>
                <div className='result__container'>
                  <div className="game__result">
                    <h1>{error !== '' && <div>{error}</div>}</h1>
                  </div>
                  <button
                    className="pixel-button game__submit"
                    disabled={code === ''}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Tutorial