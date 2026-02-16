import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockTimelineData } from '../../lib/mocks';
import { TimelineKey as TimelineKeyType } from '../../lib/types';
import { TimelineKey } from './TimelineKey';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockKeyData = mockTimelineData.keys as TimelineKeyType[];
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
          'pages.your-pensions-timeline.key.items.AVC': 'AVC',
          'pages.your-pensions-timeline.key.items.HYB': 'Hybrid',
        };
        return translations[key];
      },
    });
  });

  it('renders the timeline key component (mobile and desktop)', () => {
    render(<TimelineKey data={mockKeyData} />);

    expect(screen.getByTestId('timeline-key')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-key-mobile')).toBeInTheDocument();
  });

  it('displays correct pension types in key', () => {
    render(<TimelineKey data={mockKeyData} />);

    expect(screen.getAllByTestId('key-item-sp')).toHaveLength(2);
    expect(screen.getAllByTestId('key-item-db')).toHaveLength(2);
    expect(screen.getAllByTestId('key-item-dc')).toHaveLength(2);
    expect(screen.getAllByTestId('key-item-avc')).toHaveLength(2);
    expect(screen.getAllByTestId('key-item-hyb')).toHaveLength(2);
    expect(screen.getAllByTestId('key-item-lu')).toHaveLength(2);
  });

  it('sorts key correctly (SP, DB, DC, AVC, HYB, LU)', () => {
    render(
      <TimelineKey
        data={['AVC', 'DB', 'DC', 'SP', 'LU', 'HYB'] as TimelineKeyType[]}
      />,
    );

    const key = screen.getByTestId('timeline-key');
    const listItems = within(key).getAllByRole('listitem');
    const textContents = listItems.map((item) => item.textContent);

    expect(textContents).toEqual([
      'State Pension',
      'Defined benefit',
      'Defined contribution',
      'AVC',
      'Hybrid',
      'Lump sum',
    ]);
  });

  it('shows mobile expandable section with correct titles', () => {
    render(<TimelineKey data={mockKeyData} />);

    expect(screen.getByText('View key')).toBeInTheDocument();
  });

  it('toggles mobile expandable section when clicked', async () => {
    const user = userEvent.setup();
    render(<TimelineKey data={mockKeyData} />);

    const expandButton = screen.getByText('View key');
    await user.click(expandButton);

    expect(screen.getByText('Hide key')).toBeInTheDocument();
  });

  it('has correct CSS classes for responsive design', () => {
    render(<TimelineKey data={mockKeyData} />);

    const desktopKey = screen.getByTestId('timeline-key');
    const mobileKey = screen.getByTestId('timeline-key-mobile');

    expect(desktopKey).toHaveClass('max-lg:hidden');
    expect(mobileKey).toHaveClass('lg:hidden');
  });

  it('should handle no data gracefully', () => {
    render(<TimelineKey data={[]} />);

    expect(screen.queryByTestId('timeline-key')).not.toBeInTheDocument();
    expect(screen.queryByTestId('timeline-key-mobile')).not.toBeInTheDocument();
  });

  it.each`
    type     | expectedColorClass
    ${'sp'}  | ${'text-blue-700'}
    ${'db'}  | ${'text-purple-650'}
    ${'dc'}  | ${'text-teal-700'}
    ${'avc'} | ${'text-magenta-750'}
    ${'hyb'} | ${'text-olive-500'}
    ${'lu'}  | ${'text-green-850'}
  `(
    'should apply correct icon color for $type',
    ({ type, expectedColorClass }) => {
      render(<TimelineKey data={mockKeyData} />);
      const icon = screen.getAllByTestId(`key-icon-${type}`)[0];
      expect(icon).toHaveAttribute(
        'classname',
        expect.stringContaining(expectedColorClass),
      );
    },
  );
});
