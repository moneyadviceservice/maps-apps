import { render, screen } from '@testing-library/react';

import { QuestionRadioButton } from '.';
import {
  mockChildren,
  mockError,
  mockFormName,
  mockHint,
  mockOptions,
  mockOptionsWithHint,
} from './__mocks__';

describe('Question Radio Button component', () => {
  it('renders correctly', () => {
    render(
      <QuestionRadioButton name={mockFormName} options={mockOptions}>
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with horizontal layout', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={mockOptions}
        horizontalLayout={true}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with error state', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={mockOptions}
        hasError={true}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with no children', () => {
    render(<QuestionRadioButton name={mockFormName} options={mockOptions} />);
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with sr-only legend', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={mockOptions}
        hideLabel={true}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with disabled options', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={[
          { text: 'Option 1', value: 'option1', disabled: true },
          { text: 'Option 2', value: 'option2' },
        ]}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with default checked option', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={mockOptions}
        defaultChecked={'option1'}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('does not check disabled option even if defaultChecked matches', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={[
          { text: 'Disabled Option', value: 'disabled-option', disabled: true },
          { text: 'Enabled Option', value: 'enabled-option' },
        ]}
        defaultChecked={'disabled-option'}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with group hint', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={mockOptions}
        hint={mockHint}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with question hints', () => {
    render(
      <QuestionRadioButton name={mockFormName} options={mockOptionsWithHint}>
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with error message', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={mockOptions}
        error={mockError}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with group hint, question hint and error message', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={mockOptionsWithHint}
        error={mockError}
        hint={mockHint}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with error wrapper', () => {
    render(
      <QuestionRadioButton
        name={mockFormName}
        options={mockOptions}
        error={mockError}
        hasErrorWrapper={true}
      >
        {mockChildren}
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });
});
