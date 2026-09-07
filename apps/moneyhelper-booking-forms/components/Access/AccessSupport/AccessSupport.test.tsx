import { render } from '@testing-library/react';

import {
  mockRadioOptions,
  mockSections,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AccessSupport } from '.';
import { FlowName } from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

describe('AccessSupport Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) => {
        if (key.includes('sections')) return mockSections;
        if (key.includes('radio-button.options')) return mockRadioOptions;
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
