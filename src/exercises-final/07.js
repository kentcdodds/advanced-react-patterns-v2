// State Initializers

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Switch from '../switch'
import renderApp from '../render-app'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    defaultOn: false,
    onToggle: () => {},
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
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    })
  }
}

function App() {
  return (
    <Toggle
      defaultOn={true}
      onToggle={on => console.log('toggle', on)}
      onReset={on => console.log('reset', on)}
      render={toggle => (
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
    />
  )
}

renderApp(<App />)
