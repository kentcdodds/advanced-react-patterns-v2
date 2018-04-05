import React from 'react'
import {renderToggle, Simulate} from '../../test/utils'
import {Usage} from '../exercises-final/09'
// import {Usage} from '../exercises/09'

test('renders a toggle component', () => {
  const handleToggle = jest.fn()
  const {toggleButton, toggle} = renderToggle(<Usage onToggle={handleToggle} />)
  expect(toggleButton).toBeOff()
  toggle()
  expect(toggleButton).toBeOn()
  expect(handleToggle).toHaveBeenCalledTimes(1)
  expect(handleToggle).toHaveBeenCalledWith(true)
})

test('can click too much', () => {
  const handleToggle = jest.fn()
  const handleReset = jest.fn()
  let toggleInstance
  const {
    toggleButton,
    toggle,
    getByTestId,
    queryByTestId,
    getByText,
  } = renderToggle(
    <Usage
      onToggle={handleToggle}
      onReset={handleReset}
      toggleRef={t => (toggleInstance = t)}
    />,
  )
  expect(toggleButton).toBeOff()
  toggle() // 1
  expect(toggleButton).toBeOn()
  toggle() // 2
  expect(toggleButton).toBeOff()
  expect(getByTestId('click-count').textContent).toContain('2')
  toggle() // 3
  expect(toggleButton).toBeOn()
  toggle() // 4
  expect(toggleButton).toBeOff()
  toggle() // 5: Whoa, too many
  expect(toggleButton).toBeOff()
  toggle() // 6
  expect(toggleButton).toBeOff()
  Simulate.click(getByText('Force Toggle')) // 7
  expect(toggleButton).toBeOn()

  expect(getByTestId('notice')).not.toBeNull()
  expect(handleToggle).toHaveBeenCalledTimes(7)
  expect(handleToggle.mock.calls).toEqual([
    [true], // 1
    [false], // 2
    [true], // 3
    [false], // 4
    [false], // 5
    [false], // 6
    [true], // 7
  ])

  Simulate.click(getByText('reset'))
  expect(handleReset).toHaveBeenCalledTimes(1)
  expect(handleReset).toHaveBeenCalledWith(false)
  expect(queryByTestId('notice')).toBeNull()

  expect(toggleButton).toBeOff()
  toggle()
  expect(toggleButton).toBeOn()

  expect(getByTestId('click-count').textContent).toContain('1')
  // normally I wouldn't test like this
  // I just want to make sure that you aren't including the `type`
  // in your state by mistake!
  try {
    expect(toggleInstance.state).toEqual({on: true})
  } catch (error) {
    if (toggleInstance.state.type) {
      console.log(
        `You are including type in the state and it shouldn't be included. Make sure your internalSetState method removes the type before returning the new state. Also make sure that the only place you call setState is within your internalSetState method.`,
      )
    }
    throw error
  }
})
