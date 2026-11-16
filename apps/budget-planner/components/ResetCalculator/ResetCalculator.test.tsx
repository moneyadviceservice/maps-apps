import { render } from '@testing-library/react';
import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';
import ResetCalculator from '../ResetCalculator';

jest.mock('@maps-react/hooks/useTranslation', () => {
  return jest.fn(() => ({
    t: (key: string) => mockTranslationDataEn[key] ?? key,
  }));
});

const defaultProps = {
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
