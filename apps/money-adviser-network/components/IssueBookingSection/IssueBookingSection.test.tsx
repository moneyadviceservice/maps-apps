import { render } from '@testing-library/react';

import { APIS } from '../../CONSTANTS';
import { IssueBookingSection } from './IssueBookingSection';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn((obj) => obj.en),
  }),
}));

describe('IssueBookingSection', () => {
  const defaultProps = {
    lang: 'en',
  };

  it('renders the alternative method of referral message', () => {
    const { getByText } = render(<IssueBookingSection {...defaultProps} />);
    expect(
      getByText('Alternatively, pick a different method of referral:'),
    ).toBeInTheDocument();
  });

  it('renders the link to choose another referral method', () => {
    const { getByTestId } = render(<IssueBookingSection {...defaultProps} />);
    const link = getByTestId('another-referral=link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/en/start/q-4?q-1=1&q-2=0&q-3=1');
  });

  it('renders the correct additional text when noSlots is true', () => {
    const { getByText } = render(
      <IssueBookingSection {...defaultProps} noSlots={true} />,
    );
    expect(
      getByText(', this could be online or face-to-face.'),
    ).toBeInTheDocument();
  });

  it('renders the correct additional text when noSlots is false', () => {
    const { getByText } = render(
      <IssueBookingSection {...defaultProps} noSlots={false} />,
    );
    expect(
      getByText(
        ', this could be online, face-to-face or to have an immediate call back on the telephone.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the sign-out button with the correct properties', () => {
    const { getByTestId } = render(<IssueBookingSection {...defaultProps} />);
    const button = getByTestId('sign-out-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', `/${APIS.LOGOUT}`);
    expect(button).toHaveTextContent('Sign out');
  });

  it('renders the restart tool button with the correct properties', () => {
    const { getByTestId } = render(<IssueBookingSection {...defaultProps} />);
    const button = getByTestId('restart-tool-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', `/${APIS.RESTART_TOOL}?lang=en`);
    expect(button).toHaveTextContent('Make another referral');
  });
});
