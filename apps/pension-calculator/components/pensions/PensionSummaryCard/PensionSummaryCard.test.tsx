import { fireEvent, render, screen } from '@testing-library/react';

import type { PensionPot } from './PensionSummaryCard';
import { PensionSummaryCard } from './PensionSummaryCard';

const EDIT_LINK_LABEL = 'Edit details';
const REMOVE_BUTTON_LABEL = 'Remove pot';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: jest.fn() }),
}));

jest.mock('data/pension-pots-summary', () => ({
  pensionPotsCopy: () => ({
    pensionCard: {
      pensionLabel: 'Pension pot',
      editDetailsLinkLabel: EDIT_LINK_LABEL,
      currentValueLabel: 'Current value',
      yourContributionLabel: 'Your contribution',
      employerContributionLabel: 'Employer contribution',
      monthlyFrequencyLabel: 'per month',
      removeButtonLabel: REMOVE_BUTTON_LABEL,
    },
  }),
}));

jest.mock('hooks/usePensionsForm/usePensionsForm', () => ({
  PENSIONS_API: '/api/pensions',
}));

jest.mock('utils/pensionFieldIds/pensionFieldIds', () => ({
  potNameId: (i: number) => `pot-name-${i}`,
  potRemoveId: (i: number) => `pot-remove-${i}`,
}));

jest.mock('@maps-react/common/components/Heading/Heading', () => ({
  H3: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({
    children,
    href,
    onClick,
    as: Component = 'button',
  }: {
    children: React.ReactNode;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    as?: React.ElementType;
  }) => {
    if (Component === 'a') {
      return <a href={href}>{children}</a>;
    }
    return <button onClick={onClick}>{children}</button>;
  },
}));

describe('PensionSummaryCard', () => {
  const mockHandleRemove = jest.fn();
  const defaultProps = {
    index: 0,
    sessionId: 'session-123',
    handleRemove: mockHandleRemove,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null if pot has no currentValue', () => {
    const { container } = render(
      <PensionSummaryCard {...defaultProps} pot={{} as PensionPot} />,
    );

    expect(container.firstChild).toBeNull();
  });

  test('renders pot details with formatted values, link href, and contributions', () => {
    const pot: PensionPot = {
      name: 'Workplace Nest',
      currentValue: '15000',
      employeeContribution: {
        mode: 'percentage',
        value: '5',
        frequency: 'month',
      },
      employerContribution: {
        mode: 'amount',
        value: '200',
        frequency: 'month',
      },
    };

    render(<PensionSummaryCard {...defaultProps} pot={pot} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Workplace Nest' }),
    ).toBeInTheDocument();
    expect(screen.getByText('£15000')).toBeInTheDocument();
    expect(screen.getByText('5% per month')).toBeInTheDocument();
    expect(screen.getByText('£200 per month')).toBeInTheDocument();

    const editLink = screen.getByRole('link', { name: EDIT_LINK_LABEL });
    expect(editLink).toHaveAttribute(
      'href',
      '/en/pots-of-money/details?sessionId=session-123#pot-name-0',
    );
  });

  test('falls back to default title and placeholders when optional fields are omitted', () => {
    const pot: PensionPot = {
      currentValue: '£5000',
    };

    render(<PensionSummaryCard {...defaultProps} index={1} pot={pot} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Pension pot 2' }),
    ).toBeInTheDocument();
    expect(screen.getByText('£5000')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
  });

  test('calls handleRemove with the click event and target index', () => {
    const pot: PensionPot = { currentValue: '1000' };

    render(<PensionSummaryCard {...defaultProps} index={2} pot={pot} />);

    fireEvent.click(screen.getByRole('button', { name: REMOVE_BUTTON_LABEL }));

    expect(mockHandleRemove).toHaveBeenCalledTimes(1);
    expect(mockHandleRemove).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' }),
      2,
    );
  });
});
