import React from 'react'
import ReactDOM from 'react-dom'

function renderApp(ui) {
  if (process.env.NODE_ENV === 'test') {
    // you wouldn't normally do something like this
    // in an app, but doing this makes things easier
    // for our use case in the workshop :)
    return
  }
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
