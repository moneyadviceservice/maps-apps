import { render, screen } from '@testing-library/react';
import { HaveYouTried } from '../components/HaveYouTried';
import useTranslation from '@maps-react/hooks/useTranslation';
import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

describe('HaveYouTried', () => {
  const mockZ = jest.fn(({ en }) => en);

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (key: { en: string; cy: string }) => key.en,
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders heading and description paragraph', () => {
    render(<HaveYouTried isEmbedded={false} z={mockZ} />);

    expect(
      screen.getByRole('heading', { name: 'Have you tried?' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'We have other tools that can help you understand and prepare for purchasing a property.',
      ),
    ).toBeInTheDocument();
  });

  it('sets target="_blank" on links when isEmbedded is true', () => {
    render(<HaveYouTried isEmbedded={true} z={mockZ} />);

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
    }
  });
  it('does not set target to _blank when isEmbedded is false', () => {
    render(<HaveYouTried isEmbedded={false} z={mockZ} />);

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_top');
    }
  });
});
