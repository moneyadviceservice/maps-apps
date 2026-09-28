import { render, screen } from '@testing-library/react';

import { AccountSectionStatusBadge } from './AccountSectionStatusBadge';

import '@testing-library/jest-dom';

describe('AccountSectionStatusBadge', () => {
  it.each([
    ['completed', 'completed'],
    ['in_progress', 'in progress'],
    ['not_started', 'not started'],
  ] as const)('renders %s badge with expected label', (status, label) => {
    render(<AccountSectionStatusBadge status={status} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
