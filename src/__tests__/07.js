import React from 'react'
import {renderToggle, Simulate} from '../../test/utils'
import {Usage} from '../exercises-final/07'
// import {Usage} from '../exercises/07'

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

test('can reset the state of the toggle', () => {
  const handleReset = jest.fn()
  const {assertOff, toggle, getByText} = renderToggle(
    <Usage onToggle={() => {}} onReset={handleReset} />,
  )
  toggle()
  Simulate.click(getByText('Reset'))
  assertOff()
  expect(handleReset).toHaveBeenCalledTimes(1)
  expect(handleReset).toHaveBeenCalledWith(false)
})
