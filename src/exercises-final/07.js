// State Initializers

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
  }
  initialState = {on: this.props.initialOn}
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
  getStateAndHelpers() {
    return {
      on: this.state.on,
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    }
  }
  render() {
    return this.props.children(this.getStateAndHelpers())
  }
}

function Usage(
  props = {
    initialOn: false,
    onToggle: (...args) => console.log('onToggle', ...args),
    onReset: (...args) => console.log('onReset', ...args),
  },
) {
  return (
    <Toggle
      initialOn={props.initialOn}
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

// exporting Usage as default for codesandbox module view to work
export {Toggle, Usage, Usage as default}
