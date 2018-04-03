// prop getters

import React from 'react'
import ReactDOM from 'react-dom'
import Switch from '../switch'
import renderApp from '../render-app'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {onToggle: () => {}}
  state = {on: false}
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
  render() {
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle,
      getTogglerProps: this.getTogglerProps,
    })
  }
}
function App() {
  return (
    <Toggle
      onToggle={on => console.log('toggle', on)}
      render={({on, toggle, getTogglerProps}) => (
        <div>
          <Switch on={on} {...getTogglerProps()} />
          <hr />
          <button
            {...getTogglerProps({
              onClick: () => alert('hi'),
              id: 'hi',
            })}
          >
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    />
  )
}

renderApp(<App />)
