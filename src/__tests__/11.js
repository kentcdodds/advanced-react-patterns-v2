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
  const handleToggle = jest.fn()
  const {toggleButton, toggle} = renderToggle(
    <Toggle onToggle={handleToggle}>
      {({on, toggle}) => <Switch on={on} onClick={toggle} />}
    </Toggle>,
  )
  expect(toggleButton).toBeOff()
  toggle()
  expect(toggleButton).toBeOn()
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
})
