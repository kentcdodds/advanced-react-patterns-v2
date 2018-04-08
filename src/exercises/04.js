// render props

import React from 'react'
import {Switch} from '../switch'

// we're back to basics here. Rather than compound components,
// let's use a render prop!
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
    // We want to give rendering flexibility, so we'll be making
    // a change to our render prop component here.
    // You'll notice the children prop in the Usage component
    // is a function. So you can replace this with a call this.props.children()
    // But you'll need to pass it an object with `on` and `toggle`.
    return <Switch on={on} onClick={this.toggle} />
  }
}

function Usage(props) {
  return (
    <Toggle onToggle={props.onToggle}>
      {({on, toggle}) => (
        <div>
          {on ? 'The button is on' : 'The button is off'}
          <Switch on={on} onClick={toggle} />
          <hr />
          <button aria-label="custom-button" onClick={toggle}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  )
}

export {Toggle, Usage}
