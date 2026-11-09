import { render } from '@testing-library/react';

import {
  mockEntry,
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AccessBsl } from '.';
import { FlowName } from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

describe('AccessBsl Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
    entry = {
      ...mockEntry,
      data: { flow: FlowName.SELF_EMPLOYED },
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AccessBsl step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });
});
