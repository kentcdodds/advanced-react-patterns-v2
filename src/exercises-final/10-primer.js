// control props

import React from 'react'
import {Switch} from '../switch'

class Toggle extends React.Component {
  state = {on: false}
  isOnControlled() {
    return this.props.on !== undefined
  }
  getState() {
    return {
      on: this.isOnControlled() ? this.props.on : this.state.on,
    }
  }
  toggle = () => {
    if (this.isOnControlled()) {
      this.props.onToggle(!this.getState().on)
    } else {
      this.setState(
        ({on}) => ({on: !on}),
        () => {
          this.props.onToggle(this.state.on)
        },
      )
    }
  }
  render() {
    const {on} = this.getState()
    return <Switch on={on} onClick={this.toggle} />
  }
}

class Usage extends React.Component {
  state = {bothOn: false}
  handleToggle = on => {
    this.setState({bothOn: on})
  }
  render() {
    const {bothOn} = this.state
    return (
      <div>
        <Toggle on={bothOn} onToggle={this.handleToggle} />
        <Toggle on={bothOn} onToggle={this.handleToggle} />
      </div>
    )
  }
}

export {Toggle, Usage}
