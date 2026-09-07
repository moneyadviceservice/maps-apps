import type { JSX } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { mockSteps, mockUseTranslation } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AccessOptions } from '.';
import { FlowName, StepName } from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

describe('AccessOptions Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      z: (translations: { en: JSX.Element; cy: JSX.Element }) =>
        translations.en,
      tList: (key: string) => {
        if (key.includes('radio-button.options')) {
          return [
            {
              text: 'A Welsh-speaking pension specialist',
              value: `welsh-speaking-pension-specialist|${StepName.PRE_APPOINTMENT}`,
            },
            {
              text: 'A foreign language interpreter',
              value: `foreign-language-interpreter|${StepName.ACCESS_LANGUAGE}`,
            },
            {
              text: 'British Sign Language (BSL) support',
              value: `bsl-support|${StepName.ACCESS_BSL}`,
            },
          ];
        }
      },
    });
    (getFieldError as jest.Mock).mockReturnValue(false);
    entry = {
      data: { flow: FlowName.SELF_EMPLOYED },
      stepIndex: 0,
      steps: mockSteps,
      errors: {},
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <AccessOptions step={mockSteps[0]} entry={entry} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders error state correctly', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <AccessOptions step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with entry data populated', () => {
    entry = {
      ...entry,
      data: {
        ...entry.data,
        'access-options-text-area': 'Need wheelchair access at the venue.',
      },
    };

    const { container } = render(
      <AccessOptions step={mockSteps[0]} entry={entry} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('shows and hides companion details when checkbox is toggled', () => {
    render(<AccessOptions step={mockSteps[0]} entry={entry} />);

    const companionCheckbox = screen.getByRole('checkbox');

    expect(
      screen.queryByLabelText(
        'components.access-options.form.companion-name.label',
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(companionCheckbox);

    expect(
      screen.getByLabelText(
        'components.access-options.form.companion-name.label',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'components.access-options.form.companion-name.accordion.title',
      ),
    ).toBeInTheDocument();

    fireEvent.click(companionCheckbox);

    expect(
      screen.queryByLabelText(
        'components.access-options.form.companion-name.label',
      ),
    ).not.toBeInTheDocument();
  });

  it('renders companion details by default when companion data exists', () => {
    entry = {
      ...entry,
      data: {
        ...entry.data,
        accessOptionsCompanion:
          'components.access-options.form.companion-checkbox.value',
        accessOptionsCompanionName: 'Bob',
      },
    };

    const { container } = render(
      <AccessOptions step={mockSteps[0]} entry={entry} />,
    );
    expect(
      screen.getByLabelText(
        'components.access-options.form.companion-name.label',
      ),
    ).toHaveValue('Bob');
    expect(container.firstChild).toMatchSnapshot();
  });
});
