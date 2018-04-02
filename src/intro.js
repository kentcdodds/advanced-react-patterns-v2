import React from 'react'
import {render} from 'react-dom'

const styles = {
  textAlign: 'center',
}

const App = () => (
  <div style={styles}>
    <h2>Start editing to see some magic happen {'\u2728'}</h2>
  </div>
)

render(<App />, document.getElementById('root'))
