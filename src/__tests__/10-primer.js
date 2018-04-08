import React from 'react'
import {Simulate, renderToggle} from '../../test/utils'
import {Usage} from '../exercises-final/10-primer'
// import {Usage} from '../exercises/10-primer'

test('toggling either toggle toggles both', () => {
  const handleToggle = jest.fn()
  const {container} = renderToggle(<Usage onToggle={handleToggle} />)
  const buttons = container.querySelectorAll('button')
  const [toggleButton1, toggleButton2] = buttons
  Simulate.click(toggleButton1)
  expect(toggleButton1).toBeOn()
  expect(toggleButton2).toBeOn()
  Simulate.click(toggleButton2)
  expect(toggleButton1).toBeOff()
  expect(toggleButton2).toBeOff()
})
