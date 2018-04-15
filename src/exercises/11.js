// Provider Pattern

import React from 'react'
import {Switch} from '../switch'

// 🎁 I made this for you. You're welcome :)
const ToggleContext = React.createContext({
  on: false,
  toggle: () => {},
  reset: () => {},
  getTogglerProps: () => ({}),
})

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
    onToggle: () => {},
    onStateChange: () => {},
    stateReducer: (state, changes) => changes,
  }
  static stateChangeTypes = {
    reset: '__toggle_reset__',
    toggle: '__toggle_toggle__',
  }
  initialState = {
    on: this.props.initialOn,
    // Ok, just trust me on this one... You're going to need to
    // put everything into `state` that we want to provide to our consumers.
    // That means we need to include the `reset`, `toggle`, and `getTogglerProps`
    // functions in our `state`. I know, it's kinda messed up, but it
    // will help us avoid unnecessary re-renders so it'll be better
    // in the end.
    //
    // 🐨 Move the `reset`, `toggle`, and `getTogglerProps` method assignments
    // above this `initialState` assignments, and include them here
    //
    // 💰 `reset: this.reset` etc...
  }
  state = this.initialState
  isControlled(prop) {
    return this.props[prop] !== undefined
  }
  getState(state = this.state) {
    return Object.entries(state).reduce((combinedState, [key, value]) => {
      if (this.isControlled(key)) {
        combinedState[key] = this.props[key]
      } else {
        combinedState[key] = value
      }
      return combinedState
    }, {})
  }
  internalSetState(changes, callback = () => {}) {
    let allChanges
    this.setState(
      state => {
        const combinedState = this.getState(state)
        const stateToSet = [changes]
          // handle function setState call
          .map(c => (typeof c === 'function' ? c(combinedState) : c))
          // apply state reducer
          .map(c => this.props.stateReducer(combinedState, c))
          // store the whole changes object for use in the callback
          .map(c => (allChanges = c))
          // remove the controlled props
          .map(c =>
            Object.keys(state).reduce((newChanges, stateKey) => {
              if (!this.isControlled(stateKey)) {
                newChanges[stateKey] = c.hasOwnProperty(stateKey)
                  ? c[stateKey]
                  : combinedState[stateKey]
              }
              return newChanges
            }, {}),
          )[0]
        return Object.keys(stateToSet).length ? stateToSet : null
      },
      () => {
        // We're going to remove the getStateAndHelpers because the state
        // and helpers all live in the `state` anyway.
        // 🐨 Replace `this.getStateAndHelpers()` with `this.state`
        // call onStateChange with all the changes (including the type)
        this.props.onStateChange(allChanges, this.getStateAndHelpers())
        callback()
      },
    )
  }
  reset = () =>
    this.internalSetState(
      {...this.initialState, type: Toggle.stateChangeTypes.reset},
      () => this.props.onReset(this.getState()),
    )
  toggle = ({type = Toggle.stateChangeTypes.toggle} = {}) =>
    this.internalSetState(
      ({on}) => ({type, on: !on}),
      () => this.props.onToggle(this.getState()),
    )
  getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, () => this.toggle()),
    'aria-expanded': this.getState().on,
    ...props,
  })
  // 🐨 remove `getStateAndHelpers` because all of our state and helpers
  // are available directly from `state` now.
  getStateAndHelpers() {
    return {
      ...this.getState(),
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    }
  }
  render() {
    // Now we'll be exposing the state and helpers via React's context API.
    // 1) 🐨 replace this line with a usage of <ToggleContext.Provider> where
    // the value is `this.state` and the children is `this.props.children`.
    return this.props.children(this.getStateAndHelpers())
    // NOTE: this actually breaks the render prop API. We could preserve
    // it but I didn't want to add any more complexity to this.
    // 💯 Feel free to try to preserve the existing render prop API if you want.
  }
}

/////////////////////////////////////////////////////////
//
// You shouldn't have to change anything below this point
//
/////////////////////////////////////////////////////////

function Nav() {
  return (
    <ToggleContext.Consumer>
      {toggle => (
        <nav style={{flex: 1}}>
          <ul
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              listStyle: 'none',
              paddingLeft: '0',
            }}
          >
            <li>
              <a href="index.html">{toggle.on ? '🏡' : 'Home'}</a>
            </li>
            <li>
              <a href="/about/">{toggle.on ? '❓' : 'About'}</a>
            </li>
            <li>
              <a href="/blog/">{toggle.on ? '📖' : 'Blog'}</a>
            </li>
          </ul>
        </nav>
      )}
    </ToggleContext.Consumer>
  )
}

function NavSwitch() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div>
        <ToggleContext.Consumer>
          {toggle => (toggle.on ? '🦄' : 'Enable Emoji')}
        </ToggleContext.Consumer>
      </div>
      <ToggleContext.Consumer>
        {toggle => (
          <Switch
            {...toggle.getTogglerProps({
              on: toggle.on,
            })}
          />
        )}
      </ToggleContext.Consumer>
    </div>
  )
}

function Header() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Nav />
        <NavSwitch />
      </div>
    </div>
  )
}

function Subtitle() {
  return (
    <ToggleContext.Consumer>
      {toggle => (toggle.on ? '👩‍🏫 👉 🕶' : 'Teachers are awesome')}
    </ToggleContext.Consumer>
  )
}

function Title() {
  return (
    <div>
      <h1>
        <ToggleContext.Consumer>
          {toggle => `Who is ${toggle.on ? '🕶❓' : 'awesome?'}`}
        </ToggleContext.Consumer>
      </h1>
      <Subtitle />
    </div>
  )
}

function Article() {
  return (
    <div>
      <ToggleContext.Consumer>
        {toggle =>
          [
            'Once, I was in',
            toggle.on ? '🏫‍' : 'school',
            'when I',
            toggle.on ? '🤔' : 'realized',
            'something...',
          ].join(' ')
        }
      </ToggleContext.Consumer>
      <hr />
      <ToggleContext.Consumer>
        {toggle =>
          [
            'Without',
            toggle.on ? '👩‍🏫' : 'teachers',
            `I wouldn't know anything so`,
            toggle.on ? '🙏' : 'thanks',
            toggle.on ? '👩‍🏫❗️' : 'teachers!',
          ].join(' ')
        }
      </ToggleContext.Consumer>
    </div>
  )
}

function Post() {
  return (
    <div>
      <Title />
      <Article />
    </div>
  )
}

function Usage() {
  return (
    <Toggle>
      <div>
        <Header />
        <Post />
      </div>
    </Toggle>
  )
}
Usage.title = 'Provider Pattern'

export {Toggle, Usage as default}

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
