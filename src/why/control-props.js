import React from 'react'
// eslint-disable-next-line
import hoistNonReactStatics from 'hoist-non-react-statics'
import {Switch} from '../switch'

//*

class Toggle extends React.Component {
  state = {on: false}
  toggle = () => {
    this.setState(
      ({on}) => ({on: !on}),
      () => {
        this.props.onToggle(this.state.on)
      },
    )
  }
  render() {
    return <Switch on={this.state.on} onClick={this.toggle} />
  }
}

class Usage extends React.Component {
  state = {sync: true}
  handleToggle = on => {
    console.log('toggle', on)
  }
  toggleSync = () => {
    this.setState(({sync}) => ({sync: !sync}))
  }
  render() {
    return (
      <div>
        <div>
          <label>
            Sync{' '}
            <input
              type="checkbox"
              value={this.state.sync}
              onChange={this.toggleSync}
            />
          </label>
        </div>
        <Toggle onToggle={this.handleToggle} />
        <Toggle onToggle={this.handleToggle} />
      </div>
    )
  }
}
/**/

/*

class Toggle extends React.Component {
  state = {on: false}
  isOnControlled() {
    return this.props.on !== undefined
  }
  isOn() {
    return this.isOnControlled() ? this.props.on : this.state.on
  }
  toggle = () => {
    if (this.isOnControlled()) {
      this.props.onToggle(!this.isOn())
    } else {
      this.setState(
        ({on}) => ({on: !on}),
        () => {
          this.props.onToggle(this.isOn())
        },
      )
    }
  }
  render() {
    return <Switch on={this.isOn()} onClick={this.toggle} />
  }
}

class Usage extends React.Component {
  state = {bothOn: false, sync: true}
  handleToggle = on => {
    this.setState({bothOn: on})
  }
  toggleSync = () => {
    this.setState(({sync}) => ({sync: !sync}))
  }
  render() {
    const toggleProps = {onToggle: this.handleToggle}
    if (this.state.sync) {
      toggleProps.on = this.state.bothOn
    }
    return (
      <div>
        <div>
          <label>
            Sync{' '}
            <input
              type="checkbox"
              checked={this.state.sync}
              onClick={this.toggleSync}
            />
          </label>
        </div>
        <Toggle {...toggleProps} />
        <Toggle {...toggleProps} />
      </div>
    )
  }
}

/**/

export {Toggle, Usage as default}
