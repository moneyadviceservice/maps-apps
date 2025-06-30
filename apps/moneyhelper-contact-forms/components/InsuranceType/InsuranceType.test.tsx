import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { InsuranceType } from '.';
import { mockRadioOptions } from '../../lib/mocks';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('InsuranceType Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<InsuranceType flow="flow" />);
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    const { container } = render(
      <InsuranceType
        errors={[{ field: 'mock-field', message: 'mock-error' }]}
        flow="flow"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
