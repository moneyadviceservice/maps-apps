import { render } from '@testing-library/react';

import { mockEntry, mockUseTranslation } from '@maps-react/mhf/mocks';
import { type Language } from '@maps-react/utils/language';

import { ConfirmDetails } from '.';
import {
  FlowName,
  FORM_FIELD_CONTENT_KEY,
  FormFieldName,
  StepName,
} from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('@maps-react/mhf/utils/getFieldError');

let entry: BookingEntry;
const step = StepName.CONFIRM_DETAILS;

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

const renderWithData = (data: Record<string, BookingEntry['data'][string]>) => {
  entry.data = { ...entry.data, ...data };

  return render(<ConfirmDetails step={step} entry={entry} />);
};

describe('ConfirmDetails Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, vars?: Record<string, string>) => {
        if (
          key ===
          `components.${step}.appointment-details.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.value.foreign-language-interpreter`
        ) {
          return `Foreign language interpreter - (${
            vars?.[FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE] ?? ''
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
    const { container } = render(<ConfirmDetails step={step} entry={entry} />);
    expect(container).toMatchSnapshot();
  });

  it('throws error when entry is missing', () => {
    expect(() =>
      render(<ConfirmDetails step={step} entry={undefined} />),
    ).toThrow('[ConfirmDetails] Missing entry');
  });

  it.each(appointmentDateCases)(
    'renders the appointment date in $locale',
    ({ locale, expectedDate }) => {
      entry.data = {
        ...entry.data,
        locale,
        [FormFieldName.APPOINTMENT_DATE]: '2026-07-14',
      };

      const { getByText } = render(
        <ConfirmDetails step={step} entry={entry} />,
      );

      expect(getByText(expectedDate)).toBeInTheDocument();
    },
  );

  it('falls back to the raw appointment date when it cannot be parsed', () => {
    entry.data = {
      ...entry.data,
      locale: 'en',
      [FormFieldName.APPOINTMENT_DATE]: 'not-a-date',
    };

    const { getByText } = render(<ConfirmDetails step={step} entry={entry} />);

    expect(getByText('not-a-date')).toBeInTheDocument();
  });

  it('renders preferred communication methods when present', () => {
    entry.data = {
      ...entry.data,
      [FormFieldName.COMMUNICATION_METHOD]: ['text-message', 'email'],
    };

    const { getByText } = render(<ConfirmDetails step={step} entry={entry} />);

    expect(
      getByText(
        `components.${step}.your-details.${FORM_FIELD_CONTENT_KEY.communicationMethod}.value.text-message, components.${step}.your-details.${FORM_FIELD_CONTENT_KEY.communicationMethod}.value.email`,
      ),
    ).toBeInTheDocument();
  });

  it('renders preferred communication method when stored as a single string', () => {
    const { getByText } = renderWithData({
      [FormFieldName.COMMUNICATION_METHOD]: 'email',
    });

    expect(
      getByText(
        `components.${step}.your-details.${FORM_FIELD_CONTENT_KEY.communicationMethod}.value.email`,
      ),
    ).toBeInTheDocument();
  });

  it.each(['none', 'yes'])(
    'renders none requested when access support status is %s and no specific requests exist',
    (accessSupportStatus) => {
      const { getByText } = renderWithData({
        [FormFieldName.ACCESS_SUPPORT_STATUS]: accessSupportStatus,
        locale: 'en',
      });

      expect(
        getByText(
          `components.${step}.appointment-details.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.value.none`,
        ),
      ).toBeInTheDocument();
    },
  );

  it('renders request-specific format when accessSupportOptionsRequest is present', () => {
    const { getByText } = renderWithData({
      [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
      [FormFieldName.ACCESS_SUPPORT_REQUEST]:
        'welsh-speaking-pension-specialist',
    });

    expect(
      getByText(
        'components.sidebar.information.details.welsh-speaking-pension-specialist.format-value',
      ),
    ).toBeInTheDocument();
  });

  it('renders default format when accessSupportOptionsRequest is absent', () => {
    entry.data = {
      ...entry.data,
    };

    const { getByText } = render(<ConfirmDetails step={step} entry={entry} />);

    expect(
      getByText('components.sidebar.information.details.format-value'),
    ).toBeInTheDocument();
  });

  it('interpolates accessSupportLanguageOther when accessSupportLanguageType is other', () => {
    entry.data = {
      ...entry.data,
      [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'foreign-language-interpreter',
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'other',
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]: 'Spanish',
    };

    const { getByText } = render(<ConfirmDetails step={step} entry={entry} />);

    expect(
      getByText('Foreign language interpreter - (Spanish)'),
    ).toBeInTheDocument();
  });

  it('uses accessSupportLanguageType directly when it is not other', () => {
    entry.data = {
      ...entry.data,
      [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'foreign-language-interpreter',
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'Arabic',
    };

    const { getByText } = render(<ConfirmDetails step={step} entry={entry} />);

    expect(
      getByText('Foreign language interpreter - (Arabic)'),
    ).toBeInTheDocument();
  });

  it('renders companion adjustment when present', () => {
    entry.data = {
      ...entry.data,
      [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
      [FormFieldName.ACCESS_SUPPORT_COMPANION]: 'someone-to-attend-appointment',
    };

    const { getByText } = render(<ConfirmDetails step={step} entry={entry} />);

    expect(
      getByText(
        `components.${step}.appointment-details.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.value.someone-to-attend-appointment`,
      ),
    ).toBeInTheDocument();
  });

  it('renders additional adjustment details when present', () => {
    entry.data = {
      ...entry.data,
      [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
      [FormFieldName.ACCESS_SUPPORT_DETAILS]: 'Needs slower explanation',
    };

    const { getByText } = render(<ConfirmDetails step={step} entry={entry} />);

    expect(getByText('Needs slower explanation')).toBeInTheDocument();
  });
});
