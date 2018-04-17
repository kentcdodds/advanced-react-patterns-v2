// Rendux

import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import * as redux from 'redux'
import {Switch} from '../switch'

const RenduxContext = React.createContext({})

class Rendux extends React.Component {
  static Consumer = RenduxContext.Consumer
  static defaultProps = {
    initialState: {},
    reducer: state => state,
  }
  initialReduxState = this.props.initialState
  rootReducer = (state, action) => {
    if (action.type === '__RENDUX_RESET__') {
      return this.initialReduxState
    }
    return this.props.reducer(state, action)
  }
  store = redux.createStore(this.rootReducer, this.initialReduxState)
  reset = () => {
    this.store.dispatch({
      type: '__RENDUX_RESET__',
    })
  }
  componentDidMount() {
    this.unsubscribe = this.store.subscribe(() =>
      this.setState({
        state: this.store.getState(),
      }),
    )
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  initialState = {
    state: this.props.initialState,
    dispatch: this.store.dispatch,
    reset: this.reset,
  }
  state = this.initialState
  render() {
    const {children} = this.props
    const ui = typeof children === 'function' ? children(this.state) : children
    return (
      <RenduxContext.Provider value={this.state}>{ui}</RenduxContext.Provider>
    )
  }
}

function withRendux(Component) {
  const Wrapper = React.forwardRef((props, ref) => (
    <Rendux.Consumer>
      {rendux => <Component {...props} rendux={rendux} ref={ref} />}
    </Rendux.Consumer>
  ))
  Wrapper.displayName = `withRendux(${Component.displayName || Component.name})`
  hoistNonReactStatics(Wrapper, Component)
  return Wrapper
}

function MyInput() {
  return (
    <Rendux.Consumer>
      {rendux => (
        <input
          value={rendux.state.inputValue || (rendux.state.on ? 'on' : 'off')}
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
    </Rendux.Consumer>
  )
}

function MySwitch() {
  return (
    <Rendux.Consumer>
      {rendux => (
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
    </Rendux.Consumer>
  )
}

const StatePrinter = withRendux(({rendux}) => (
  <div style={{textAlign: 'left'}}>
    state:
    <pre data-testid="printed-state">
      {JSON.stringify(rendux.state, null, 2)}
    </pre>
  </div>
))

function Usage() {
  return (
    <Rendux
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
      {({reset}) => (
        <React.Fragment>
          <MyInput />
          <MySwitch />
          <button onClick={reset}>reset</button>
          <StatePrinter />
        </React.Fragment>
      )}
    </Rendux>
  )
}
Usage.title = 'Bonus: Rendux'

export {Rendux, Usage, Usage as default}

/* eslint
"no-unused-vars": [
  "warn",
  {
    "argsIgnorePattern": "^_.+|^ignore.+",
    "varsIgnorePattern": "^_.+|^ignore.+",
    "args": "after-used"
  }
]
 */
