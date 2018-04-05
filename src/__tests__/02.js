import React from 'react'
import {renderToggle} from '../../test/utils'
import {Usage} from '../exercises-final/02'
// import {Usage} from '../exercises/02'

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
