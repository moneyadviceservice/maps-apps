import { render, screen } from '@testing-library/react';

import { StatePensionEligibilitySGR7 } from './StatePensionEligibilitySGR7';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.staticGuidance.statePensionEligibilitySGR7.title':
          "Check you're on track to get the full State Pension",
        'results.staticGuidance.statePensionEligibilitySGR7.paragraph1':
          "The amount of State Pension you'll get depends on how many years of National Insurance contributions or credits you have when you reach your State Pension age.",
        'results.staticGuidance.statePensionEligibilitySGR7.paragraph2':
          "You can check your State Pension forecast on GOV.UK to see what you're on track to get.",
        'results.staticGuidance.statePensionEligibilitySGR7.paragraph3':
          "If you won't reach your State Pension age within 30 days, you can also:",
        'results.staticGuidance.statePensionEligibilitySGR7.list1':
          'call the Future Pension Centre helpline',
        'results.staticGuidance.statePensionEligibilitySGR7.list2':
          'apply by post.',
        'results.staticGuidance.statePensionEligibilitySGR7.paragraph4':
          'If your forecast shows you might not qualify for the full amount, there are ways to increase your State Pension – including claiming free credits or paying to fill gaps in your record.',
        'results.staticGuidance.statePensionEligibilitySGR7.paragraph5':
          'This can mean you pay hundreds now to get thousands back in extra income later – depending on how long you live for.',
        'results.staticGuidance.statePensionEligibilitySGR7.paragraph6':
          'For step-by-step help, see our guide Increase your State Pension with voluntary National Insurance contributions.',
      };
      return translations[key] || key;
    },
  })),
}));

describe('StatePensionEligibilitySGR7', () => {
  it('should render the component', () => {
    render(<StatePensionEligibilitySGR7 />);

    const section = screen.getByTestId(
      'state-pension-eligibility-sgr7-section',
    );
    expect(section).toBeInTheDocument();
  });

  it('should render the correct title', () => {
    render(<StatePensionEligibilitySGR7 />);

    const title = screen.getByText(
      "Check you're on track to get the full State Pension",
    );
    expect(title).toBeInTheDocument();
  });

  it('should render the first paragraph content', () => {
    render(<StatePensionEligibilitySGR7 />);

    const paragraph1 = screen.getByText(
      "The amount of State Pension you'll get depends on how many years of National Insurance contributions or credits you have when you reach your State Pension age.",
    );
    expect(paragraph1).toBeInTheDocument();
  });

  it('should render the second paragraph content', () => {
    render(<StatePensionEligibilitySGR7 />);

    const paragraph2 = screen.getByText(
      "You can check your State Pension forecast on GOV.UK to see what you're on track to get.",
    );
    expect(paragraph2).toBeInTheDocument();
  });

  it('should render the third paragraph content', () => {
    render(<StatePensionEligibilitySGR7 />);

    expect(
      screen.getByText(
        "If you won't reach your State Pension age within 30 days, you can also:",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('call the Future Pension Centre helpline'),
    ).toBeInTheDocument();
    expect(screen.getByText('apply by post.')).toBeInTheDocument();
  });

  it('should render the fourth paragraph content', () => {
    render(<StatePensionEligibilitySGR7 />);

    const paragraph4 = screen.getByText(
      'If your forecast shows you might not qualify for the full amount, there are ways to increase your State Pension – including claiming free credits or paying to fill gaps in your record.',
    );
    expect(paragraph4).toBeInTheDocument();
  });

  it('should render the fifth paragraph content', () => {
    render(<StatePensionEligibilitySGR7 />);

    const paragraph5 = screen.getByText(
      'This can mean you pay hundreds now to get thousands back in extra income later – depending on how long you live for.',
    );
    expect(paragraph5).toBeInTheDocument();
  });

  it('should render the sixth paragraph content', () => {
    render(<StatePensionEligibilitySGR7 />);

    const paragraph6 = screen.getByText(
      'For step-by-step help, see our guide Increase your State Pension with voluntary National Insurance contributions.',
    );
    expect(paragraph6).toBeInTheDocument();
  });
});
