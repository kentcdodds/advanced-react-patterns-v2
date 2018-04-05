import assert from 'assert'
import {render, Simulate, wait} from 'react-testing-library'

function renderToggle(ui) {
  const utils = render(ui)
  const toggleButton = utils.getByLabelText('Toggle')
  const input = utils.getByTestId('toggle-checkbox')
  const isOn = () => {
    const expanded = toggleButton.getAttribute('aria-expanded')
    if (expanded !== 'true') {
      return new Error(
        `The aria-expanded attribute on the switch button is ${JSON.stringify(
          expanded,
        )} but should be "true".`,
      )
    }
    const {classList} = toggleButton
    if (!classList.contains('toggle-btn-on')) {
      return new Error(
        `The classList on the switch button does not contain "toggle-btn-on" but it should. It is "${classList}".`,
      )
    }
    if (!input.checked) {
      return new Error(
        `The switch input does not have its "checked" property set to true, but it should be. It is ${
          input.checked
        }.`,
      )
    }
  }
  const isOff = () => {
    const expanded = toggleButton.getAttribute('aria-expanded')
    if (expanded === 'true') {
      return new Error(
        `The aria-expanded attribute on the switch button is ${JSON.stringify(
          expanded,
        )} but should not be.`,
      )
    }
    const {classList} = toggleButton
    if (!classList.contains('toggle-btn-off')) {
      return new Error(
        `The classList on the switch button does not contain "toggle-btn-off" but it should. It is "${classList}".`,
      )
    }
    if (input.checked) {
      return new Error(
        `The switch input does not have its "checked" property set to false, but it should be. It is ${
          input.checked
        }.`,
      )
    }
  }
  return {
    isOn,
    assertOn: () => {
      const error = isOn()
      if (error) {
        throw error
      }
    },
    assertOff: () => {
      const error = isOff()
      if (error) {
        throw error
      }
    },
    toggle: () => Simulate.click(utils.getByLabelText('Toggle')),
    toggleButton,
    ...utils,
  }
}

export {render, Simulate, wait, renderToggle}
