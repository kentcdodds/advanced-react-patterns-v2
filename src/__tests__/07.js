import React from 'react'
import {renderToggle, Simulate} from '../../test/utils'
import Usage from '../exercises-final/07'
// import Usage from '../exercises/07'

test('renders a toggle component', () => {
  const handleToggle = jest.fn()
  const {toggleButton, toggle} = renderToggle(<Usage onToggle={handleToggle} />)
  expect(toggleButton).toBeOff()
  toggle()
  expect(toggleButton).toBeOn()
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
})

test('can reset the state of the toggle', () => {
  const handleReset = jest.fn()
  const {toggleButton, toggle, getByText} = renderToggle(
    <Usage onToggle={() => {}} onReset={handleReset} />,
  )
  toggle()
  Simulate.click(getByText('Reset'))
  expect(toggleButton).toBeOff()
  expect(handleReset).toHaveBeenCalledTimes(1)
  expect(handleReset).toHaveBeenCalledWith(false)
})
