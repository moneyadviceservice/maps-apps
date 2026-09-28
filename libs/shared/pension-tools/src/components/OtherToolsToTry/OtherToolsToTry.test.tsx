import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';

import { OtherToolsToTry } from './OtherToolsToTry';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

const mockPensionCalculatorImage: StaticImageData = {
  src: '/images/pension-calculator.jpg',
  height: 300,
  width: 400,
};

const mockBenefitsCalculatorImage: StaticImageData = {
  src: '/images/benefits-calculator.jpg',
  height: 300,
  width: 400,
};

const content = {
  title: 'Other tools to try',
  toolCards: [
    {
      id: 1,
      href: 'https://www.moneyhelper.org.uk/en/everyday-money/pension-calculator',
      image: mockPensionCalculatorImage,
      title: 'Pension calculator',
      description:
        'Find out how much you might need to save for retirement and the income you’re on track to get.',
    },
    {
      id: 2,
      href: 'https://www.moneyhelper.org.uk/en/everyday-money/benefits-calculator',
      image: mockBenefitsCalculatorImage,
      title: 'Benefits calculator',
      description:
        'Check if you’re entitled to any extra payments or grants, including Universal Credit and Pension Credit.',
    },
  ],
};
describe('test OtherToolsToTry component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { language: 'en' },
      asPath: '/en',
    });
  });

  it('should render the component', () => {
    const { container } = render(<OtherToolsToTry content={content} />);
    expect(container).toMatchSnapshot();

    // Title
    expect(
      screen.getByRole('heading', { name: /Other tools to try/i }),
    ).toBeInTheDocument();

    // Tool cards
    const listItems = screen.getAllByRole('link');
    expect(listItems).toHaveLength(2);

    expect(listItems[0]).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/everyday-money/pension-calculator',
    );
    expect(
      screen.getByRole('heading', { name: /pension calculator/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /find out how much you might need to save for retirement and the income you’re on track to get./i,
      ),
    ).toBeInTheDocument();
  });
});
