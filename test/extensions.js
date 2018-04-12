import {matcherHint, printReceived, printExpected} from 'jest-matcher-utils'
import chalk from 'chalk'
import 'jest-dom/extend-expect'

const extensions = {
  toBeOn(toggleButton) {
    const on = toggleButton.classList.contains('toggle-btn-on')
    if (on) {
      return {
        message: () =>
          [
            `${matcherHint('.not.toBeOn', 'received', '')} ${chalk.dim(
              '// it does not have the toggle-btn-on class',
            )}`,
            `Expected the given element to not contain the class name:`,
            `  ${printExpected('toggle-btn-on')}`,
            `Received element:`,
            `  ${printReceived(toggleButton)}`,
            '',
            `Because of this, ${chalk.bold(
              `the button is in an ${chalk.underline('on')} state`,
            )}`,
            '',
          ].join('\n'),
        pass: true,
      }
    } else {
      return {
        message: () =>
          [
            `${matcherHint('.toBeOn', 'received', '')} ${chalk.dim(
              '// it has the toggle-btn-on class',
            )}`,
            '',
            `Expected the given element to contain the class name:`,
            `  ${printExpected('toggle-btn-on')}`,
            `Received element:`,
            `  ${printReceived(toggleButton)}`,
            '',
            `Because of this, ${chalk.bold(
              `the button is in an ${chalk.underline('off')} state`,
            )}`,
            '',
          ].join('\n'),
        pass: false,
      }
    }
  },
  toBeOff(toggleButton) {
    const off = toggleButton.classList.contains('toggle-btn-off')
    if (off) {
      return {
        message: () =>
          [
            `${matcherHint('.not.toBeOff', 'received', '')} ${chalk.dim(
              '// it does not have the toggle-btn-off class',
            )}`,
            `Expected the given element to not contain the class name:`,
            `  ${printExpected('toggle-btn-off')}`,
            `Received element:`,
            `  ${printReceived(toggleButton)}`,
            '',
            `Because of this, ${chalk.bold(
              `the button is in an ${chalk.underline('off')} state`,
            )}`,
            '',
          ].join('\n'),
        pass: true,
      }
    } else {
      return {
        message: () =>
          [
            `${matcherHint('.toBeOff', 'received', '')} ${chalk.dim(
              '// it has the toggle-btn-off class',
            )}`,
            '',
            `Expected the given element to contain the class name:`,
            `  ${printExpected('toggle-btn-off')}`,
            `Received element:`,
            `  ${printReceived(toggleButton)}`,
            '',
            `Because of this, ${chalk.bold(
              `the button is in an ${chalk.underline('on')} state`,
            )}`,
            '',
          ].join('\n'),
        pass: false,
      }
    }
  },
}

export {extensions}
