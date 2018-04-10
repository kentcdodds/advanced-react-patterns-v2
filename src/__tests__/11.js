import React from 'react'
import {renderToggle} from '../../test/utils'
import Usage from '../exercises-final/11'
// import Usage from '../exercises/11'

test('renders a toggle component', () => {
  const {toggleButton, toggle, container} = renderToggle(<Usage />)
  expect(toggleButton).toBeOff()
  expect(container.firstChild).toMatchSnapshot()
  toggle()
  expect(toggleButton).toBeOn()
  expect(container.firstChild).toMatchSnapshot()
})
