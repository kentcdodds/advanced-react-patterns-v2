// Rendux

// TODO: improve the provider so it doesn't
// create a new object on every render

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'
import * as redux from 'redux'
import {Switch} from '../switch'
import {renderApp} from '../render-app'

const RenduxContext = React.createContext({})

class Rendux extends React.Component {
  static defaultProps = {
    initialState: {},
    onUpdate: () => {},
    onReset: () => {},
    reducer: state => state,
  }
  initialState = this.props.initialState
  rootReducer = (state, action) => {
    if (action.type === '__RENDUX_RESET__') {
      return this.initialState
    }
    return this.props.reducer(state, action)
  }
  store = redux.createStore(this.rootReducer, this.initialState)
  state = this.initialState
  reset = () => {
    if (this.isStateControlled()) {
      this.props.onReset(this.initialState)
    } else {
      this.store.dispatch({
        type: '__RENDUX_RESET__',
      })
    }
  }
  componentDidMount() {
    this.unsubscribe = this.store.subscribe(() =>
      this.setState(this.store.getState()),
    )
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  isStateControlled() {
    return this.props.state !== undefined
  }
  render() {
    return this.props.render({
      state: this.isStateControlled()
        ? this.props.state
        : this.store.getState(),
      dispatch: this.store.dispatch,
      reset: this.reset,
    })
  }
}

class RenduxProvider extends React.Component {
  render() {
    const {children, ...remainingProps} = this.props
    return (
      <Rendux
        {...remainingProps}
        render={rendux => (
          <RenduxContext.Provider value={rendux}>
            {children}
          </RenduxContext.Provider>
        )}
      />
    )
  }
}
function ConnectedRendux(props, context) {
  return (
    <RenduxContext.Consumer>
      {rendux => props.render(rendux)}
    </RenduxContext.Consumer>
  )
}
function withRendux(Component) {
  function Wrapper(props, context) {
    const {innerRef, ...remainingProps} = props
    return (
      <ConnectedRendux
        render={rendux => (
          <Component {...remainingProps} rendux={rendux} ref={innerRef} />
        )}
      />
    )
  }
  Wrapper.displayName = `withRendux(${Component.displayName || Component.name})`
  Wrapper.propTypes = {innerRef: PropTypes.func}
  Wrapper.WrappedComponent = Component
  return hoistNonReactStatics(Wrapper, Component)
}
class UpdateBlocker extends React.Component {
  shouldComponentUpdate() {
    return false
  }
  render() {
    return this.props.children
  }
}
function MyInput() {
  return (
    <ConnectedRendux
      render={rendux => (
        <input
          defaultValue={rendux.state.on ? 'on' : 'off'}
          placeholder="Type 'off' or 'on'"
          onChange={event => {
            if (event.target.value === 'on') {
              rendux.dispatch({
                type: 'toggle',
                value: true,
              })
            } else if (event.target.value === 'off') {
              rendux.dispatch({
                type: 'toggle',
                value: false,
              })
            }
            rendux.dispatch({
              type: 'input_change',
              value: event.target.value,
            })
          }}
        />
      )}
    />
  )
}
function MySwitch() {
  return (
    <ConnectedRendux
      render={rendux => (
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <Switch
            on={rendux.state.on}
            onClick={() =>
              rendux.dispatch({
                type: 'toggle',
                value: !rendux.state.on,
              })
            }
          />
        </div>
      )}
    />
  )
}
function StatePrinter() {
  return (
    <ConnectedRendux
      render={rendux => (
        <div style={{textAlign: 'left'}}>
          state:
          <pre>{JSON.stringify(rendux.state, null, 2)}</pre>
        </div>
      )}
    />
  )
}
function App() {
  return (
    <RenduxProvider
      initialState={{on: true}}
      reducer={(state, action) => {
        switch (action.type) {
          case 'toggle':
            return {
              ...state,
              on: action.value,
            }
          case 'input_change':
            return {
              ...state,
              inputValue: action.value,
            }
          default:
            return state
        }
      }}
    >
      <UpdateBlocker>
        <MyInput />
        <MySwitch />
        <StatePrinter />
      </UpdateBlocker>
    </RenduxProvider>
  )
}

renderApp(<App />)
