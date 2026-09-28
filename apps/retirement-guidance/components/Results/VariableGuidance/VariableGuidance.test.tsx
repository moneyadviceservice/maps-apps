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

    it('should show employment-02b section when DB combined with DC (q-5=0,1)', () => {
      const data = { 'q-3': '0', 'q-4': '0', 'q-5': '0,1' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-02b-section')).toBeInTheDocument();
    });

    it('should show employment-02b section when not sure about pension type (q-5=4)', () => {
      const data = { 'q-3': '0', 'q-4': '0', 'q-5': '4' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-02b-section')).toBeInTheDocument();
    });

    it('should show employment-03 section when State Pension only (q-5=2)', () => {
      const data = { 'q-3': '0', 'q-4': '0', 'q-5': '2' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-03-section')).toBeInTheDocument();
    });
  });

  describe('employer not contributing employment section', () => {
    it('should show employment-03 section when not paying into pension (q-4=1)', () => {
      const data = { 'q-3': '0', 'q-4': '1', 'q-5': '0' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-03-section')).toBeInTheDocument();
    });

    it('should show employment-03 section when not sure about pension contributions (q-4=2)', () => {
      const data = { 'q-3': '0', 'q-4': '2', 'q-5': '1' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-03-section')).toBeInTheDocument();
    });
  });

  describe('self-employed employment sections', () => {
    it('should show employment-04 section when self-employed paying into pension with DC (q-3=1, q-4=0, q-5=0)', () => {
      const data = { 'q-3': '1', 'q-4': '0', 'q-5': '0' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-04-section')).toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-05-section'),
      ).not.toBeInTheDocument();
    });

    it('should show no employment section when self-employed paying into pension with DB only (q-3=1, q-4=0, q-5=1)', () => {
      const data = { 'q-3': '1', 'q-4': '0', 'q-5': '1' };
      render(<VariableGuidance data={data} />);
      expect(
        screen.queryByTestId('employment-04-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-05-section'),
      ).not.toBeInTheDocument();
    });

    it('should show employment-05 section when self-employed not paying into pension (q-3=1, q-4=1)', () => {
      const data = { 'q-3': '1', 'q-4': '1', 'q-5': '0' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-05-section')).toBeInTheDocument();
    });

    it('should show employment-05 section when self-employed not sure about pension contributions (q-3=1, q-4=2)', () => {
      const data = { 'q-3': '1', 'q-4': '2', 'q-5': '2' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-05-section')).toBeInTheDocument();
    });
  });

  describe('not employed employment sections', () => {
    it('should show employment-06 section when not employed paying into pension with DC (q-3=2, q-4=0, q-5=0)', () => {
      const data = { 'q-3': '2', 'q-4': '0', 'q-5': '0' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-06-section')).toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-07-section'),
      ).not.toBeInTheDocument();
    });

    it('should show no employment section when not employed paying into pension with DB only (q-3=2, q-4=0, q-5=1)', () => {
      const data = { 'q-3': '2', 'q-4': '0', 'q-5': '1' };
      render(<VariableGuidance data={data} />);
      expect(
        screen.queryByTestId('employment-06-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('employment-07-section'),
      ).not.toBeInTheDocument();
    });

    it('should show employment-06 section when not employed paying into pension with not sure (q-3=2, q-4=0, q-5=4)', () => {
      const data = { 'q-3': '2', 'q-4': '0', 'q-5': '4' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-06-section')).toBeInTheDocument();
    });

    it('should show employment-07 section when not employed not paying into pension (q-3=2, q-4=1)', () => {
      const data = { 'q-3': '2', 'q-4': '1', 'q-5': '2' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-07-section')).toBeInTheDocument();
    });

    it('should show employment-07 section when not employed not sure about pension contributions (q-3=2, q-4=2)', () => {
      const data = { 'q-3': '2', 'q-4': '2', 'q-5': '0' };
      render(<VariableGuidance data={data} />);
      expect(screen.getByTestId('employment-07-section')).toBeInTheDocument();
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
