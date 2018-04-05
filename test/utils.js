import assert from 'assert'
import {render, Simulate, wait} from 'react-testing-library'

function renderToggle(ui) {
  const utils = render(ui)
  const input = utils.getByLabelText('Toggle')
  const isOn = () =>
    input.getAttribute('aria-expanded') === 'true' &&
    input.classList.contains('toggle-btn-on')
  return {
    isOn,
    assertOn: () => {
      if (!isOn()) {
        throw new Error('toggle is not on, but should be')
      }
    },
    assertOff: () => {
      if (isOn()) {
        throw new Error('toggle is on, but should not be')
      }
    },
    toggle: () => Simulate.click(utils.getByLabelText('Toggle')),
    input,
    ...utils,
  }
}

export {render, Simulate, wait, renderToggle}
