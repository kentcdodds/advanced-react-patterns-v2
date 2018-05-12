import './switch.styles.css'
import React from 'react'

// STOP! You should not have to change anything in this file to
// make it through the workshop. If tests are failing because of
// this switch not having properties set correctly, then the
// problem is probably in your implementation. Tip: Check
// your `render` method or the `getTogglerProps` method
// (if we've gotten to that part)
class Switch extends React.Component {
  render() {
    const {on, className = '', 'aria-label': ariaLabel, onClick, ...props} = this.props
    const btnClassName = [
      className,
      'toggle-btn',
      on ? 'toggle-btn-on' : 'toggle-btn-off',
    ]
      .filter(Boolean)
      .join(' ')
    return (
      <label aria-label={ariaLabel || "Toggle"}>
        <input
          className="toggle-input"
          type="checkbox"
          checked={on}
          onChange={onClick}
          data-testid="toggle-input"
        />
        <span
          className={btnClassName}
          {...props}
        />
      </label>
    )
  }
}

export {Switch}
