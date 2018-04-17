// Control Props + with a state reducer

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
  internalSetState(changes, callback = () => {}) {
    let allChanges
    this.setState(
      state => {
        const combinedState = this.getState(state)
        // handle function setState call
        const changesObject =
          typeof changes === 'function' ? changes(combinedState) : changes

        // apply state reducer
        allChanges = this.props.stateReducer(combinedState, changesObject) || {}

        // remove the type so it's not set into state
        const {type: ignoredType, ...onlyChanges} = allChanges

        const nonControlledChanges = Object.keys(combinedState).reduce(
          (newChanges, stateKey) => {
            if (!this.isControlled(stateKey)) {
              newChanges[stateKey] = onlyChanges.hasOwnProperty(stateKey)
                ? onlyChanges[stateKey]
                : combinedState[stateKey]
            }
            return newChanges
          },
          {},
        )

        // return null if there are no changes to be made
        return Object.keys(nonControlledChanges || {}).length
          ? nonControlledChanges
          : null
      },
      () => {
        // call onStateChange with all the changes (including the type)
        this.props.onStateChange(allChanges, this.getStateAndHelpers())
        callback()
      },
    )
  }
  reset = () =>
    this.internalSetState(
      {...this.initialState, type: Toggle.stateChangeTypes.reset},
      () => this.props.onReset(this.getState().on),
    )
  toggle = ({type = Toggle.stateChangeTypes.toggle} = {}) =>
    this.internalSetState(
      ({on}) => ({type, on: !on}),
      () => this.props.onToggle(this.getState().on),
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
    onToggle: (...args) => console.log('onToggle', ...args),
    onReset: (...args) => console.log('onReset', ...args),
  }
  initialState = {timesClicked: 0, toggleOn: false}
  state = this.initialState
  handleStateChange = changes => {
    if (changes.type === 'forced') {
      this.setState({toggleOn: changes.on}, () =>
        this.props.onToggle(this.state.toggleOn),
      )
    } else if (changes.type === Toggle.stateChangeTypes.reset) {
      this.setState(this.initialState, () => {
        this.props.onReset(this.state.toggleOn)
      })
    } else if (changes.type === Toggle.stateChangeTypes.toggle) {
      this.setState(
        ({timesClicked}) => ({
          timesClicked: timesClicked + 1,
          toggleOn: timesClicked >= 4 ? false : changes.on,
        }),
        () => {
          this.props.onToggle(this.state.toggleOn)
        },
      )
    }
  }
  render() {
    const {timesClicked, toggleOn} = this.state
    return (
      <Toggle
        on={toggleOn}
        onStateChange={this.handleStateChange}
        ref={this.props.toggleRef}
      >
        {({on, toggle, reset, getTogglerProps}) => (
          <div>
            <Switch
              {...getTogglerProps({
                on: on,
              })}
            />
            {timesClicked > 4 ? (
              <div data-testid="notice">
                Whoa, you clicked too much!
                <br />
                <button onClick={() => toggle({type: 'forced'})}>
                  Force Toggle
                </button>
                <br />
              </div>
            ) : timesClicked > 0 ? (
              <div data-testid="click-count">Click count: {timesClicked}</div>
            ) : null}
            <button onClick={reset}>Reset</button>
          </div>
        )}
      </Toggle>
    )
  }
}
Usage.title = 'Control Props with State Reducers'

export {Toggle, Usage as default}

/* eslint
"no-unused-vars": [
  "warn",
  {
    "argsIgnorePattern": "^_.+|^ignore.+",
    "varsIgnorePattern": "^_.+|^ignore.+",
    "args": "after-used"
  }
]
 */
