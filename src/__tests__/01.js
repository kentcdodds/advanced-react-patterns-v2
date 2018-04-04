import React from 'react'
import {render} from 'react-testing-library'
import Toggle from '../exercises-final/01'

test('renders a toggle component', () => {
  const {container, queryByLabelText} = render(<Toggle />)
  // TODO: add support for aria-label in react-testing-library
  // expect(queryByLabelText('Toggle')).not.toBeNull()
})
