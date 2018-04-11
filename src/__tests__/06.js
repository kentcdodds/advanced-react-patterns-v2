import React from 'react'
import {renderToggle, Simulate} from '../../test/utils'
import Usage from '../exercises-final/06'
// import Usage from '../exercises/06'

test('renders a toggle component', () => {
  const handleToggle = jest.fn()
  const {toggleButton, toggle} = renderToggle(
    <Usage onButtonClick={() => {}} onToggle={handleToggle} />,
  )
  expect(toggleButton).toBeOff()
  toggle()
  expect(toggleButton).toBeOn()
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
})

test('can also toggle with the custom button', () => {
  const handleToggle = jest.fn()
  const {toggleButton, getByLabelText} = renderToggle(
    <Usage onButtonClick={() => {}} onToggle={handleToggle} />,
  )
  expect(toggleButton).toBeOff()
  Simulate.click(getByLabelText('custom-button'))
  expect(toggleButton).toBeOn()
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
})

test('passes custom props to the custom-button', () => {
  const handleCustomButtonClick = jest.fn()
  const handleToggle = jest.fn()
  const {getByLabelText, toggleButton} = renderToggle(
    <Usage onButtonClick={handleCustomButtonClick} onToggle={handleToggle} />,
  )
  const customButton = getByLabelText('custom-button')
  expect(customButton.getAttribute('id')).toBe('custom-button-id')

  Simulate.click(customButton)

  expect(toggleButton).toBeOn()
  expect(handleCustomButtonClick).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
})
