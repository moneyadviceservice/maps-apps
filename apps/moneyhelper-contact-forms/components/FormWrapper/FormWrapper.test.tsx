import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Entry, EntryData } from '../../lib/types';
import { getFlowSteps } from '../../lib/utils';
import { FormWrapper } from './FormWrapper';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

jest.mock('../../lib/utils', () => ({
  ...jest.requireActual('../../lib/utils'),
  getFlowSteps: jest.fn(),
}));

const mockUseTranslation = useTranslation as jest.Mock;
const mockGetFlowSteps = getFlowSteps as jest.Mock;

const mockStep = 'mock-step';
const mockEntry = {
  data: { flow: 'mock-flow' } as EntryData,
  stepIndex: 1,
} as Entry;

describe('FormWrapper', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    jest.clearAllMocks();
  });

  it('renders children inside the form', () => {
    mockGetFlowSteps.mockReturnValue(['mock-step', 'loading', 'confirmation']);
    const { container } = render(
      <FormWrapper step={mockStep}>
        <div>Child Content</div>
      </FormWrapper>,
    );
    expect(container).toMatchSnapshot();
  });

  it('shows continue text for non-last input steps', () => {
    mockGetFlowSteps.mockReturnValue([
      'step-0',
      'step-1',
      'loading',
      'confirmation',
    ]);

    const { getByTestId } = render(
      <FormWrapper step="step-0" entry={{ ...mockEntry, stepIndex: 0 }}>
        <div>Child Content</div>
      </FormWrapper>,
    );

    expect(getByTestId('continue-button')).toHaveTextContent(
      'common.form.button.continue-text',
    );
  });

  it('shows send text for the last input step', () => {
    mockGetFlowSteps.mockReturnValue([
      'step-0',
      'step-1',
      'loading',
      'confirmation',
    ]);

    const { getByTestId } = render(
      <FormWrapper step="step-1" entry={mockEntry}>
        <div>Child Content</div>
      </FormWrapper>,
    );

    expect(getByTestId('continue-button')).toHaveTextContent(
      'common.form.button.send-text',
    );
  });
});
