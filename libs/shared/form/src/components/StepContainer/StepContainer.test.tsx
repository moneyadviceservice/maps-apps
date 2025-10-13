import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { StepContainer } from './StepContainer';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: () => 'Back' }),
}));

describe('StepContainer component', () => {
  it('renders correctly as form', () => {
    const { container } = render(
      <StepContainer
        backLink="test/back/link"
        isEmbed={false}
        onSubmit={undefined}
      >
        <span>Questions</span>
      </StepContainer>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with children only', () => {
    const formSubmit = jest.fn();
    const { container, getByTestId } = render(
      <StepContainer
        isEmbed={true}
        backLink="test/back/link"
        currentStep={2}
        action={'/api/submit'}
        onSubmit={formSubmit}
      >
        <span>Questions</span>
      </StepContainer>,
    );
    const form = getByTestId('form');
    fireEvent.submit(form);
    expect(formSubmit).toHaveBeenCalled();
    expect(container.firstChild).toMatchSnapshot();
  });
});
