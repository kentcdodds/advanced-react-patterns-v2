// Control Props (with a state reducer)

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
    onToggle: () => {},
    onStateChange: () => {},
    stateReducer: (state, changes) => changes,
  }
  static stateChangeTypes = {
    reset: '__toggle_reset__',
    toggle: '__toggle_toggle__',
  }
  initialState = {on: this.props.initialOn}
  state = this.initialState
  isControlled(prop) {
    return this.props[prop] !== undefined
  }
  getState(state = this.state) {
    return Object.entries(state).reduce((combinedState, [key, value]) => {
      if (this.isControlled(key)) {
        combinedState[key] = this.props[key]
      } else {
        combinedState[key] = value
      }
      return combinedState
    }, {})
  }
  internalSetState = (changes, callback = () => {}) => {
    let changeType, allChanges
    this.setState(
      state => {
        const combinedState = this.getState(state)
        const stateToSet = [changes]
          // handle function setState call
          .map(c => (typeof c === 'function' ? c(combinedState) : c))
          // apply state reducer
          .map(c => this.props.stateReducer(combinedState, c))
          // remove the type so it's not set into state
          .map(({type, ...c}) => {
            changeType = type
            allChanges = c
            return c
          })
          // remove the controlled props
          .map(c =>
            Object.entries(c).reduce((newChanges, [key, value]) => {
              if (!this.isControlled(key)) {
                newChanges[key] = value
              }
              return newChanges
            }, {}),
          )[0]
        return Object.keys(stateToSet).length ? stateToSet : null
      },
      () => {
        this.props.onStateChange(
          {type: changeType, ...allChanges},
          this.getStateAndHelpers(),
        )
        callback()
      },
    )
  }
  reset = () =>
    this.internalSetState(
      {...this.initialState, type: Toggle.stateChangeTypes.reset},
      () => this.props.onReset(this.state.on),
    )
  toggle = ({type = Toggle.stateChangeTypes.toggle} = {}) =>
    this.internalSetState(
      ({on}) => ({type, on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, () => this.toggle()),
    'aria-expanded': this.getState().on,
    ...props,
  })
  getStateAndHelpers() {
    return {
      ...this.getState(),
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    }
  }
  render() {
    return this.props.children(this.getStateAndHelpers())
  }
}

class Usage extends React.Component {
  static defaultProps = {
    onToggle: () => {},
    onReset: () => {},
  }
  initialState = {timesClicked: 0, on: false}
  state = this.initialState
  handleStateChange = changes => {
    if (changes.type === 'forced') {
      this.setState({on: changes.on}, () => this.props.onToggle(this.state.on))
    } else if (changes.type === Toggle.stateChangeTypes.reset) {
      this.setState(this.initialState, () => {
        this.props.onReset(this.state.on)
      })
    } else if (changes.type === Toggle.stateChangeTypes.toggle) {
      this.setState(
        ({timesClicked}) => ({
          timesClicked: timesClicked + 1,
          on: timesClicked >= 4 ? false : changes.on,
        }),
        () => {
          this.props.onToggle(this.state.on)
        },
      )
    }
  }
  render() {
    const {timesClicked, on} = this.state
    return (
      <Toggle
        on={on}
        onStateChange={this.handleStateChange}
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
