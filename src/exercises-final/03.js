// Flexible Compound Components with context

import React from 'react'
import ReactDOM from 'react-dom'
import Switch from '../switch'
import renderApp from '../render-app'

const ToggleContext = React.createContext({on: false, toggle: () => {}})

class Toggle extends React.Component {
  static defaultProps = {onToggle: () => {}}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  state = {on: false, toggle: this.toggle}
  render() {
    return (
      <ToggleContext.Provider value={this.state}>
        <div>{this.props.children}</div>
      </ToggleContext.Provider>
    )
  }
}

function ToggleOn({children}) {
  return (
    <ToggleContext.Consumer>
      {({on}) => (on ? children : null)}
    </ToggleContext.Consumer>
  )
}

function ToggleOff({children}) {
  return (
    <ToggleContext.Consumer>
      {({on}) => (on ? null : children)}
    </ToggleContext.Consumer>
  )
}

function ToggleButton(props) {
  return (
    <ToggleContext.Consumer>
      {({on, toggle}) => <Switch on={on} onClick={toggle} {...props} />}
    </ToggleContext.Consumer>
  )
}

function App() {
  return (
    <Toggle onToggle={on => console.log('toggle', on)}>
      <ToggleOn>The button is on</ToggleOn>
      <ToggleOff>The button is off</ToggleOff>
      <div>
        <ToggleButton />
      </div>
    </Toggle>
  )
}

renderApp(<App />)
