import React from 'react'
import {renderToggle, Simulate} from '../../test/utils'
import Usage from '../exercises-final/13'
// import Usage from '../exercises/13'

function renderRendux() {
  const utils = renderToggle(<Usage />)
  const printedState = utils.getByTestId('printed-state')
  const input = utils.getByPlaceholderText('Type')
  return {
    getPrintedState: () => JSON.parse(printedState.textContent),
    input,
    changeInputValue: (value, extraEventProps) =>
      Simulate.change(input, {target: {value}, ...extraEventProps}),
    ...utils,
  }
}

test('toggle and input state interact', () => {
  const {
    toggleButton,
    getPrintedState,
    changeInputValue,
    getByText,
    input,
  } = renderRendux(<Usage />)
  expect(toggleButton).toBeOn()
  expect(getPrintedState()).toEqual({
    on: true,
  })
  changeInputValue('off')
  expect(toggleButton).toBeOff()
  expect(getPrintedState()).toEqual({
    on: false,
    inputValue: 'off',
  })
  Simulate.click(getByText('reset'))
  expect(toggleButton).toBeOn()
  expect(getPrintedState()).toEqual({
    on: true,
  })
  expect(input.value).toBe('on')
  changeInputValue('something else')
  expect(input.value).toBe('something else')
  expect(getPrintedState()).toEqual({
    on: true,
    inputValue: 'something else',
  })
})

//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=react%20patterns&e=13&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
