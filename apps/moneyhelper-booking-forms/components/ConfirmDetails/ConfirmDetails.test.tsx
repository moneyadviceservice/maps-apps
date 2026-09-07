import { render } from '@testing-library/react';

import {
  mockEntry,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';
import type { Language } from '@maps-react/mhf/utils';

import { ConfirmDetails } from '.';
import { FlowName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;

const appointmentDateCases: { locale: Language; expectedDate: string }[] = [
  {
    locale: 'en',
    expectedDate: 'Tuesday, 14 July 2026',
  },
  {
    locale: 'cy',
    expectedDate: 'Dydd Mawrth, 14 Gorffennaf 2026',
  },
];

describe('ConfirmDetails Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, vars?: Record<string, string>) => {
        if (
          key ===
          'components.confirm-details.appointment-details.adjustment-requests.value.foreign-language-interpreter'
        ) {
          return `Foreign language interpreter - (${
            vars?.accessLanguageType ?? ''
          })`;
        }

        return key;
      },
      locale: 'en',
    });
    entry = {
      ...mockEntry,
      data: { flow: FlowName.SELF_EMPLOYED },
    } as BookingEntry;
  });

  it('renders component correctly', () => {
    const { container } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('throws error when entry is missing', () => {
    expect(() =>
      render(<ConfirmDetails step={mockSteps[0]} entry={undefined} />),
    ).toThrow('[ConfirmDetails] Missing entry');
  });

  it.each(appointmentDateCases)(
    'renders the appointment date in $locale',
    ({ locale, expectedDate }) => {
      entry.data = {
        ...entry.data,
        locale,
        appointmentDate: '2026-07-14',
      };

      const { getByText } = render(
        <ConfirmDetails step={mockSteps[0]} entry={entry} />,
      );

      expect(getByText(expectedDate)).toBeInTheDocument();
    },
  );

  it('falls back to the raw appointment date when it cannot be parsed', () => {
    entry.data = {
      ...entry.data,
      locale: 'en',
      appointmentDate: 'not-a-date',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(getByText('not-a-date')).toBeInTheDocument();
  });

  it('renders preferred communication methods when present', () => {
    entry.data = {
      ...entry.data,
      preferredMethodOfCommunication: ['text-message', 'email'],
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText(
        'components.confirm-details.your-details.preferred-communication-method.value.text-message, components.confirm-details.your-details.preferred-communication-method.value.email',
      ),
    ).toBeInTheDocument();
  });

  it('renders preferred communication method when stored as a single string', () => {
    entry.data = {
      ...entry.data,
      preferredMethodOfCommunication: 'email',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText(
        'components.confirm-details.your-details.preferred-communication-method.value.email',
      ),
    ).toBeInTheDocument();
  });

  it('renders none requested when access support status is none-requested', () => {
    entry.data = {
      ...entry.data,
      accessSupportStatus: 'none-requested',
      locale: 'en',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText(
        'components.confirm-details.appointment-details.adjustment-requests.value.none-requested',
      ),
    ).toBeInTheDocument();
  });

  it('renders none requested when status is yes-requested with no specific requests', () => {
    entry.data = {
      ...entry.data,
      accessSupportStatus: 'yes-requested',
      locale: 'en',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText(
        'components.confirm-details.appointment-details.adjustment-requests.value.none-requested',
      ),
    ).toBeInTheDocument();
  });

  it('renders request-specific format when accessOptionsRequest is present', () => {
    entry.data = {
      ...entry.data,
      accessSupportStatus: 'yes',
      accessOptionsRequest: 'welsh-speaking-pension-specialist',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText(
        'components.sidebar.information.details.welsh-speaking-pension-specialist.format-value',
      ),
    ).toBeInTheDocument();
  });

  it('renders default format when accessOptionsRequest is absent', () => {
    entry.data = {
      ...entry.data,
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText('components.sidebar.information.details.format-value'),
    ).toBeInTheDocument();
  });

  it('interpolates accessLanguageOther when accessLanguageType is other', () => {
    entry.data = {
      ...entry.data,
      accessSupportStatus: 'yes',
      accessOptionsRequest: 'foreign-language-interpreter',
      accessLanguageType: 'other',
      accessLanguageOther: 'Spanish',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText('Foreign language interpreter - (Spanish)'),
    ).toBeInTheDocument();
  });

  it('uses accessLanguageType directly when it is not other', () => {
    entry.data = {
      ...entry.data,
      accessSupportStatus: 'yes',
      accessOptionsRequest: 'foreign-language-interpreter',
      accessLanguageType: 'Arabic',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText('Foreign language interpreter - (Arabic)'),
    ).toBeInTheDocument();
  });

  it('renders companion adjustment when present', () => {
    entry.data = {
      ...entry.data,
      accessSupportStatus: 'yes',
      accessOptionsCompanion: 'someone-to-attend-appointment',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(
      getByText(
        'components.confirm-details.appointment-details.adjustment-requests.value.someone-to-attend-appointment',
      ),
    ).toBeInTheDocument();
  });

  it('renders additional adjustment details when present', () => {
    entry.data = {
      ...entry.data,
      accessSupportStatus: 'yes',
      accessOptionsDetails: 'Needs slower explanation',
    };

    const { getByText } = render(
      <ConfirmDetails step={mockSteps[0]} entry={entry} />,
    );

    expect(getByText('Needs slower explanation')).toBeInTheDocument();
  });
});
