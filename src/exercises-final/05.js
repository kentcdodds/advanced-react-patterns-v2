// prop collections

import React from 'react'
import ReactDOM from 'react-dom'
import Switch from '../switch'
import renderApp from '../render-app'

class Toggle extends React.Component {
  static defaultProps = {onToggle: () => {}}
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  render() {
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle,
      togglerProps: {
        'aria-expanded': this.state.on,
        onClick: this.toggle,
      },
    })
  }
}

function App() {
  return (
    <Toggle
      onToggle={on => console.log('toggle', on)}
      render={({on, toggle, togglerProps}) => (
        <div>
          <Switch on={on} {...togglerProps} />
          <hr />
          <button {...togglerProps}>{on ? 'on' : 'off'}</button>
        </div>
      )}
    />
  )
}

renderApp(<App />)
