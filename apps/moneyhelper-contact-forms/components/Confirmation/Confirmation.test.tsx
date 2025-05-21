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
    errors: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string, variables?: Record<string, string>) =>
        key === 'components.confirmation.callout.content'
          ? `Your reference number is ${variables?.referenceNumber}.`
          : key,

      tList: (key: string) =>
        key === 'components.confirmation.what-happens-next.items'
          ? [
              'We’ll send you an email to **{email}** to confirm that we’ve received your enquiry',
              'If you don’t get this email, check your spam or junk mail folder',
            ]
          : [],
    });
  });

  it('renders the component', () => {
    const { container } = render(<Confirmation entry={mockEntry} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the "What happens next" section with list items', () => {
    render(<Confirmation entry={mockEntry} />);

    // Check the "What happens next" title
    expect(
      screen.getByTestId('confirmation-what-happens-next-title'),
    ).toHaveTextContent('components.confirmation.what-happens-next.title');

    // Check the list items
    const listItems = screen.getByTestId(
      'confirmation-what-happens-next-list',
    ).children;

    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent(
      'We’ll send you an email to test@example.com to confirm that we’ve received your enquiry',
    );
    expect(listItems[1]).toHaveTextContent(
      'If you don’t get this email, check your spam or junk mail folder',
    );
  });

  it('handles missing email gracefully', () => {
    const { container } = render(<Confirmation entry={undefined} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
