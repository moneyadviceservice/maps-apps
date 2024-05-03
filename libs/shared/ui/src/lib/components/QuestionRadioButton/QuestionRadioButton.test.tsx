import React from 'react';
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
});
