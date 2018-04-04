import React from 'react'
import {render, Simulate} from 'react-testing-library'
import Toggle from '../exercises-final/01'

const isOn = input => input.getAttribute('aria-expanded') === 'true' && input.classList.contains('toggle-btn-on')

test('renders a toggle component', () => {
  const {container, getByLabelText} = render(<Toggle />)
  const input = getByLabelText('Toggle')
  expect(isOn(input)).toBe(false)
  Simulate.click(getByLabelText('Toggle'))
  expect(isOn(input)).toBe(true)
})

