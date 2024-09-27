import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { GroupCheckbox } from './GroupCheckbox';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: () => 'Back' }),
}));

const storedAnswerEmpty: Array<string> = [];
const storedAnswerData: Array<string> = ['2'];

describe('GroupCheckbox Component', () => {
  it.each`
    description                                                                | answerToCheck | storedAnswer         | expectedChecked
    ${'Checkbox answer 0 checked when clicked'}                                | ${[0]}        | ${storedAnswerEmpty} | ${[true, false, false]}
    ${'Checkbox answer 0 unchecked when clicked twice'}                        | ${[0, 0]}     | ${storedAnswerEmpty} | ${[true, false, false]}
    ${'Checkbox answer 0 unchecked when clearAll is clicked'}                  | ${[0, 2]}     | ${storedAnswerEmpty} | ${[false, false, true]}
    ${'Checkbox answer 0 and 1 both checked when clicked'}                     | ${[0, 1]}     | ${storedAnswerEmpty} | ${[true, true, false]}
    ${'Checkbox answer 2 (clearAll) unchecked when answer 1 clicked'}          | ${[2, 1]}     | ${storedAnswerEmpty} | ${[false, true, false]}
    ${'Checkbox answer 2 checked on load when set in storedAnswer'}            | ${[]}         | ${storedAnswerData}  | ${[false, false, true]}
    ${'Checkbox answer 2 unchecked when another option is selected'}           | ${[0]}        | ${storedAnswerData}  | ${[true, false, false]}
    ${'Checkbox answer 2 unchecked when clicked after being selected on load'} | ${[0, 2]}     | ${storedAnswerData}  | ${[false, false, false]}
  `('$description', ({ answerToCheck, storedAnswer, expectedChecked }) => {
    const answerRecord = [
      { text: 'Option 1', clearAll: false },
      { text: 'Option 2', clearAll: false },
      { text: 'None of the above', clearAll: true },
    ];

    const { getByTestId } = render(
      <GroupCheckbox answerRecord={answerRecord} storedAnswer={storedAnswer} />,
    );

    // Click checkboxes
    for (const answer of answerToCheck) {
      const container = getByTestId(`group-checkbox-${answer}`);
      const checkboxInput = container?.querySelector<HTMLInputElement>(
        'input[type="checkbox"]',
      );

      if (checkboxInput) {
        act(() => {
          fireEvent.click(checkboxInput);
        });
      } else {
        throw new Error(`Checkbox not found for answer ${answer}`);
      }
    }

    // Check checkbox states
    const checkboxInputs = Array.from(
      document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
    );
    checkboxInputs.forEach((checkboxInput, index) => {
      if (
        checkboxInput.getAttribute('data-testid')?.startsWith('group-checkbox-')
      ) {
        const expectedState = expectedChecked[index];
        expect(checkboxInput.checked).toBe(expectedState);
      }
    });
  });
});
