import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NumberInput } from './NumberInput';

const onChange = jest.fn();

describe('NumberInput component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <NumberInput id="id" name="name" defaultValue="" onChange={onChange} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with a custom className', () => {
    const { container } = render(
      <NumberInput
        className="rounded-lg"
        id="id"
        name="name"
        defaultValue=""
        onChange={onChange}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with default props', () => {
    const { getByTestId } = render(<NumberInput />);
    const inputElement = getByTestId('number-input');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe('INPUT');
    expect(inputElement.getAttribute('type')).toBe('text');
  });

  it('sets id prop correctly', () => {
    const { getByTestId } = render(<NumberInput id="test-id" />);
    const inputElement = getByTestId('number-input');

    expect(inputElement.id).toBe('test-id');
  });

  it('calls onChange handler correctly', () => {
    const { getByTestId } = render(<NumberInput onChange={onChange} />);
    const inputElement = getByTestId('number-input');

    fireEvent.change(inputElement, { target: { value: '123' } });

    const eventObject = onChange.mock.calls[0][0];
    const targetValue = eventObject.target.value;
    expect(targetValue).toBe('123');
  });

  it('applies custom class name', () => {
    const { getByTestId } = render(<NumberInput className="custom-class" />);
    const inputElement = getByTestId('number-input');

    expect(inputElement.classList.contains('custom-class')).toBe(true);
  });
});
