import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';

import { OtherTools } from './OtherTools';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (translations: { en: string; cy: string }) => translations.en,
  }),
}));
jest.mock(
  '../../public/images/teaser-card-images/calculator_house.png',
  () => ({
    src: '/images/teaser-card-images/calculator_house.png',
    height: 100,
    width: 100,
    blurDataURL: 'data:image/jpeg;base64,fake',
  }),
);
jest.mock(
  '../../public/images/teaser-card-images/calculator_house2.png',
  () => ({
    src: '/images/teaser-card-images/calculator_house2.png',
    height: 100,
    width: 100,
    blurDataURL: 'data:image/jpeg;base64,fake',
  }),
);
describe('OtherTools Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { language: 'en' },
    });
  });

  it('renders the heading', () => {
    render(<OtherTools />);
    const heading = screen.getByRole('heading', {
      name: /Other tools to try/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the first TeaserCard with correct title and description', () => {
    render(<OtherTools />);
    const title = screen.getByRole('heading', {
      name: /Calculate the mortgage you can afford/i,
    });
    const description = screen.getByText(
      /This tool can help you estimate how much you can afford to borrow to buy a home./i,
    );
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('renders the second TeaserCard with correct title and description', () => {
    render(<OtherTools />);
    const title = screen.getByRole('heading', {
      name: /Calculate your Stamp Duty/i,
    });
    const description = screen.getByText(
      /Find out with this tool what tax may be due when buying your home./i,
    );
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('opens links in a new tab when isEmbedded is true', () => {
    render(<OtherTools isEmbedded={true} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('does not open links in a new tab when isEmbedded is false', () => {
    render(<OtherTools isEmbedded={false} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).not.toHaveAttribute('target', '_blank');
    });
  });
});
