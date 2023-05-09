import '../styles/normalize.css'
import '../styles/eye.css'
import PropTypes from 'prop-types'
import routes from '../conn_routes'
import { useEffect } from 'react'

SendTutorialLocalStorageData.propTypes = {
  token: PropTypes.string
}

function SendTutorialLocalStorageData({ token }) {
  const data = new FormData()
  data.append('token', token)
  data.append('tutorialsAnswered', JSON.stringify([1, 3, 5]))
  data.append('tutorialPassed', false)
  data.append('userExperience', 'beginner')

  useEffect(() => {
    fetch(routes.fetchLaravel + 'setUserTutorial', {
      method: 'POST',
      mode: 'cors',
      body: data,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
  }, [])
}

export default SendTutorialLocalStorageData
