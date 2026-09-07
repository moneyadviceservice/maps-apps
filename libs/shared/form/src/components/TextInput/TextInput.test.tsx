import { render, screen } from '@testing-library/react';

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
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      'text-input-hint text-input-error',
    );
  });

  it('renders TextInput obfuscate class when hasGlassBoxClass is true', () => {
    const { container } = render(<TextInput hasGlassBoxClass />);
    const inputElement = container.querySelector('input');
    expect(inputElement?.classList.contains('obfuscate')).toBe(true);
  });

  it('renders with children', () => {
    const { container } = render(
      <TextInput>
        <div>Child content</div>
      </TextInput>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with error wrapper', () => {
    const { container } = render(
      <TextInput error="some error" hint="some hint" hasErrorWrapper />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
