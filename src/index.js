import React from 'react'
import ReactDOM from 'react-dom'
import loadable from 'react-loadable'
import {Route, Switch} from 'react-router'
import {BrowserRouter, Link} from 'react-router-dom'

const totalExercises = 13

class ComponentContainer extends React.Component {
  static getDerivedStateFromProps() {
    // if the props change then let's try rendering again...
    return {error: null}
  }
  state = {error: null}
  componentDidCatch(error, info) {
    console.log(error, info)
    this.setState({error})
  }
  render() {
    const {error} = this.state
    const {label, children, ...props} = this.props
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h2 style={{textAlign: 'center'}}>{label}</h2>
        <div
          style={{
            flex: 1,
            padding: 20,
            border: '1px solid',
            display: 'grid',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div {...props}>
            {error
              ? 'There was an error. Refresh to see the error overlay and click to open the error in your editor'
              : children}
          </div>
        </div>
      </div>
    )
  }
}

class ExerciseContainer extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return ExerciseContainer.getLoadables(nextProps)
  }
  static getLoadables(props) {
    return {
      LoadableComponent: loadable({
        loader: () =>
          import(`./exercises/${props.match.params.exerciseNumber}`),
        loading: () => <div>Loading...</div>,
        timeout: 2000,
      }),
      LoadableComponentFinal: loadable({
        loader: () =>
          import(`./exercises-final/${props.match.params.exerciseNumber}`),
        loading: () => <div>Loading...</div>,
        timeout: 2000,
      }),
    }
  }
  state = ExerciseContainer.getLoadables(this.props)
  render() {
    const current = Number(this.props.match.params.exerciseNumber)
    const previous =
      current - 1 < 1 ? null : (current - 1).toString().padStart(2, '0')
    const next =
      current + 1 > totalExercises
        ? null
        : (current + 1).toString().padStart(2, '0')
    return (
      <div
        style={{
          padding: 20,
          height: '100%',
          display: 'grid',
          gridGap: '20px',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 30px',
        }}
      >
        <ComponentContainer label="Exercise">
          <this.state.LoadableComponent />
        </ComponentContainer>
        <ComponentContainer label="Final Version">
          <this.state.LoadableComponentFinal />
        </ComponentContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gridColumn: 'span 2',
          }}
        >
          {previous ? (
            <Link to={previous}>
              {previous}{' '}
              <span role="img" aria-label="previous">
                👈
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link to={next}>
              <span role="img" aria-label="next">
                👉
              </span>{' '}
              {next}
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route
        path={`/:exerciseNumber`}
        exact={true}
        component={ExerciseContainer}
      />
      <Route
        render={() => (
          <div
            style={{
              height: '100%',
              display: 'grid',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>
              Sorry... nothing here. To open one of the exercises, go to{' '}
              <code>{`/exerciseNumber`}</code>, for example:{' '}
              <Link to="/01">
                <code>{`/01`}</code>
              </Link>
            </div>
          </div>
        )}
      />
    </Switch>
  </BrowserRouter>,
  document.getElementById('⚛️'),
)

// function routesForExercise(number) {
//   return (
//     <Fragment>
//       <Route
//         path={`/${number}`}
//         exact={true}
//         component={require(`./exercises/${number}`).default}
//       />
//       <Route
//         path={`/${number}-final`}
//         exact={true}
//         component={require(`./exercises-final/${number}`).default}
//       />
//     </Fragment>
//   )
// }

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
