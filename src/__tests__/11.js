import React from 'react'
import {Switch} from '../switch'
import {renderToggle} from '../../test/utils'
import Usage, {Toggle} from '../exercises-final/11'
// import Usage, {Toggle} from '../exercises/11'

test('renders a toggle component', () => {
  const {toggleButton, toggle, container} = renderToggle(<Usage />)
  expect(toggleButton).toBeOff()
  expect(container.firstChild).toMatchSnapshot()
  toggle()
  expect(toggleButton).toBeOn()
  expect(container.firstChild).toMatchSnapshot()
})

test('can still use the render prop API', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const handleToggle = jest.fn()
  let toggleButton, toggle
  try {
    const utils = renderToggle(
      <Toggle onToggle={handleToggle}>
        {({on, toggle}) => <Switch on={on} onClick={toggle} />}
      </Toggle>,
    )
    toggleButton = utils.toggleButton
    toggle = utils.toggle
  } catch (error) {
    if (error.message.includes('Unable to find the Switch component.')) {
      console.log(
        `💯  If you'd like, go ahead and try to preserve the render prop API.`,
      )
      return
    }
    throw error
  }
  expect(toggleButton).toBeOff()
  toggle()
  expect(toggleButton).toBeOn()
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
  console.error.mockRestore()
})

//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=react%20patterns&e=11&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
