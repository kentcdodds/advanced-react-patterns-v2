import React, {Fragment} from 'react'
import {Switch} from '../switch'

//*
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
    const {onContent, offContent} = this.props
    return (
      <Fragment>
        {on ? onContent : offContent}
        <Switch on={on} onClick={this.toggle} />
      </Fragment>
    )
  }
}
/**/

//*
function Usage({onToggle = (...args) => console.log('onToggle', ...args)}) {
  return (
    <Toggle
      onToggle={onToggle}
      onContent="The button is on"
      offContent="The button is off"
    />
  )
}
/**/

/*
// what happens when you want to change where the content appears?
function Usage({onToggle = (...args) => console.log('onToggle', ...args)}) {
  return (
    <Toggle
      onToggle={onToggle}
      onContent="The button is on"
      offContent="The button is off"
      contentPosition="bottom"
    />
  )
}
/**/

/*
// what if you want the on and off content position in different places?
function Usage({onToggle = (...args) => console.log('onToggle', ...args)}) {
  return (
    <Toggle
      onToggle={onToggle}
      onContent="The button is on"
      offContent="The button is off"
      onContentPosition="top"
      offContentPosition="bottom"
    />
  )
}
/**/

// Oh, and what about a custom button!?

/*

// Here's the solution

class Toggle extends React.Component {
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  render() {
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
    })
  }
}

function Usage({onToggle = (...args) => console.log('onToggle', ...args)}) {
  return (
    <Toggle onToggle={onToggle}>
      {({on, toggle}) => (
        <Fragment>
          {on ? 'The button is on' : 'The button is off'}
          <Switch on={on} onClick={toggle} />
        </Fragment>
      )}
    </Toggle>
  )
}


/**/

/*
// In addition, you can implement the old API on top of the new one!

function OldToggle({
  onToggle,
  onContent,
  offContent,
  onContentPosition = 'top',
  offContentPosition = 'top',
}) {
  return (
    <Toggle onToggle={onToggle}>
      {({on, toggle}) => (
        <Fragment>
          {on ? (onContentPosition === 'top' ? onContent : null) : null}
          {on ? null : offContentPosition === 'top' ? offContent : null}
          <Switch on={on} onClick={toggle} />
          {on ? (onContentPosition === 'bottom' ? onContent : null) : null}
          {on ? null : offContentPosition === 'bottom' ? offContent : null}
        </Fragment>
      )}
    </Toggle>
  )
}

function OldUsage({onToggle = (...args) => console.log('onToggle', ...args)}) {
  return (
    <OldToggle
      onToggle={onToggle}
      onContent="The button is on"
      offContent="The button is off"
      onContentPosition="top"
      offContentPosition="bottom"
    />
  )
}
/**/

export {Toggle, Usage as default}
