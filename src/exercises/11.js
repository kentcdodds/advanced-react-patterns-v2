// Provider Pattern

import React from 'react'
import {Switch} from '../switch'

// 🐨 Create a ToggleContext here with React.createContext
// you'll need to provide a default value. Might I suggest
// an object with default values for all the properties
// of our render prop?

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
  // 🐨 Let's define another static property here called Consumer
  // so we don't have to expose the entire ToggleContext object.
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
        // handle function setState call
        const changesObject =
          typeof changes === 'function' ? changes(combinedState) : changes

        // apply state reducer
        allChanges = this.props.stateReducer(combinedState, changesObject) || {}

        // remove the type so it's not set into state
        const {type: ignoredType, ...onlyChanges} = allChanges

        const nonControlledChanges = Object.keys(combinedState).reduce(
          (newChanges, stateKey) => {
            if (!this.isControlled(stateKey)) {
              newChanges[stateKey] = onlyChanges.hasOwnProperty(stateKey)
                ? onlyChanges[stateKey]
                : combinedState[stateKey]
            }
            return newChanges
          },
          {},
        )

        // return null if there are no changes to be made
        return Object.keys(nonControlledChanges || {}).length
          ? nonControlledChanges
          : null
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
      () => this.props.onReset(this.getState().on),
    )
  toggle = ({type = Toggle.stateChangeTypes.toggle} = {}) =>
    this.internalSetState(
      ({on}) => ({type, on: !on}),
      () => this.props.onToggle(this.getState().on),
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
    <Toggle.Consumer>
      {toggle => (
        <nav>
          <ul>
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
    </Toggle.Consumer>
  )
}

function NavSwitch() {
  return (
    <div className="nav-switch">
      <div>
        <Toggle.Consumer>
          {toggle => (toggle.on ? '🦄' : 'Enable Emoji')}
        </Toggle.Consumer>
      </div>
      <Toggle.Consumer>
        {toggle => (
          <Switch
            {...toggle.getTogglerProps({
              on: toggle.on,
            })}
          />
        )}
      </Toggle.Consumer>
    </div>
  )
}

function Header() {
  return (
    <div className="header">
      <Nav />
      <NavSwitch />
    </div>
  )
}

function Subtitle() {
  return (
    <Toggle.Consumer>
      {toggle => (toggle.on ? '👩‍🏫 👉 🕶' : 'Teachers are awesome')}
    </Toggle.Consumer>
  )
}

function Title() {
  return (
    <div>
      <h1>
        <Toggle.Consumer>
          {toggle => `Who is ${toggle.on ? '🕶❓' : 'awesome?'}`}
        </Toggle.Consumer>
      </h1>
      <Subtitle />
    </div>
  )
}

function Article() {
  return (
    <div>
      <Toggle.Consumer>
        {toggle =>
          [
            'Once, I was in',
            toggle.on ? '🏫‍' : 'school',
            'when I',
            toggle.on ? '🤔' : 'realized',
            'something...',
          ].join(' ')
        }
      </Toggle.Consumer>
      <hr />
      <Toggle.Consumer>
        {toggle =>
          [
            'Without',
            toggle.on ? '👩‍🏫' : 'teachers',
            `I wouldn't know anything so`,
            toggle.on ? '🙏' : 'thanks',
            toggle.on ? '👩‍🏫❗️' : 'teachers!',
          ].join(' ')
        }
      </Toggle.Consumer>
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
      <div className="friends">
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
