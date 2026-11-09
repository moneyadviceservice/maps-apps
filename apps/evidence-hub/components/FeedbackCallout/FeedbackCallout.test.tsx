import { render, screen } from '@testing-library/react';

import { FeedbackCallout } from './FeedbackCallout';

import '@testing-library/jest-dom';

describe('FeedbackCallout', () => {
  it('renders the feedback prompt with a mailto link', () => {
    render(<FeedbackCallout />);

    expect(
      screen.getByText('Give us your feedback or ask a question'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'what.works@maps.org.uk' }),
    ).toHaveAttribute('href', 'mailto:what.works@maps.org.uk');
  });
});
