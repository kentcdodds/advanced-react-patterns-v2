// state reducer with types

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
    stateReducer: (state, changes) => changes,
  }
  initialState = {on: this.props.initialOn}
  state = this.initialState
  internalSetState(changes, callback) {
    this.setState(state => {
      const stateToSet = [changes]
        .map(c => (typeof c === 'function' ? c(state) : c))
        .map(c => this.props.stateReducer(state, c))[0]
      // in addition to what we've done, add another
      // `.map` to remove the `type` (don't forget
      // to move the [0] above to your new map call!)
      return stateToSet
    }, callback)
  }
  reset = () =>
    // add a `type` string property to this call
    this.internalSetState(this.initialState, () =>
      this.props.onReset(this.state.on),
    )
  // accept a `type` property here and give it a default value
  toggle = () =>
    this.internalSetState(
      // pass the `type` string to this object
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  getTogglerProps = ({onClick, ...props} = {}) => ({
    // change `this.toggle` to `() => this.toggle()`
    // to avoid passing the click event to this.toggle.
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

class Usage extends React.Component {
  static defaultProps = {
    onToggle: () => {},
    onReset: () => {},
  }
  initialState = {timesClicked: 0}
  state = this.initialState
  handleToggle = (...args) => {
    this.setState(({timesClicked}) => ({
      timesClicked: timesClicked + 1,
    }))
    this.props.onToggle(...args)
  }
  handleReset = (...args) => {
    this.setState(this.initialState)
    this.props.onReset(...args)
  }
  toggleStateReducer = (state, changes) => {
    if (changes.type === 'forced') {
      return changes
    }
    if (this.state.timesClicked >= 4) {
      return {...changes, on: false}
    }
    return changes
  }
  render() {
    const {timesClicked} = this.state
    return (
      <Toggle
        stateReducer={this.toggleStateReducer}
        onToggle={this.handleToggle}
        onReset={this.handleReset}
        ref={this.props.toggleRef}
      >
        {toggle => (
          <div>
            <Switch
              {...toggle.getTogglerProps({
                on: toggle.on,
              })}
            />
            {timesClicked > 4 ? (
              <div data-testid="notice">
                Whoa, you clicked too much!
                <br />
                <button onClick={() => toggle.toggle({type: 'forced'})}>
                  Force Toggle
                </button>
                <br />
              </div>
            ) : timesClicked > 0 ? (
              <div data-testid="click-count">Click count: {timesClicked}</div>
            ) : null}
            <button onClick={toggle.reset}>Reset</button>
          </div>
        )}
      </Toggle>
    )
  }
}

export {Toggle, Usage}
