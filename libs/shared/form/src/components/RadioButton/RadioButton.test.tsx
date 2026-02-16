import { render, screen } from '@testing-library/react';

import { RadioButton } from '.';

describe('RadioButton component', () => {
  it('renders correctly', () => {
    render(
      <RadioButton id="test-id" name="test-name" value="">
        Radio label name
      </RadioButton>,
    );
    const radio = screen.getByTestId('radio-button');
    expect(radio).toMatchSnapshot();
  });

  it('renders with error', () => {
    render(
      <RadioButton
        id="test-id"
        testId="radio-button"
        name="test-name"
        value=""
        hasError
      >
        Radio label name
      </RadioButton>,
    );
    const radio = screen.getByTestId('radio-button');
    expect(radio).toMatchSnapshot();
  });
  it('renders with disabled', () => {
    render(
      <RadioButton
        id="test-id"
        testId="radio-button"
        name="test-name"
        value=""
        disabled
      >
        Radio label name
      </RadioButton>,
    );
    const radio = screen.getByTestId('radio-button');
    expect(radio).toMatchSnapshot();
  });

  it('renders with hint', () => {
    render(
      <RadioButton
        id="test-id"
        testId="radio-button"
        name="test-name"
        value=""
        hint="This is a hint"
      >
        Radio label name
      </RadioButton>,
    );
    const hint = screen.getByTestId('radio-button-hint');
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveTextContent('This is a hint');
  });
});
