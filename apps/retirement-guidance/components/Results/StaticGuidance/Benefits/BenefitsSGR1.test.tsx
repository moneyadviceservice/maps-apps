import { render, screen } from '@testing-library/react';

import { BenefitsSGR1 } from './BenefitsSGR1';

import '@testing-library/jest-dom';

const translations: Record<string, string> = {
  'results.staticGuidance.benefitsSGR1.title':
    'Check if you’re entitled to any payments, grants and discounts',
  'results.staticGuidance.benefitsSGR1.paragraph1':
    'Many people do not realise that they’re entitled to extra support.',
  'results.staticGuidance.benefitsSGR1.paragraph2':
    'Our quick and easy Benefits calculator can show you what you might be eligible for now.',
  'results.staticGuidance.benefitsSGR1.paragraph3':
    'Any extra payments you get could help support your current costs.',
  'results.staticGuidance.benefitsSGR1.paragraph4':
    'After you retire, you might also be able to get help paying certain costs. For example:',
  'results.staticGuidance.benefitsSGR1.list1': 'help with your heating bills',
  'results.staticGuidance.benefitsSGR1.list2': 'a free bus pass',
  'results.staticGuidance.benefitsSGR1.list3': 'a free TV licence',
  'results.staticGuidance.benefitsSGR1.list4': 'help with dental treatment.',
  'results.staticGuidance.benefitsSGR1.paragraph5':
    'Find out more in our guide about benefits in retirement.',
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => translations[key] || key,
  })),
}));

describe('BenefitsSGR1', () => {
  it('should render the component', () => {
    render(<BenefitsSGR1 />);

    expect(
      screen.getByTestId('retirement-benefits-section'),
    ).toBeInTheDocument();
  });

  it('should render the correct title', () => {
    render(<BenefitsSGR1 />);

    expect(
      screen.getByText(
        'Check if you’re entitled to any payments, grants and discounts',
      ),
    ).toBeInTheDocument();
  });

  it.each([
    'paragraph1',
    'paragraph2',
    'paragraph3',
    'paragraph4',
    'paragraph5',
  ])('should render %s content', (key) => {
    render(<BenefitsSGR1 />);

    expect(
      screen.getByText(
        translations[`results.staticGuidance.benefitsSGR1.${key}`],
      ),
    ).toBeInTheDocument();
  });

  it('should render the list of costs', () => {
    render(<BenefitsSGR1 />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent('help with your heating bills');
    expect(items[1]).toHaveTextContent('a free bus pass');
    expect(items[2]).toHaveTextContent('a free TV licence');
    expect(items[3]).toHaveTextContent('help with dental treatment.');
  });
});
