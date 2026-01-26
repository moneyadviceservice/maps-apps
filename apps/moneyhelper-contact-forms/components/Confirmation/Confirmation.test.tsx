import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';
import { mockSteps } from '@maps-react/mhf/mocks';
import { Entry, EntryData } from '@maps-react/mhf/types';

import { Confirmation } from './Confirmation';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Confirmation Component', () => {
  const mockEntry = {
    data: {
      lang: 'en',
      flow: 'test-route-flow',
      email: 'test@example.com',
    } as EntryData,
  } as Entry;

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string, variables?: Record<string, string>) => {
        // Dynamic reference number
        if (key === 'components.confirmation.callout.content') {
          return `Your reference number is ${variables?.referenceNumber}.`;
        }
        // Specific content missing for fallback test
        if (key === 'components.confirmation.testflow.content') return '';
        if (key === 'components.confirmation.testflow.items') return 'ok';
        return key;
      },
      tList: (key: string) => {
        if (key === 'components.confirmation.common.items') {
          return [
            'We’ll send you an email to {email} to confirm that we’ve received your enquiry',
            'If you don’t get this email, check your spam or junk mail folder',
          ];
        }
        if (key === 'components.confirmation.testflow.items') {
          return ['Specific item 1'];
        }
      },
    });
  });

  it('renders the component', () => {
    const { container } = render(
      <Confirmation entry={mockEntry} step={mockSteps[0]} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the list items', () => {
    render(<Confirmation entry={mockEntry} step={mockSteps[0]} />);

    const listItems = screen.getByTestId('confirmation-items').children;

    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent(
      'We’ll send you an email to test@example.com to confirm that we’ve received your enquiry',
    );
    expect(listItems[1]).toHaveTextContent(
      'If you don’t get this email, check your spam or junk mail folder',
    );
  });

  it('renders a combined list with specific and generic items', () => {
    render(
      <Confirmation entry={mockEntry} flow="testflow" step={mockSteps[0]} />,
    );
    const listItems = screen.getByTestId('confirmation-items').children;
    expect(listItems).toHaveLength(3);
    expect(listItems[2]).toHaveTextContent('Specific item 1');
  });

  it('renders specific content when available', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string, variables?: Record<string, string>) => {
        if (key === 'components.confirmation.callout.content') {
          return `Reference ${variables?.referenceNumber ?? ''}`;
        }
        if (key === 'components.confirmation.customflow.content') {
          return 'Custom content for the confirmation step.';
        }
        return key;
      },
      tList: (key: string) => {
        if (key === 'components.confirmation.common.items') {
          return ['Generic item'];
        }
      },
    });

    render(
      <Confirmation entry={mockEntry} flow="customflow" step={mockSteps[0]} />,
    );

    expect(
      screen.getByText('Custom content for the confirmation step.'),
    ).toBeInTheDocument();
  });

  it('handles missing email gracefully', () => {
    const { container } = render(
      <Confirmation entry={undefined} step={mockSteps[0]} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the reference number in the callout', () => {
    const referenceNumber = '123456789';
    render(
      <Confirmation
        entry={mockEntry}
        referenceNumber={referenceNumber}
        step={mockSteps[0]}
      />,
    );

    const calloutContent = screen.getByTestId('confirmation-callout-content');
    expect(calloutContent).toHaveTextContent(
      `Your reference number is ${referenceNumber}.`,
    );
  });
});
