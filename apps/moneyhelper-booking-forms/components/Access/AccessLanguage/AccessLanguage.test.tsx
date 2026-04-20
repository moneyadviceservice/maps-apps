import { render } from '@testing-library/react';

import {
  mockEntry,
  mockErrors,
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AccessLanguage } from '.';
import { FlowName, StepName } from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

describe('AccessLanguage Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
    entry = {
      ...mockEntry,
      data: { flow: FlowName.SELF_EMPLOYED },
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AccessLanguage step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component textArea error correctly', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <AccessLanguage entry={entry} errors={mockErrors} step={mockSteps[0]} />,
    );

    expect(container).toMatchSnapshot();
  });

  it.each([
    [FlowName.PENSION_WISE, StepName.PENSION_WISE_PRE_APPOINTMENT],
    [FlowName.SELF_EMPLOYED, StepName.SELF_EMPLOYED_PRE_APPOINTMENT],
    [FlowName.DIVORCE_SEPARATION, StepName.DIVORCE_PRE_APPOINTMENT],
    [FlowName.PENSION_LOSS, StepName.PENSION_LOSS_PRE_APPOINTMENT],
  ])('sets the next step for %s flow', (flow, expectedStep) => {
    const entry = {
      ...mockEntry,
      data: {
        ...mockEntry.data,
        flow,
      },
    };

    const { container } = render(
      <AccessLanguage step={mockSteps[0]} entry={entry} />,
    );

    expect(container.querySelector('input[name="nextStep"]')).toHaveValue(
      expectedStep,
    );
  });
});
