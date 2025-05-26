import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { EnquiryType } from '.';
import { getFieldError } from '../../lib/utils';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('EnquiryType Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => [{ value: 'enquiry-type-value', label: 'Enquiry type' }],
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<EnquiryType />);
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <EnquiryType errors={[{ field: 'mock-field', message: 'mock-error' }]} />,
    );
    expect(container).toMatchSnapshot();
  });
});
