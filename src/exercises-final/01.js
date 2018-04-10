import React from 'react'
import {Switch} from '../switch'

class Toggle extends React.Component {
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => {
        this.props.onToggle(this.state.on)
      },
    )
  render() {
    const {on} = this.state
    return <Switch on={on} onClick={this.toggle} />
  }
}

function Usage(
  props = {
    onToggle: (...args) => console.log('onToggle', ...args),
  },
) {
  return <Toggle onToggle={props.onToggle} />
}

// exporting Usage as default for codesandbox module view to work
export {Toggle, Usage, Usage as default}
