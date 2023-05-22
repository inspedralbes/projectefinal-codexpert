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

  useEffect(() => {
    isUserLogged()
    getQuestions()
  }, [])
  return (
    <>
      <Header></Header>
      {userLogged && questionData.title !== ''
        ? <div className='library'>
      <h1>Library</h1>
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
          return <tr key={index}>
              <td>{element.title}</td>
              <td>{element.statement}</td>
              <td>{element.public}</td>
              <td><button>Edit</button></td>
              <td><button>Delete</button></td>
            </tr>
        })}
        </tbody>
      </table>
      <button className='pixel-button' onClick={() => navigate('/addQuestion')}>Add question</button>
    </div>
        : <Loading></Loading>
      }
    </>
  )
}

export default Library
