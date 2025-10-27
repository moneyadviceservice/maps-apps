import React from 'react';

import { render } from '@testing-library/react';

import { TextInput } from './TextInput';

describe('TextInput component', () => {
  it('renders correctly', () => {
    const { container } = render(<TextInput />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly for type number input', () => {
    const { container } = render(<TextInput type="number" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with a label', () => {
    const { container } = render(<TextInput label="some input" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with an error', () => {
    const { container } = render(<TextInput error="some error" />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders correctly with a hint', () => {
    const { container } = render(<TextInput hint="some hint" />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders correctly with an error and a hint', () => {
    const { container } = render(
      <TextInput error="some error" hint="some hint" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders TextInput obfuscate class when hasGlassBoxClass is true', () => {
    const { container } = render(<TextInput hasGlassBoxClass />);
    const inputElement = container.querySelector('input');
    expect(inputElement?.classList.contains('obfuscate')).toBe(true);
  });
});
