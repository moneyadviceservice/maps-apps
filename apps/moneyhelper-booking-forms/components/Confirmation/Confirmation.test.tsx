import { useTranslation } from '@maps-digital/shared/hooks';
import { render } from '@testing-library/react';

import { mockEntry, mockSections, mockSteps } from '@maps-react/mhf/mocks';

import { Confirmation } from './Confirmation';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../AppointmentSummaryCallout', () => ({
  AppointmentSummaryCallout: () => (
    <div data-testid="appointment-summary-callout" />
  ),
}));

describe('Confirmation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
      tList: () => mockSections,
    });
  });

  it('renders the component', () => {
    const { container } = render(
      <Confirmation entry={mockEntry} step={mockSteps[0]} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('throws when entry is missing', () => {
    expect(() =>
      render(<Confirmation entry={undefined} step={mockSteps[0]} />),
    ).toThrow('[Confirmation] Missing entry');
  });
});
