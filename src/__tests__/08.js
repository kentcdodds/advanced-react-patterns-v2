import React from 'react'
import {renderToggle, Simulate} from '../../test/utils'
import {Usage} from '../exercises-final/08'
// import {Usage} from '../exercises/08'

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

test('can click too much', () => {
  const handleToggle = jest.fn()
  const handleReset = jest.fn()
  const {
    assertOn,
    assertOff,
    toggle,
    getByTestId,
    queryByTestId,
    getByText,
  } = renderToggle(<Usage onToggle={handleToggle} onReset={handleReset} />)
  assertOff()
  toggle() // 1
  assertOn()
  toggle() // 2
  assertOff()
  expect(getByTestId('click-count').textContent).toContain('2')
  toggle() // 3
  assertOn()
  toggle() // 4
  assertOff()
  toggle() // 5: Whoa, too many
  assertOff()
  toggle() // 6
  assertOff()

  expect(getByTestId('notice')).not.toBeNull()
  expect(handleToggle).toHaveBeenCalledTimes(6)
  expect(handleToggle.mock.calls).toEqual([
    [true], // 1
    [false], // 2
    [true], // 3
    [false], // 4
    [false], // 5
    [false], // 6
  ])

  Simulate.click(getByText('reset'))
  expect(handleReset).toHaveBeenCalledTimes(1)
  expect(handleReset).toHaveBeenCalledWith(false)
  expect(queryByTestId('notice')).toBeNull()

  assertOff()
  toggle()
  assertOn()

  expect(getByTestId('click-count').textContent).toContain('1')
})
