import { render, screen } from '@testing-library/react';

import AccountCheckboxes, { AccountCheckboxProps } from './AccountCheckboxes';

import '@testing-library/jest-dom';

jest.mock('@maps-react/common/assets/images/close-red.svg', () => {
  const CloseRedIcon = () => <svg data-testid="false-icon" />;
  CloseRedIcon.displayName = 'CloseRedIcon';
  return CloseRedIcon;
});
jest.mock('@maps-react/common/assets/images/tick-green.svg', () => {
  const TickGreenIcon = () => <svg data-testid="tick-icon" />;
  TickGreenIcon.displayName = 'TickGreenIcon';
  return TickGreenIcon;
});

describe('AccountCheckboxes', () => {
  const defaultProps: AccountCheckboxProps = {
    title: 'Account Settings',
    fields: [
      { label: 'Email Notifications', checked: true },
      { label: 'SMS Alerts', checked: false },
    ],
  };

  it('renders the title correctly', () => {
    render(<AccountCheckboxes {...defaultProps} />);
    const title = screen.getByText(/Account Settings/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the correct number of fields', () => {
    render(<AccountCheckboxes {...defaultProps} />);
    const checkboxes = screen.getAllByText(/Email Notifications|SMS Alerts/i);
    expect(checkboxes).toHaveLength(2);
  });

  it('correctly displays the (checked) and (not checked) sr-only text', () => {
    render(<AccountCheckboxes {...defaultProps} />);

    const checkedText = screen.getByText('(checked)');
    expect(checkedText).toBeInTheDocument();

    const notCheckedText = screen.getByText('(not checked)');
    expect(notCheckedText).toBeInTheDocument();
  });

  it('handles an empty fields array gracefully', () => {
    const emptyProps = { ...defaultProps, fields: [] };
    render(<AccountCheckboxes {...emptyProps} />);
    const noFieldsMessage = screen.queryByText(
      /Email Notifications|SMS Alerts/i,
    );
    expect(noFieldsMessage).toBeNull();
  });
});
