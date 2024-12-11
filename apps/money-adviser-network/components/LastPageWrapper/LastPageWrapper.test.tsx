import { fireEvent, render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { LastPageWrapper } from './LastPageWrapper';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

describe('LastPageWrapper', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders heading, BackLink, and children correctly', () => {
    const { container } = render(
      <LastPageWrapper heading="Test Heading" backLink="/test-back">
        <div>Test Child Content</div>
      </LastPageWrapper>,
    );

    expect(
      screen.getByRole('heading', { name: 'Test Heading' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/test-back',
    );
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('conditionally renders the copy button if copyText is provided', () => {
    render(
      <LastPageWrapper
        heading="Test Heading"
        backLink="/test-back"
        copyText="Copy this text"
        copyButtonLabel="Copy these details"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Copy these details' }),
    ).toBeInTheDocument();
  });

  it('does not render the copy button if copyText is not provided', () => {
    render(<LastPageWrapper heading="Test Heading" backLink="/test-back" />);
    expect(
      screen.queryByRole('button', { name: 'Copy these details' }),
    ).not.toBeInTheDocument();
  });

  it('copies text to clipboard when copy button is clicked', async () => {
    const writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(writeTextMock),
      },
    });

    const { getByTestId } = render(
      <LastPageWrapper
        heading="Test Heading"
        backLink="/test-back"
        copyText="Copy this text"
        copyButtonLabel="Copy these details"
      />,
    );

    fireEvent.click(getByTestId('copy-to-clipboard-button'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Copy this text',
    );
  });

  it('renders sign out and restart tool buttons with correct links and text', () => {
    render(<LastPageWrapper heading="Test Heading" backLink="/test-back" />);

    const signOutButton = screen.getByTestId('sign-out-button');
    expect(signOutButton).toHaveAttribute('href', '/api/logout');
    expect(signOutButton).toHaveTextContent('Sign out');

    const restartButton = screen.getByTestId('restart-tool-button');
    expect(restartButton).toHaveAttribute(
      'href',
      '/en/money-adviser-network/start/q-1',
    );
    expect(restartButton).toHaveTextContent('Make another referral');
  });
});
