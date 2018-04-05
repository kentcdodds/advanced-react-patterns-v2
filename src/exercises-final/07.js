// State Initializers

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    defaultOn: false,
    onReset: () => {},
  }
  initialState = {on: this.props.defaultOn}
  state = this.initialState
  reset = () =>
    this.setState(this.initialState, () => this.props.onReset(this.state.on))
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, this.toggle),
    'aria-expanded': this.state.on,
    ...props,
  })
  render() {
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    })
  }
}

function Usage(props) {
  return (
    <Toggle
      defaultOn={props.defaultOn}
      onToggle={props.onToggle}
      onReset={props.onReset}
    >
      {toggle => (
        <div>
          <Switch
            {...toggle.getTogglerProps({
              on: toggle.on,
            })}
          />
          <hr />
          <button onClick={() => toggle.reset()}>Reset</button>
        </div>
      )}
    </Toggle>
  )
}

export {Toggle, Usage}
