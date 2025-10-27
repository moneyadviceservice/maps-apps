import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { EnquiryType } from '.';
import { mockRadioOptions } from '../../lib/mocks';
import { getFieldError } from '../../lib/utils';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');

const mockUseTranslation = useTranslation as jest.Mock;
const mockStep = 'mock-step';

// Mock the `useTranslation` hook
describe('EnquiryType Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<EnquiryType step={mockStep} />);
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <EnquiryType errors={{ 'mock-field': ['mock-error'] }} step={mockStep} />,
    );
    expect(container).toMatchSnapshot();
  });
});
