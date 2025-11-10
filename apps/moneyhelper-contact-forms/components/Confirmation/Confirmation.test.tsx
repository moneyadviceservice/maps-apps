import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Entry } from '../../lib/types';
import { Confirmation } from './Confirmation';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Confirmation Component', () => {
  const mockEntry: Entry = {
    data: {
      lang: 'en',
      flow: 'test-route-flow',
      email: 'test@example.com',
    },
    stepIndex: 0,
    errors: {},
  };
  const mockStep = 'mock-step';

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
        if (key === 'components.confirmation.content') return 'Generic content';
        if (key === 'components.confirmation.testflow.items') return 'ok';
        return key;
      },
      tList: (key: string) => {
        if (key === 'components.confirmation.items') {
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
      <Confirmation entry={mockEntry} step={mockStep} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the list items', () => {
    render(<Confirmation entry={mockEntry} step={mockStep} />);

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
    render(<Confirmation entry={mockEntry} flow="testflow" step={mockStep} />);
    const listItems = screen.getByTestId('confirmation-items').children;
    expect(listItems).toHaveLength(3);
    expect(listItems[2]).toHaveTextContent('Specific item 1');
  });

  it('handles missing email gracefully', () => {
    const { container } = render(
      <Confirmation entry={undefined} step={mockStep} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the reference number in the callout', () => {
    const referenceNumber = '123456789';
    render(
      <Confirmation
        entry={mockEntry}
        referenceNumber={referenceNumber}
        step={mockStep}
      />,
    );

    const calloutContent = screen.getByTestId('confirmation-callout-content');
    expect(calloutContent).toHaveTextContent(
      `Your reference number is ${referenceNumber}.`,
    );
  });
});
