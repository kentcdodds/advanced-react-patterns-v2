// render props

import React from 'react'
import ReactDOM from 'react-dom'
import Switch from '../switch'
import renderApp from '../render-app'

class Toggle extends React.Component {
  static defaultProps = {onToggle: () => {}}
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  render() {
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle,
    })
  }
}

function MyToggle({on, toggle}) {
  return <button onClick={toggle}>{on ? 'on' : 'off'}</button>
}

function App() {
  return (
    <Toggle
      onToggle={on => console.log('toggle', on)}
      render={({on, toggle}) => (
        <div>
          {on ? 'The button is on' : 'The button is off'}
          <Switch on={on} onClick={toggle} />
          <hr />
          <MyToggle on={on} toggle={toggle} />
        </div>
      )}
    />
  )
}

renderApp(<App />)
