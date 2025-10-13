import { render } from '@testing-library/react';
import ResetCalculator from '../ResetCalculator';

jest.mock('@maps-react/hooks/useTranslation', () => {
  return jest.fn(() => ({
    z: (t: { en: string; cy: string }) => t.en,
  }));
});

const defaultProps = {
  title: {
    en: 'Reset the calculator',
    cy: 'Ailosod y gyfrifiannell',
  },
  description: {
    en: 'Are you sure you want to clear your budget information?',
    cy: "Ydych chi'n siŵr eich bod am glirio'ch holl wybodaeth Gyllideb?",
  },
  confirmLabel: { en: 'Confirm', cy: 'Cadarnhau' },
  cancelLabel: { en: 'Cancel', cy: 'Canslo' },
  confirmAction: '/api/reset-calculator',
  cancelAction: 'api/cancel',
  onCancelClick: () => console.log('Cancel clicked'),
};

describe('ResetCalculator component', () => {
  it('renders correctly', () => {
    const { container } = render(<ResetCalculator {...defaultProps} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
