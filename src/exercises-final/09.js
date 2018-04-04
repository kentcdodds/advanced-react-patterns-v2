// state reducer

import React from 'react'
import ReactDOM from 'react-dom'
import Switch from '../switch'
import renderApp from '../render-app'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    defaultOn: false,
    onToggle: () => {},
    onReset: () => {},
    stateReducer: (state, changes) => changes,
  }
  initialState = {on: this.props.defaultOn}
  state = this.initialState
  reset = () => {
    if (this.isOnControlled()) {
      this.props.onReset(!this.props.on)
    } else {
      this.internalSetState(this.initialState, () =>
        this.props.onReset(this.state.on),
      )
    }
  }
  internalSetState = (changes, callback) => {
    this.setState(state => {
      const stateToSet = [changes]
        // handle function setState call
        .map(c => (typeof c === 'function' ? c(state) : c))
        // apply state reducer
        .map(c => this.props.stateReducer(state, c))[0]
      // For more complicated components, you may also
      // consider having a type property on the changes
      // to give the state reducer more info.
      // see downshift for an example of this.
      return stateToSet
    }, callback)
  }
  toggle = () => {
    if (this.isOnControlled()) {
      this.props.onToggle(!this.props.on)
    } else {
      this.internalSetState(
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

class App extends React.Component {
  initialState = {timesClicked: 0}
  state = this.initialState
  handleToggle = () => {
    this.setState(({timesClicked}) => ({
      timesClicked: timesClicked + 1,
    }))
  }
  handleReset = () => {
    this.setState(this.initialState)
  }
  toggleStateReducer = (state, changes) => {
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
        render={toggle => (
          <div>
            <Switch
              {...toggle.getTogglerProps({
                on: toggle.on,
              })}
            />
            {timesClicked > 4 ? (
              <div>
                Whoa, you clicked too much!
                <br />
              </div>
            ) : timesClicked > 0 ? (
              <div>Click count: {timesClicked}</div>
            ) : null}
            <button onClick={toggle.reset}>reset</button>
          </div>
        )}
      />
    )
  }
}

renderApp(<App />)
