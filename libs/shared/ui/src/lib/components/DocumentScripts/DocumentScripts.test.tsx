import React from 'react';
import { render } from '@testing-library/react';
import { DocumentScripts } from '.';

describe('Container component', () => {
  it('renders correctly', () => {
    const { container } = render(<DocumentScripts />);
    expect(container).toMatchSnapshot();
  });
});
