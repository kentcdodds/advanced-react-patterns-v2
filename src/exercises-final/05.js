// prop collections

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
      togglerProps: {
        'aria-expanded': this.state.on,
        onClick: this.toggle,
      },
    })
  }
}

function Usage(props) {
  return (
    <Toggle onToggle={props.onToggle}>
      {({on, togglerProps}) => (
        <div>
          <Switch on={on} {...togglerProps} />
          <hr />
          <button aria-label="custom-button" {...togglerProps}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  )
}

export {Toggle, Usage}
