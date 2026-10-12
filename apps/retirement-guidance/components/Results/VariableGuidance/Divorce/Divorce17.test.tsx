import { render, screen } from '@testing-library/react';
import { Divorce17 } from './Divorce17';
import '@testing-library/jest-dom';

const mockTranslations: Record<string, string | string[]> = {
  'results.variableGuidance.divorce17.title':
    'Decide how to split your pensions in a divorce or dissolution',
  'results.variableGuidance.divorce17.paragraph1':
    'Always include pensions in a divorce or dissolution settlement, even if you’ve agreed to keep them separate.',
  'results.variableGuidance.divorce17.paragraph2':
    'This is because they might be your biggest assets and can be worth more than your home, so you might not be getting a fair deal.',
  'results.variableGuidance.divorce17.paragraph3':
    'You can usually choose to use one or more of these options:',
  'results.variableGuidance.divorce17.list1': [
    'transfer a portion of one person’s pension to another, called pension sharing',
    'ask the pension provider to pay a share of the future pension income to each of you, called pension attachment or earmarking',
    'keep the full pension and let the other partner take other assets of similar value, called pension offsetting.',
  ],
  'results.variableGuidance.divorce17.paragraph4':
    'You’ll normally need to decide how your pensions are split between you – they do not always need to be shared equally. You could consider using a mediator to help you decide.',
  'results.variableGuidance.divorce17.paragraph5':
    'For more information, see [How to split pensions in a divorce or dissolution](https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/split-pensions-in-a-divorce-or-dissolution). You can also book a free [Pensions and divorce or dissolution appointment](https://www.moneyhelper.org.uk/en/family-and-care/divorce-and-separation/divorce-dissolution-pensions-appointment) to get impartial guidance on your options from one of our pension specialists.',
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => mockTranslations[key] ?? key,
    tList: (key: string) => mockTranslations[key] ?? key,
  })),
}));

describe('Divorce17', () => {
  it('should render the component', () => {
    render(<Divorce17 />);

    const expandableSection = screen.getByTestId('divorce-17-section');
    expect(expandableSection).toMatchSnapshot();

    const title = screen.getByTestId('summary-block-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(
      'Decide how to split your pensions in a divorce or dissolution',
    );

    const paragraphs = screen.getAllByRole('paragraph');
    expect(paragraphs).toHaveLength(5);
    expect(paragraphs[0]).toHaveTextContent(
      'Always include pensions in a divorce or dissolution settlement, even if you’ve agreed to keep them separate.',
    );
    expect(paragraphs[1]).toHaveTextContent(
      'This is because they might be your biggest assets and can be worth more than your home, so you might not be getting a fair deal.',
    );
    expect(paragraphs[2]).toHaveTextContent(
      'You can usually choose to use one or more of these options:',
    );
    expect(paragraphs[3]).toHaveTextContent(
      'You’ll normally need to decide how your pensions are split between you – they do not always need to be shared equally. You could consider using a mediator to help you decide.',
    );
    expect(paragraphs[4]).toHaveTextContent(
      'For more information, see How to split pensions in a divorce or dissolution. You can also book a free Pensions and divorce or dissolution appointment to get impartial guidance on your options from one of our pension specialists.',
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent(
      'transfer a portion of one person’s pension to another, called pension sharing',
    );
    expect(listItems[1]).toHaveTextContent(
      'ask the pension provider to pay a share of the future pension income to each of you, called pension attachment or earmarking',
    );
    expect(listItems[2]).toHaveTextContent(
      'keep the full pension and let the other partner take other assets of similar value, called pension offsetting.',
    );
  });
});
