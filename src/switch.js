import './switch.styles.css'
import React from 'react'

function Switch({on, className = '', ...props}) {
  return (
    <div>
      <input className="toggle-input" type="checkbox" />
      <button
        className={`${className} toggle-btn ${
          on ? 'toggle-btn-on' : 'toggle-btn-off'
        }`}
        aria-label="Toggle"
        aria-expanded={on}
        {...props}
      />
    </div>
  )
}

export {Switch}
