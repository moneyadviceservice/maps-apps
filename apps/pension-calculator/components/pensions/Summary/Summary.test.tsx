import { JOURNEY_PAGES } from 'data/journey';
import { journeyPath } from 'utils/journeyPath/journeyPath';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Summary } from './Summary';

const MOCK_SESSION_ID = 'session-123';
const SUMMARY_HEADING = 'Your pension pots';
const EMPTY_MESSAGE = 'No pension pots added.';

const mockPush = jest.fn<void, [url: string]>();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('data/journey', () => ({
  JOURNEY_PAGES: { POT_DETAILS: 'pot-details' },
}));

jest.mock('data/pension-pots-summary', () => ({
  pensionPotsCopy: () => ({ summaryHeading: SUMMARY_HEADING }),
}));

jest.mock('utils/journeyPath/journeyPath', () => ({
  journeyPath: jest.fn(
    (lang: string, page: string, sessionId: string) =>
      `/journey/${lang}/${page}/${sessionId}`,
  ),
}));

jest.mock('@maps-react/common/components/Heading/Heading', () => ({
  H2: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

jest.mock('@maps-react/common/components/Paragraph/Paragraph', () => ({
  Paragraph: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: jest.fn() }),
}));

type SummaryProps = React.ComponentProps<typeof Summary>;
type SummaryData = SummaryProps['data'];
type CardProps = React.ComponentProps<
  typeof import('../PensionSummaryCard').PensionSummaryCard
>;

jest.mock('../PensionSummaryCard', () => ({
  PensionSummaryCard: ({ pot, index, handleRemove }: CardProps) => (
    <div data-testid={`summary-card-${index}`}>
      <span>{pot.name}</span>
      <button type="button" onClick={(e) => handleRemove(e, index)}>
        Remove
      </button>
    </div>
  ),
}));

const mockJourneyPath = journeyPath as jest.MockedFunction<typeof journeyPath>;

const createMockData = (pots: Array<{ name: string }>): SummaryData =>
  ({ pots } as unknown as SummaryData);

describe('Summary', () => {
  const mockHandleRemove = jest.fn<
    Promise<void>,
    [event: React.MouseEvent<HTMLButtonElement>, index: number]
  >();

  const renderSummary = (pots: Array<{ name: string }>) =>
    render(
      <Summary
        data={createMockData(pots)}
        sessionId={MOCK_SESSION_ID}
        handleRemove={mockHandleRemove}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleRemove.mockResolvedValue(undefined);
  });

  test('renders heading and empty message when pots list is empty', () => {
    renderSummary([]);

    expect(
      screen.getByRole('heading', { level: 2, name: SUMMARY_HEADING }),
    ).toBeInTheDocument();
    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
  });

  test('renders summary cards for each pension pot', () => {
    renderSummary([{ name: 'Pot 1' }, { name: 'Pot 2' }]);

    expect(screen.getByTestId('summary-card-0')).toHaveTextContent('Pot 1');
    expect(screen.getByTestId('summary-card-1')).toHaveTextContent('Pot 2');
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument();
  });

  test('removes pot and redirects to pot details when one or fewer pots remain', async () => {
    renderSummary([{ name: 'Pot 1' }]);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    await waitFor(() => {
      expect(mockHandleRemove).toHaveBeenCalledTimes(1);
    });

    expect(mockJourneyPath).toHaveBeenCalledWith(
      'en',
      JOURNEY_PAGES.POT_DETAILS,
      MOCK_SESSION_ID,
    );
    expect(mockPush).toHaveBeenCalledWith(
      `/journey/en/${JOURNEY_PAGES.POT_DETAILS}/${MOCK_SESSION_ID}`,
    );
  });

  test('removes pot without redirecting when more than one pot remains', async () => {
    renderSummary([{ name: 'Pot 1' }, { name: 'Pot 2' }]);

    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

    await waitFor(() => {
      expect(mockHandleRemove).toHaveBeenCalledTimes(1);
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
