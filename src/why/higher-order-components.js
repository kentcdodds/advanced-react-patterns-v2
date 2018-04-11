import React, {Fragment} from 'react'
// eslint-disable-next-line
import hoistNonReactStatics from 'hoist-non-react-statics'
import {Switch} from '../switch'

const ToggleContext = React.createContext({
  on: false,
  toggle: () => {},
})

class Toggle extends React.Component {
  static Consumer = ToggleContext.Consumer
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  state = {on: false, toggle: this.toggle}
  render() {
    const {children} = this.props
    const ui = typeof children === 'function' ? children(this.state) : children
    return (
      <ToggleContext.Provider value={this.state}>{ui}</ToggleContext.Provider>
    )
  }
}

//*

const Layer1 = () => <Layer2 />
const Layer2 = () => (
  <Toggle.Consumer>
    {({on}) => (
      <Fragment>
        {on ? 'The button is on' : 'The button is off'}
        <Layer3 />
      </Fragment>
    )}
  </Toggle.Consumer>
)
const Layer3 = () => <Layer4 />
const Layer4 = () => (
  <Toggle.Consumer>
    {({on, toggle}) => <Switch on={on} onClick={toggle} />}
  </Toggle.Consumer>
)

function Usage({onToggle = (...args) => console.log('onToggle', ...args)}) {
  return (
    <Toggle onToggle={onToggle}>
      <Layer1 />
    </Toggle>
  )
}
/**/

// Using that consumer everywhere can make things a bit verbose
// Higher Order Components can help with that a bit.

/*
function withToggle(Component) {
  const Wrapper = React.forwardRef((props, ref) => (
    <Toggle.Consumer>
      {toggle => <Component {...props} toggle={toggle} ref={ref} />}
    </Toggle.Consumer>
  ))
  Wrapper.displayName = `withToggle(${Component.displayName || Component.name})`
  hoistNonReactStatics(Wrapper, Component)
  return Wrapper
}

const Layer1 = () => <Layer2 />
const Layer2 = withToggle(({toggle: {on}}) => (
  <Fragment>
    {on ? 'The button is on' : 'The button is off'}
    <Layer3 />
  </Fragment>
))
const Layer3 = () => <Layer4 />
const Layer4 = withToggle(({toggle: {on, toggle}}) => (
  <Switch on={on} onClick={toggle} />
))

function Usage({onToggle = (...args) => console.log('onToggle', ...args)}) {
  return (
    <Toggle onToggle={onToggle}>
      <Layer1 />
    </Toggle>
  )
}

/**/

export {Toggle, Usage as default}
