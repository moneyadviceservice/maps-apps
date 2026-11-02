import { fireEvent, render } from '@testing-library/react';

import { StepContainer } from './StepContainer';

import '@testing-library/jest-dom';

const mockAddEvent = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
  }),
}));

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: () => 'Back' }),
}));

describe('StepContainer component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  describe('Back and Continue buttons analytics', () => {
    it('should track both back and continue button clicks independently', () => {
      const { getByTestId } = render(
        <StepContainer
          backLink="/back"
          action="/api/submit"
          buttonText="Continue"
          isEmbed={false}
          currentStep={5}
          toolName="Test Tool"
        >
          <span>Questions</span>
        </StepContainer>,
      );

      // Click the back button
      const backButton = getByTestId('tool-nav-prev');
      fireEvent.click(backButton);

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolInteraction',
        eventInfo: {
          toolName: 'Test Tool',
          toolStep: '6',
          stepName: 'Question 5',
          reactCompType: 'Button',
          reactCompName: 'Back',
        },
      });

      // Reset mock to verify continue button is tracked independently
      mockAddEvent.mockClear();

      // Click the continue button
      const continueButton = getByTestId('step-container-submit-button');
      fireEvent.click(continueButton);

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolInteraction',
        eventInfo: {
          toolName: 'Test Tool',
          toolStep: '6',
          stepName: 'Question 5',
          reactCompType: 'Button',
          reactCompName: 'Continue',
        },
      });
    });

    it('should track continue button clicks with fallback name', () => {
      const { getByTestId } = render(
        <StepContainer
          backLink="/back"
          action="/api/submit"
          isEmbed={false}
          currentStep={5}
          toolName="Test Tool"
        >
          <span>Questions</span>
        </StepContainer>,
      );

      // Click the continue button
      const continueButton = getByTestId('step-container-submit-button');
      fireEvent.click(continueButton);

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolInteraction',
        eventInfo: {
          toolName: 'Test Tool',
          toolStep: '6',
          stepName: 'Question 5',
          reactCompType: 'Button',
          reactCompName: 'StepContainer action',
        },
      });
    });

    it('should not fire trackButtonInteraction if toolName prop is not supplied', () => {
      const { getByTestId } = render(
        <StepContainer
          backLink="/back"
          action="/api/submit"
          buttonText="Continue"
          isEmbed={false}
          currentStep={5}
        >
          <span>Questions</span>
        </StepContainer>,
      );

      // Click the back button
      const backButton = getByTestId('tool-nav-prev');
      fireEvent.click(backButton);
      expect(mockAddEvent).not.toHaveBeenCalled();
    });

    it('should not fire trackButtonInteraction if currentStep prop is not supplied', () => {
      const { getByTestId } = render(
        <StepContainer
          backLink="/back"
          action="/api/submit"
          buttonText="Continue"
          isEmbed={false}
          toolName="Test Tool"
        >
          <span>Questions</span>
        </StepContainer>,
      );

      // Click the continue button
      const continueButton = getByTestId('step-container-submit-button');
      fireEvent.click(continueButton);
      expect(mockAddEvent).not.toHaveBeenCalled();
    });
  });
});
