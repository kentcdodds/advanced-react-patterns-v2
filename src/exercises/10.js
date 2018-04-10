// Control Props + with a state reducer

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
    // Now that a user can use this component effectively without
    // an `onToggle` prop (they can use `onStateChange` instead)
    // let's provide a default for `onToggle` and `onStateChange`
    stateReducer: (state, changes) => changes,
  }
  static stateChangeTypes = {
    reset: '__toggle_reset__',
    toggle: '__toggle_toggle__',
  }
  initialState = {on: this.props.initialOn}
  state = this.initialState
  // TODO: let's add an `isControlled` method that accepts a state key
  // (string) and returns true if the prop is controlled
  // (this.props[prop] !== undefined)
  //
  // We'll need a `getState` method here that returns a state object
  // which has properties
  internalSetState(changes, callback) {
    this.setState(state => {
      const stateToSet = [changes]
        // handle function setState call
        .map(c => (typeof c === 'function' ? c(state) : c))
        // apply state reducer
        .map(c => this.props.stateReducer(state, c))
        // now we actually need to store the whole changes
        // object for use in the callback.
        // 🐨 create a variable above the `setState` call, then
        // add another map function here which simply accepts
        // the changes `c` and assigns `allChanges` to that value.
        //
        // Next, 🐨 replace this map function with a new one that's
        // responsible for taking the changes and returning an object
        // that only has the changes for things that are not controlled.
        // 💰 make certain to keep the [0] in place!
        .map(({type: ignoredType, ...c}) => c)[0]
      // If the `stateToSet` is an empty object, we can avoid an
      // unecessary re-render by returning null.
      // 🐨 change this return to return null if the stateToSet is empty.
      return stateToSet
      // When the state has successfully been set, we need to call the
      // `onStateChange` prop (so users of the component know when they should
      // update their controlled state) in addition to the callback.
      // 🐨 replace the `callback` with a function which calls `onStateChange`
      // with your `allChanges` variable and then calls the callback
      // 🐨 in addition, it may be a good idea to default the callback to a
      // no-op function.
    }, callback)
  }

  reset = () =>
    this.internalSetState(
      {...this.initialState, type: Toggle.stateChangeTypes.reset},
      // 🐨 replace this.state with a call to this.getState()
      () => this.props.onReset(this.state.on),
    )
  toggle = ({type = Toggle.stateChangeTypes.toggle} = {}) =>
    this.internalSetState(
      ({on}) => ({type, on: !on}),
      // 🐨 replace this.state with a call to this.getState()
      () => this.props.onToggle(this.state.on),
    )
  getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, () => this.toggle()),
    // 🐨 replace this.state with a call to this.getState()
    'aria-expanded': this.state.on,
    ...props,
  })
  getStateAndHelpers() {
    return {
      // 🐨 replace this.state with a call to this.getState()
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

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
class Usage extends React.Component {
  static defaultProps = {
    onToggle: () => {},
    onReset: () => {},
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

// exporting Usage as default for codesandbox module view to work
export {Toggle, Usage, Usage as default}
