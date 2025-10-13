import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { OptionTypes } from '.';
import { mockRadioOptions } from '../../lib/mocks';
import { getFieldError } from '../../lib/utils';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');

const mockUseTranslation = useTranslation as jest.Mock;
const mockStep = 'mock-step';

// Mock the `useTranslation` hook
describe('OptionTypes Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockRadioOptions,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<OptionTypes step={mockStep} />);
    expect(container).toMatchSnapshot();
  });

  it('renders error message when there is an error', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { getByTestId, container } = render(
      <OptionTypes errors={{ flow: ['error'] }} step={mockStep} />,
    );
    expect(getByTestId('flow-error')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('does not render error message when there is no error', () => {
    const { queryByTestId, container } = render(
      <OptionTypes step={mockStep} />,
    );
    expect(queryByTestId('flow-error')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
