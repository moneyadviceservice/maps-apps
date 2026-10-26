import { useRouter } from 'next/router';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useLanguage } from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Timeout } from './Timeout';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useLanguage: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation');

describe('Timeout Component', () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseLanguage = useLanguage as jest.Mock;

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    jest.useFakeTimers();
    mockUseRouter.mockReturnValue({ pathname: '/' });
    mockUseLanguage.mockReturnValue('en');
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.resetAllMocks();
  });

  it('should render TimeoutModal when timed out', async () => {
    render(<Timeout duration={1000} modalDuration={5000} />);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByTestId('timeout-dialog')).toBeInTheDocument();
    });
  });

  it('should close TimeoutModal when closed', async () => {
    render(<Timeout duration={1000} modalDuration={5000} />);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('close-dialog'));
    });

    await waitFor(() => {
      expect(screen.queryByTestId('timeout-dialog')).not.toBeInTheDocument();
    });
  });

  it('should reset timeout on mousemove', async () => {
    render(<Timeout duration={1000} modalDuration={5000} />);

    fireEvent.mouseMove(window);
    jest.advanceTimersByTime(500);
    fireEvent.mouseMove(window);
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.queryByTestId('close-dialog')).not.toBeInTheDocument();
    });
  });

  it('should reset timeout on keydown', async () => {
    render(<Timeout duration={1000} modalDuration={5000} />);

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    jest.advanceTimersByTime(500);
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.queryByText('Close')).not.toBeInTheDocument();
    });
  });
});
