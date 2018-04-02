import React from 'react'
import ReactDOM from 'react-dom'

function renderApp(ui) {
  ReactDOM.render(
    <div
      style={{
        marginTop: 40,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      {ui}
    </div>,
    document.getElementById('root'),
  )
}

export default renderApp
