// State Initializers

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  // We're going to need some static defaultProps here to allow
  // people to pass a `initialOn` prop.
  //
  // Rather than initializing state to have on as false,
  // we can set on to this.props.initialOn
  state = {on: false}

  // now let's add a reset method here that resets the state
  // to the initial state. Then add a callback that calls
  // this.props.onReset with the `on` state.
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  getTogglerProps = ({onClick, ...props} = {}) => {
    return {
      'aria-expanded': this.state.on,
      onClick: callAll(onClick, this.toggle),
      ...props,
    }
  }
  getStateAndHelpers() {
    return {
      on: this.state.on,
      toggle: this.toggle,
      // now let's include the reset method here
      // so folks can use that in their implementation.
      getTogglerProps: this.getTogglerProps,
    }
  }
  render() {
    return this.props.children(this.getStateAndHelpers())
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage(props) {
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

export {Toggle, Usage}
