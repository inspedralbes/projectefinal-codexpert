import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import '../styles/avatarMaker.css'
import PropTypes from 'prop-types'
import {
  cobalt,
  amy,
  boysAndGirls,
  tomorrow,
  rosePineDawn,
  noctisLilac,
  espresso,
  coolGlow,
  dracula,
  barf,
  birdsOfParadise
} from 'thememirror'

App.propTypes = {
  code: PropTypes.string,
  setCode: PropTypes.func
}

function App({ code, setCode }) {
  const [theme] = useState('dark')
  const onChange = React.useCallback((value, viewUpdate) => {
    setCode(value)
  }, [])

  let themeShow

  switch (theme) {
    case 'cobalt':
      themeShow = cobalt
      break
    case 'amy':
      themeShow = amy
      break
    case 'boyAndGirls':
      themeShow = boysAndGirls
      break
    case 'tomorrow':
      themeShow = tomorrow
      break
    case 'rosePineDawn':
      themeShow = rosePineDawn
      break
    case 'noctisLilac':
      themeShow = noctisLilac
      break
    case 'espresso':
      themeShow = espresso
      break
    case 'coolGlow':
      themeShow = coolGlow
      break
    case 'dracula':
      themeShow = dracula
      break
    case 'barf':
      themeShow = barf
      break
    case 'birdsOfParadise':
      themeShow = birdsOfParadise
      break
    case 'dark':
      themeShow = 'dark'
      break
  }

  return (
    <div className="codemirror__editor">
      <CodeMirror
        value={code}
        style={{ fontSize: '1.1rem' }}
        height="400px"
        width="100%"
        theme={themeShow}
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
      {/* <select id='select' value={theme} onChange={e => setTheme(e.target.value)}>
        <option value='dark'>dark</option>
        <option value='cobalt'>cobalt</option>
        <option value='amy'>amy</option>
        <option value='boyAndGirls'>boyAndGirls</option>
        <option value='tomorrow'>tomorrow</option>
        <option value='rosePineDawn'>rosePineDawn</option>
        <option value='noctisLilac'>noctisLilac</option>
        <option value='espresso'>espresso</option>
        <option value='coolGlow'>coolGlow</option>
        <option value='dracula'>dracula</option>
        <option value='barf'>barf</option>
        <option value='birdsOfParadise'>birdsOfParadise</option>
      </select> */}
    </div>
  )
}
export default App
