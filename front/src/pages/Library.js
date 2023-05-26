import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import '../styles/Library.css'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom' // Rutas
import { Loading } from '../components/Loading'
import Header from '../components/Header'
import Tippy from '@tippyjs/react' // Tooltip
import 'tippy.js/dist/tippy.css' // Tooltip styles
import 'tippy.js/themes/light-border.css' // Tooltip theme
import 'tippy.js/animations/shift-away-extreme.css' // Tooltip animation

/**
 * Biblioteca de preguntas del usuario.
 * @function Library
 */
function Library() {
  const [userLogged, setUserLogged] = useState(false)
  const [questionData, setQuestionData] = useState([{
    title: '',
    statement: '',
    public: false,
    likes: 0
  }])
  const cookies = new Cookies()
  const navigate = useNavigate()
  const getQuestions = () => {
    const token = new FormData()
    token.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    fetch(routes.fetchLaravel + 'getMyQuestions', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestionData(data)
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
          localStorage.setItem('lastPage', 'library')
        }
      })
  }

  /**
 * Al clicar envia una peticion a Laravel para borrar la pregunta concreta y luego la elimina de la tabla.
 * @function handleDelete
 */
  const handleDelete = (index, quesitonId) => {
    const deleteQuestion = new FormData()
    deleteQuestion.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    deleteQuestion.append('questionId', quesitonId)
    fetch(routes.fetchLaravel + 'deleteMyQuestion', {
      method: 'POST',
      mode: 'cors',
      body: deleteQuestion,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.deleted) {
          document.getElementById('questionId' + index).style.display = 'none'
        }
      })
  }

  /**
 * Al clicar envia al usuario a la pagina de editar pregunta.
 * @function handleDelete
 * @param quesitonId id de la pregunta a editar.
 */
  const handleEdit = (quesitonId) => {
    navigate('/editQuestion', { state: { questionId: quesitonId } })
  }

  useEffect(() => {
    isUserLogged()
    getQuestions()
  }, [])
  return (
    <>
      <Header></Header>
      {userLogged && (questionData[0].title !== undefined ? questionData[0].title !== '' : questionData.length === 0)
        ? <div className='library'>
          <button className='pixel-button library-back' onClick={() => navigate('/codeworld')}>← go back</button>
          <h1>Questions Library</h1>
          <div className='tableList__container' id='scroll'>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Statement</th>
                  <th>Public</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {questionData.map((element, index) => {
                  return <tr id={'questionId' + index} key={index}>
                    <td>{element.title}</td>
                    <Tippy
                      className='library__tooltip'
                      theme={'light-border'}
                      content={element.statement}
                      placement={'top'}
                      animation={'shift-away-extreme'}
                    >
                      <td>{element.statement}</td>
                    </Tippy>

                    <td>{element.public === 0 ? 'no' : 'yes'}</td>
                    <td><button className='pixel-button edit-button' onClick={() => handleEdit(element.id)}>Edit</button></td>
                    <td><button className='pixel-button delete-button' onClick={() => handleDelete(index, element.id)}>Delete</button></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
          <button className='pixel-button' onClick={() => navigate('/addQuestion')}>Add new question</button>
        </div>
        : <Loading></Loading>
      }
    </>
  )
}

export default Library
