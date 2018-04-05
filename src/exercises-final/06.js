// prop getters

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
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
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
      getTogglerProps: this.getTogglerProps,
    })
  }
}

function Usage(props) {
  return (
    <Toggle onToggle={props.onToggle}>
      {({on, getTogglerProps}) => (
        <div>
          <Switch on={on} {...getTogglerProps()} />
          <hr />
          <button
            {...getTogglerProps({
              'aria-label': 'custom-button',
              onClick: props.handleCustomButtonClick,
              id: 'custom-button-id',
            })}
          >
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  )
}

export {Toggle, Usage}
