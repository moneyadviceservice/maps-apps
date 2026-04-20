import { render } from '@testing-library/react';

import {
  mockEntry,
  mockErrors,
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AccessOptions } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

// Mock the `useTranslation` hook
describe('AccessOptions Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      z: (translations: { en: JSX.Element; cy: JSX.Element }) =>
        translations.en,
      tList: () => mockRadioOptions,
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(<AccessOptions step={mockSteps[0]} />);
    expect(container).toMatchSnapshot();
  });

  it('renders component textArea error correctly', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <AccessOptions errors={mockErrors} step={mockSteps[0]} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders with entry data populated', () => {
    const entry = {
      ...mockEntry,
      data: {
        ...mockEntry.data,
        'access-options-text-area': 'Need wheelchair access at the venue.',
      },
    };

    const { container } = render(
      <AccessOptions step={mockSteps[0]} entry={entry} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
