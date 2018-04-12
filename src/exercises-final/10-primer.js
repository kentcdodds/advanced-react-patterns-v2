// control props primer

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
          this.props.onToggle(this.getState().on)
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
    const {toggle1Ref, toggle2Ref} = this.props
    return (
      <div>
        <Toggle on={bothOn} onToggle={this.handleToggle} ref={toggle1Ref} />
        <Toggle on={bothOn} onToggle={this.handleToggle} ref={toggle2Ref} />
      </div>
    )
  }
}
Usage.title = 'Control Props (primer)'

export {Toggle, Usage as default}
