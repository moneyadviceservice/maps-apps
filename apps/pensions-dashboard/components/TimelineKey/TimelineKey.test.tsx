import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import {
  mockPensionDetailsDBRecurring,
  mockPensionsData,
} from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { TimelineKey } from './TimelineKey';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockPensionData = [
  mockPensionsData.pensionPolicies[0]
    .pensionArrangements?.[0] as PensionArrangement,
  mockPensionsData.pensionPolicies[0]
    .pensionArrangements?.[2] as PensionArrangement,
  mockPensionDetailsDBRecurring as PensionArrangement,
];

const mockPensionDataNoLumpSum = [
  mockPensionsData.pensionPolicies[0]
    .pensionArrangements?.[0] as PensionArrangement,
  mockPensionsData.pensionPolicies[0]
    .pensionArrangements?.[2] as PensionArrangement,
];
describe('TimelineKey', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'pages.your-pensions-timeline.key.accordion-open': 'View key',
          'pages.your-pensions-timeline.key.accordion-close': 'Hide key',
          'pages.your-pensions-timeline.key.items.SP': 'State Pension',
          'pages.your-pensions-timeline.key.items.DB': 'Defined benefit',
          'pages.your-pensions-timeline.key.items.DC': 'Defined contribution',
          'pages.your-pensions-timeline.key.items.LU': 'Lump sum',
        };
        return translations[key];
      },
    });
  });

  it('renders the timeline key component (mobile and desktop)', () => {
    render(<TimelineKey data={mockPensionData} />);

    expect(screen.getByTestId('timeline-key')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-key-mobile')).toBeInTheDocument();
  });

  it('displays correct pension types in key', () => {
    render(<TimelineKey data={mockPensionData} />);

    expect(screen.getAllByTestId('key-item-sp')).toHaveLength(2);
    expect(screen.getAllByTestId('key-item-db')).toHaveLength(2);
    expect(screen.getAllByTestId('key-item-dc')).toHaveLength(2);
    expect(screen.getAllByTestId('key-item-lu')).toHaveLength(2);
  });

  it('does not show lump sum in key when hasTaxFreeLumpSum returns false', () => {
    render(<TimelineKey data={mockPensionDataNoLumpSum} />);

    expect(screen.queryByTestId('key-item-lu')).not.toBeInTheDocument();
  });

  it('sorts key correctly (SP, DB, DC, LU)', () => {
    render(<TimelineKey data={mockPensionData} />);

    const key = screen.getByTestId('timeline-key');
    const listItems = within(key).getAllByRole('listitem');
    const textContents = listItems.map((item) => item.textContent);

    expect(textContents).toEqual([
      'State Pension',
      'Defined benefit',
      'Defined contribution',
      'Lump sum',
    ]);
  });

  it('removes duplicate pension types', () => {
    const duplicateData: PensionArrangement[] = [
      { pensionType: PensionType.SP } as PensionArrangement,
      { pensionType: PensionType.SP } as PensionArrangement,
      { pensionType: PensionType.DB } as PensionArrangement,
    ];

    render(<TimelineKey data={duplicateData} />);

    const key = screen.getByTestId('timeline-key');
    const statePensionItems = within(key).getAllByText('State Pension');
    expect(statePensionItems).toHaveLength(1);
  });

  it('shows mobile expandable section with correct titles', () => {
    render(<TimelineKey data={mockPensionData} />);

    expect(screen.getByText('View key')).toBeInTheDocument();
  });

  it('toggles mobile expandable section when clicked', async () => {
    const user = userEvent.setup();
    render(<TimelineKey data={mockPensionData} />);

    const expandButton = screen.getByText('View key');
    await user.click(expandButton);

    expect(screen.getByText('Hide key')).toBeInTheDocument();
  });

  it('has correct CSS classes for responsive design', () => {
    render(<TimelineKey data={mockPensionData} />);

    const desktopKey = screen.getByTestId('timeline-key');
    const mobileKey = screen.getByTestId('timeline-key-mobile');

    expect(desktopKey).toHaveClass('max-md:hidden');
    expect(mobileKey).toHaveClass('md:hidden');
  });

  it('should handle no data gracefully', () => {
    render(<TimelineKey data={[]} />);

    expect(screen.queryByTestId('timeline-key')).not.toBeInTheDocument();
    expect(screen.queryByTestId('timeline-key-mobile')).not.toBeInTheDocument();
  });
});
