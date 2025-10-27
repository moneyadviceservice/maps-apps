import { render, screen } from '@testing-library/react';

import { QuestionRadioButton } from '.';

describe('Question Radio Button component', () => {
  it('renders correctly', () => {
    render(
      <QuestionRadioButton
        name={'test'}
        options={[
          { text: 'Option 1', value: 'option1' },
          { text: 'Option 2', value: 'option2' },
        ]}
      >
        Test
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with horizontal layout', () => {
    render(
      <QuestionRadioButton
        name={'test'}
        options={[
          { text: 'Option 1', value: 'option1' },
          { text: 'Option 2', value: 'option2' },
        ]}
        horizontalLayout={true}
      >
        Test
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with error state', () => {
    render(
      <QuestionRadioButton
        name={'test'}
        options={[
          { text: 'Option 1', value: 'option1' },
          { text: 'Option 2', value: 'option2' },
        ]}
        hasError={true}
      >
        Test
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with no children', () => {
    render(
      <QuestionRadioButton
        name={'test'}
        options={[
          { text: 'Option 1', value: 'option1' },
          { text: 'Option 2', value: 'option2' },
        ]}
      />,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with disabled options', () => {
    render(
      <QuestionRadioButton
        name={'test'}
        options={[
          { text: 'Option 1', value: 'option1', disabled: true },
          { text: 'Option 2', value: 'option2' },
        ]}
      >
        Test
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });

  it('renders with default checked option', () => {
    render(
      <QuestionRadioButton
        name={'test'}
        options={[
          { text: 'Option 1', value: 'option1' },
          { text: 'Option 2', value: 'option2' },
        ]}
        defaultChecked={'option1'}
      >
        Test
      </QuestionRadioButton>,
    );
    const question = screen.getByTestId('question-radio');
    expect(question).toMatchSnapshot();
  });
});
