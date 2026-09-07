import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mockEntry,
  mockErrors,
  mockRadioOptions,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AccessLanguage } from '.';
import { FlowName } from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

describe('AccessLanguage Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) => {
        if (key.includes('select.options')) {
          return [
            { text: 'English', value: 'english' },
            { text: 'Other language', value: 'other' },
          ];
        }

        return mockRadioOptions;
      },
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
    entry = {
      ...mockEntry,
      data: { flow: FlowName.SELF_EMPLOYED },
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AccessLanguage step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component textArea error correctly', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <AccessLanguage entry={entry} errors={mockErrors} step={mockSteps[0]} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders the text input when other is selected', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <AccessLanguage step={mockSteps[0]} entry={entry} />,
    );

    const select = container.querySelector(
      'select[name="accessLanguageType"]',
    ) as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    await user.selectOptions(select, 'other');

    expect(
      screen.getByTestId('input-access-language-other'),
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('renders text input error when other language is preselected', () => {
    (getFieldError as jest.Mock).mockImplementation(
      (fieldName: string) => fieldName === 'accessLanguageOther',
    );

    entry = {
      ...entry,
      data: {
        ...entry.data,
        accessLanguageType: 'other',
      },
    };

    const { container } = render(
      <AccessLanguage step={mockSteps[0]} entry={entry} />,
    );

    expect(
      screen.getByTestId('input-access-language-other'),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
