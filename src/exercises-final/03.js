// Flexible Compound Components with context

import React from 'react'
import ReactDOM from 'react-dom'
import Switch from '../switch'
import renderApp from '../render-app'

const ToggleContext = React.createContext({on: false, toggle: () => {}})

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
class Toggle extends React.Component {
  static On = ToggleOn
  static Off = ToggleOff
  static Button = ToggleButton
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

function App() {
  return (
    <Toggle onToggle={on => console.log('toggle', on)}>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </Toggle>
  )
}

renderApp(<App />)
