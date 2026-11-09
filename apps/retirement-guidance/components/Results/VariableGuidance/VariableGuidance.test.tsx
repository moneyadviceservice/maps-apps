import { render, screen } from '@testing-library/react';

import { VariableGuidance } from './VariableGuidance';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.variableGuidance.heading': 'What to do first',
        'results.variableGuidance.debt23a.title': 'Managing your debt advice',
        'results.variableGuidance.overseas8.title': 'Overseas pension guidance',
        'results.variableGuidance.employment02.title':
          'Check if your employer will pay more into your pension',
        'results.variableGuidance.employment02a.title':
          'Check if you can boost your pension by making extra contributions',
        'results.variableGuidance.employment02b.title':
          'Check if you can boost your pension by making extra contributions',
        'results.variableGuidance.employment03.title':
          "Ask to join your employer's pension scheme",
        'results.variableGuidance.employment04.title':
          'Check the cost of increasing your contributions and benefit from extra tax relief',
        'results.variableGuidance.employment05.title': 'Start your own pension',
        'results.variableGuidance.employment06.title':
          "Check if you're saving enough for retirement",
        'results.variableGuidance.employment07.title': 'Start your own pension',
        'results.variableGuidance.employment07a.title':
          'Consider paying into your own pension',
      };
      return translations[key] || key;
    },
  })),
}));

describe('VariableGuidance', () => {
  it('should display variable guidance heading and debt23a and overseas8 sections', () => {
    const data = { 'q-5': '0,1,3', 'q-7': '0', 'q-11': '0' };
    render(<VariableGuidance data={data} />);
    const heading = screen.getByRole('heading', {
      name: 'What to do first',
    });
    expect(heading).toBeInTheDocument();

    const debt23a = screen.getByTestId('debt-23a-section');
    expect(debt23a).toBeInTheDocument();

    const overseas8 = screen.getByTestId('overseas-8-section');
    expect(overseas8).toBeInTheDocument();
  });

  // Employment: employer (q-3=0) + paying into pension (q-4=0)
  describe('employer contributing employment sections', () => {
    it('should show employment-02 section when DC only (q-5=0)', () => {
      const data = { 'q-3': '0', 'q-4': '0', 'q-5': '0' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-02-section')).toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-02a-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-02b-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-03-section'),
      ).not.toBeInTheDocument();
    });

    it('should show employment-02a section when DB only (q-5=1)', () => {
      const data = { 'q-3': '0', 'q-4': '0', 'q-5': '1' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-02a-section')).toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-02-section'),
      ).not.toBeInTheDocument();
    });

    it.each([
      ['employment-02b-section', 'DB combined with DC (q-5=0,1)', '0,1'],
      ['employment-02b-section', 'not sure about pension type (q-5=4)', '4'],
      ['employment-03-section', 'State Pension only (q-5=2)', '2'],
    ])('should show %s when %s', (testId, _label, q5) => {
      const data = { 'q-3': '0', 'q-4': '0', 'q-5': q5 };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  describe('employer not contributing employment section', () => {
    it.each([
      ['not paying into pension (q-4=1)', '1', '0'],
      ['not sure about pension contributions (q-4=2)', '2', '1'],
    ])('should show employment-03 section when %s', (_label, q4, q5) => {
      const data = { 'q-3': '0', 'q-4': q4, 'q-5': q5 };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-03-section')).toBeInTheDocument();
    });
  });

  describe.each([
    ['self-employed', '1', 'employment-04-section', 'employment-05-section'],
    ['not employed', '2', 'employment-06-section', 'employment-07-section'],
  ])('%s paying into pension', (_label, q3, shownId, otherId) => {
    it.each([
      ['DC (q-5=0)', '0'],
      ['not sure (q-5=4)', '4'],
    ])('should show the section when pension type is %s', (_type, q5) => {
      render(<VariableGuidance data={{ 'q-3': q3, 'q-4': '0', 'q-5': q5 }} />);
      expect(screen.getByTestId(shownId)).toBeInTheDocument();
      expect(screen.queryByTestId(otherId)).not.toBeInTheDocument();
    });

    it('should show no section with DB only (q-5=1)', () => {
      render(<VariableGuidance data={{ 'q-3': q3, 'q-4': '0', 'q-5': '1' }} />);
      expect(screen.queryByTestId(shownId)).not.toBeInTheDocument();
      expect(screen.queryByTestId(otherId)).not.toBeInTheDocument();
    });
  });

  describe('self-employed employment sections', () => {
    it.each([
      ['not paying into pension (q-4=1)', '1', '0'],
      ['not sure about pension contributions (q-4=2)', '2', '2'],
    ])(
      'should show employment-05 section when self-employed %s',
      (_label, q4, q5) => {
        const data = { 'q-3': '1', 'q-4': q4, 'q-5': q5 };
        render(<VariableGuidance data={data} />);
        expect(screen.getByTestId('employment-05-section')).toBeInTheDocument();
      },
    );
  });

  describe('not employed employment sections', () => {
    it('should show employment-07 section when more than 10 years and not paying into pension', () => {
      const data = { 'q-2': '1', 'q-3': '2', 'q-4': '1', 'q-5': '2' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-07-section')).toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-07a-section'),
      ).not.toBeInTheDocument();
    });

    it.each(['0', '2'])(
      'should show employment-07a section when not paying into pension and q-2=%s',
      (q2) => {
        const data = { 'q-2': q2, 'q-3': '2', 'q-4': '1', 'q-5': '2' };
        render(<VariableGuidance data={data} />);
        expect(
          screen.getByTestId('employment-07a-section'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('employment-07-section'),
        ).not.toBeInTheDocument();
      },
    );

    it('should show employment-07a section when already retired and not sure about contributions', () => {
      const data = { 'q-2': '2', 'q-3': '2', 'q-4': '2', 'q-5': '0' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-07a-section')).toBeInTheDocument();
    });
  });

  describe('no employment section shown', () => {
    it('should not show any employment section when employment status is unset', () => {
      const data = { 'q-4': '0', 'q-5': '0' };
      render(<VariableGuidance data={data} />);
      expect(
        screen.queryByTestId('employment-02-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-03-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-04-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-05-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-06-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-07-section'),
      ).not.toBeInTheDocument();
    });
  });
});
