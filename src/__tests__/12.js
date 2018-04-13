import React from 'react'
import {
  findAllInRenderedTree,
  isCompositeComponentWithType,
} from 'react-dom/test-utils'
import chalk from 'chalk'
import {renderToggle} from '../../test/utils'
import Usage, {Debug} from '../exercises-final/12'
// import Usage, {Debug} from '../exercises/12'

const findDebugInstance = (rootInstance, child) =>
  findAllInRenderedTree(rootInstance, c => {
    return isCompositeComponentWithType(c, Debug) && c.props.child === child
  })[0]

const getDebugChild = debugInstance => debugInstance._reactInternalFiber.child

test('renders a toggle component', () => {
  const {toggleButton, toggle, container, rootInstance} = renderToggle(
    <Usage />,
  )
  const debugInstance = findDebugInstance(rootInstance, 'subtitle')
  try {
    expect(debugInstance.childInstance.current).not.toBeNull()
    expect(debugInstance.childInstance.current.instanceProperty).toBe(true)
  } catch (error) {
    const helpfulMessage = chalk.red(
      `🚨  Make sure you're using React.forwardRef and passing the ref property to the rendered Component  🚨`,
    )
    error.message = `${helpfulMessage}\n\n${error.message}`
    throw error
  }
  const subtitleWrapperFiberNode = getDebugChild(debugInstance)
  try {
    expect(subtitleWrapperFiberNode.type).toMatchObject({
      displayName: 'withToggle(Subtitle)',
    })
  } catch (error) {
    const helpfulMessage = chalk.red(
      `🚨  Make sure you're adding a displayName prop to your Wrapper  🚨`,
    )
    error.message = `${helpfulMessage}\n\n${error.message}`
    throw error
  }
  try {
    expect(subtitleWrapperFiberNode.type).toMatchObject({
      emoji: '👩‍🏫 👉 🕶',
      text: 'Teachers are awesome',
    })
  } catch (error) {
    const helpfulMessage = chalk.red(
      `🚨  Make sure you use hoistNonReactStatics(Wrapper, Component)  🚨`,
    )
    error.message = `${helpfulMessage}\n\n${error.message}`
    throw error
  }
  expect(toggleButton).toBeOff()
  expect(container.firstChild).toMatchSnapshot()
  toggle()
  expect(toggleButton).toBeOn()
  expect(container.firstChild).toMatchSnapshot()
})

//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=react%20patterns&e=12&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
