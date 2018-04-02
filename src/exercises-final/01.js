import '../index.css'
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
      () => {
        this.props.onToggle(this.state.on)
      },
    )
  render() {
    const {on} = this.state
    return <Switch on={on} onClick={this.toggle} />
  }
}

function App() {
  return <Toggle onToggle={on => console.log('toggle', on)} />
}

renderApp(<App />)
