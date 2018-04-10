// render props

import React from 'react'
import {Switch} from '../switch'

class Toggle extends React.Component {
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  render() {
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
    })
  }
}

function Usage(props) {
  return (
    <Toggle onToggle={props.onToggle}>
      {({on, toggle}) => (
        <div>
          {on ? 'The button is on' : 'The button is off'}
          <Switch on={on} onClick={toggle} />
          <hr />
          <button aria-label="custom-button" onClick={toggle}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  )
}

// exporting Usage as default for codesandbox module view to work
export {Toggle, Usage, Usage as default}
