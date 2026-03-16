import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { OptionTypes } from '.';
import { mockRadioOptions, mockSteps } from '../../mocks';
import { getFieldError } from '../../utils';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../utils');

const mockUseTranslation = useTranslation as jest.Mock;

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
    const { container } = render(<OptionTypes step={mockSteps[0]} />);
    expect(container).toMatchSnapshot();
  });

  it('renders error message when there is an error', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <OptionTypes errors={{ flow: ['error'] }} step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('does not render error message when there is no error', () => {
    const { queryByTestId, container } = render(
      <OptionTypes step={mockSteps[0]} />,
    );
    expect(queryByTestId('flow-error')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
