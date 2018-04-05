import './switch.styles.css'
import React from 'react'

// STOP! You should not have to change anything in this file to
// make it through the workshop. If tests are failing because of
// this switch not having properties set correctly, then the
// problem is probably in your implementation. Tip: Check `getTogglerProps`
function Switch({on, className = '', ...props}) {
  const btnClassName = [
    className,
    'toggle-btn',
    on ? 'toggle-btn-on' : 'toggle-btn-off',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div>
      <input
        data-testid="toggle-checkbox"
        className="toggle-input"
        type="checkbox"
        checked={on}
        onChange={() => {
          // changing is handled by clicking the button
        }}
      />
      <button
        className={btnClassName}
        aria-label="Toggle"
        aria-expanded={on}
        {...props}
      />
    </div>
  )
}

export {Switch}
