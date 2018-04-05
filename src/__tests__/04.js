import React from 'react'
import {renderToggle, Simulate} from '../../test/utils'
import {Usage} from '../exercises-final/04'
// import {Usage} from '../exercises/04'

test('renders a toggle component', () => {
  const handleToggle = jest.fn()
  const {assertOn, assertOff, toggle} = renderToggle(
    <Usage onToggle={handleToggle} />,
  )
  assertOff()
  toggle()
  assertOn()
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
})

test('can also toggle with the button', () => {
  const handleToggle = jest.fn()
  const {assertOn, assertOff, getByLabelText} = renderToggle(
    <Usage onToggle={handleToggle} />,
  )
  assertOff()
  Simulate.click(getByLabelText('custom-button'))
  assertOn()
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
})
