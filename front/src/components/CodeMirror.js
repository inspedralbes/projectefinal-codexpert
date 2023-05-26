import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror' // Importamos Codemirror
import { javascript } from '@codemirror/lang-javascript' // Dentro de CodeMirror importamos el lenjuage que queremos utilizar
import '../styles/avatarMaker.css'
import PropTypes from 'prop-types'

App.propTypes = {
  code: PropTypes.string,
  setCode: PropTypes.func
}

function App({ code, setCode }) {
  const [theme] = useState('dark')
  const onChange = React.useCallback((value, viewUpdate) => { // Con esto seteamos el texto que se vaya escribiendo en el CodeMirror a traves del 'value'
    setCode(value)
  }, [])


  return (
    <div className="codemirror__editor">
      <CodeMirror
        value={code}
        style={{ fontSize: '1.1rem' }}
        height="350px"
        width="100%"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>
  )
}
export default App
