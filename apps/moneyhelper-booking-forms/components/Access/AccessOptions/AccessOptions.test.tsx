import type { JSX } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { mockSteps, mockUseTranslation } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { AccessOptions } from '.';
import {
  FlowName,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../../lib/constants';
import { BookingEntry } from '../../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

describe('AccessOptions Component', () => {
  const step = StepName.ACCESS_OPTIONS;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      z: (translations: { en: JSX.Element; cy: JSX.Element }) =>
        translations.en,
      tList: (key: string) => {
        if (key.includes(`${FORM_FIELD_CONTENT_KEY.accessSupportRequest}`)) {
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
        if (
          key.includes(
            `${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.conditional-options`,
          )
        ) {
          return [
            {
              text: 'None of the above',
              value: `none|${StepName.PRE_APPOINTMENT}`,
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
    const { container } = render(<AccessOptions step={step} entry={entry} />);

    expect(container).toMatchSnapshot();
  });

  it('renders error state correctly', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(<AccessOptions step={step} entry={entry} />);
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

    const { container } = render(<AccessOptions step={step} entry={entry} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('shows and hides companion details when checkbox is toggled', () => {
    render(<AccessOptions step={step} entry={entry} />);

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
        [FormFieldName.ACCESS_SUPPORT_COMPANION]: 'yes',
        [FormFieldName.ACCESS_SUPPORT_COMPANION_NAME]: 'Bob',
      },
    };

    const { container } = render(<AccessOptions step={step} entry={entry} />);
    expect(
      screen.getByLabelText(
        `components.access-options.form.${FORM_FIELD_CONTENT_KEY.accessSupportCompanionName}.label`,
      ),
    ).toHaveValue('Bob');
    expect(container.firstChild).toMatchSnapshot();
  });
});
