import React, { useEffect, useState } from 'react'
import '../styles/normalize.css'
import '../styles/Library.css'
import routes from '../conn_routes'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom' // Rutas
import { Loading } from '../components/Loading'
import Header from '../components/Header'

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
        console.log(data)
        setQuestionData(data)
        console.log(data)
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
          localStorage.setItem('lastPage', 'library')
        }
      })
  }

  const handleDelete = (index, quesitonId) => {
    const deleteQuestion = new FormData()
    deleteQuestion.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
    deleteQuestion.append('id', quesitonId)
    fetch(routes.fetchLaravel + 'isUserLogged', {
      method: 'POST',
      mode: 'cors',
      body: deleteQuestion,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.correct) {
          document.getElementById('questionId' + index).style.display = 'none'
        }
      })
  }

  const handleEdit = (quesitonId) => {
    console.log(quesitonId)
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
          <h1>Library</h1>
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
                    <td>{element.statement}</td>
                    <td>{element.public}</td>
                    <td><button onClick={() => handleEdit(element.id)}>Edit</button></td>
                    <td><button onClick={() => handleDelete(index, element.id)}>Delete</button></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
          <button className='pixel-button' onClick={() => navigate('/addQuestion')}>Add question</button>
        </div>
        : <Loading></Loading>
      }
    </>
  )
}

export default Library
