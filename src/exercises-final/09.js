// Control Props

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    defaultOn: false,
    onToggle: () => {},
    onReset: () => {},
  }
  initialState = {on: this.props.defaultOn}
  state = this.initialState
  reset = () => {
    if (this.isOnControlled()) {
      this.props.onReset(!this.props.on)
    } else {
      this.setState(this.initialState, () => this.props.onReset(this.state.on))
    }
  }
  toggle = () => {
    if (this.isOnControlled()) {
      this.props.onToggle(!this.props.on)
    } else {
      this.setState(
        ({on}) => ({on: !on}),
        () => this.props.onToggle(this.state.on),
      )
    }
  }
  getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, this.toggle),
    'aria-expanded': this.state.on,
    ...props,
  })
  isOnControlled() {
    return this.props.on !== undefined
  }
  render() {
    return this.props.render({
      on: this.isOnControlled() ? this.props.on : this.state.on,
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    })
  }
}

class Usage extends React.Component {
  initialState = {timesClicked: 0, on: false}
  state = this.initialState
  handleToggle = () => {
    this.setState(({timesClicked, on}) => ({
      timesClicked: timesClicked + 1,
      on: timesClicked >= 4 ? false : !on,
    }))
  }
  handleReset = () => {
    this.setState(this.initialState)
  }
  render() {
    const {timesClicked, on} = this.state
    return (
      <Toggle on={on} onToggle={this.handleToggle} onReset={this.handleReset}>
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
