import { render } from '@testing-library/react';

import {
  mockSections,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AccessSupport } from '.';
import {
  FLOW_PRE_APPOINTMENT_TOKEN,
  FlowName,
  StepName,
} from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

describe('AccessSupport Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) => {
        if (key.includes('sections')) return mockSections;
        if (key.includes('radio-button.options')) {
          return [
            { text: 'Yes', value: StepName.ACCESS_OPTIONS },
            { text: 'No', value: FLOW_PRE_APPOINTMENT_TOKEN },
          ];
        }
      },
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
    entry = {
      data: { flow: FlowName.SELF_EMPLOYED },
      stepIndex: 0,
      steps: mockSteps,
      errors: {},
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AccessSupport step={mockSteps[0]} entry={entry} />,
    );

    expect(
      container.querySelector(
        `input[id="nextStep-1"][value="${StepName.SELF_EMPLOYED_PRE_APPOINTMENT}"]`,
      ),
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('renders error state correctly', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <AccessSupport step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });
});
