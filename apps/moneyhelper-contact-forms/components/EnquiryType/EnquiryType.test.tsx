import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getFieldError } from '../../lib/utils';
import { EnquiryType } from './EnquiryType';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('EnquiryType Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => [
        { value: 'pension-retirement', label: 'Pension and retirement' },
      ],
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<EnquiryType />);
    expect(container).toMatchSnapshot();
  });

  it('renders error message when there is an error', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { getByTestId, container } = render(
      <EnquiryType errors={[{ field: 'flow', message: 'error' }]} />,
    );
    expect(getByTestId('flow-error')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('does not render error message when there is no error', () => {
    const { queryByTestId, container } = render(<EnquiryType />);
    expect(queryByTestId('flow-error')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it.each`
    description       | text
    ${'title'}        | ${'components.enquiry-type.title'}
    ${'radio button'} | ${'Pension and retirement'}
  `('renders title and radio button labels', () => {
    const { container } = render(<EnquiryType />);
    expect(container).toMatchSnapshot();
  });
});
