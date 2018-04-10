// Compound Components

import React from 'react'
import {Switch} from '../switch'

class Toggle extends React.Component {
  static On = ({on, children}) => (on ? children : null)
  static Off = ({on, children}) => (on ? null : children)
  static Button = ({on, toggle, ...props}) => (
    <Switch on={on} onClick={toggle} {...props} />
  )
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        on: this.state.on,
        toggle: this.toggle,
      }),
    )
  }
}

function Usage(
  props = {
    onToggle: (...args) => console.log('onToggle', ...args),
  },
) {
  return (
    <Toggle onToggle={props.onToggle}>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <Toggle.Button />
    </Toggle>
  )
}

// exporting Usage as default for codesandbox module view to work
export {Toggle, Usage, Usage as default}
