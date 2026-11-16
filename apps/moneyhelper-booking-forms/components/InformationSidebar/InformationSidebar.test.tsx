import { render } from '@testing-library/react';

import { mockUseTranslation } from '@maps-react/mhf/mocks';

import { InformationSidebar } from '.';
import { FormFieldName } from '../../lib/constants';
import { BookingEntry } from '../../lib/types';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

let entry: BookingEntry;
// Mock the `useTranslation` hook
describe('InformationSidebar Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, vars?: Record<string, string>) => {
        if (
          key ===
          'components.sidebar.information.details.foreign-language-interpreter.request-value'
        ) {
          return vars?.accessLanguage
            ? `Foreign language interpreter - ${vars.accessLanguage}`
            : 'Foreign language interpreter - {accessLanguage}';
        }

        return key;
      },
    });

    entry = {
      data: {
        flow: 'ds',
        locale: 'en',
        [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
      },
      stepIndex: 0,
      steps: [],
      errors: {},
    };
  });

  it('renders component correctly', () => {
    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('throws error when entry is missing', () => {
    expect(() =>
      render(<InformationSidebar flow="test-flow" entry={undefined} />),
    ).toThrow('[InformationSidebar] Missing entry');
  });

  it('renders null when flow is missing', () => {
    const { container } = render(
      <InformationSidebar flow={undefined} entry={entry} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders adjustment request block when request translation exists', () => {
    const entryWithLanguage = {
      ...entry,
      data: {
        ...entry.data,
        [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
        [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'foreign-language-interpreter',
        [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'arabic',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithLanguage} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('uses accessSupportLanguageOther when accessSupportLanguageType is other', () => {
    const entryWithOtherLanguage = {
      ...entry,
      data: {
        ...entry.data,
        [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
        [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'foreign-language-interpreter',
        [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'other',
        [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]: 'spanish',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithOtherLanguage} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders an empty string for accessSupportLanguage when accessSupportLanguageType is other but accessSupportLanguageOther is not provided', () => {
    const entryWithOtherLanguage = {
      ...entry,
      data: {
        ...entry.data,
        [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
        [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'foreign-language-interpreter',
        [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'other',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithOtherLanguage} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders accessRequest block when accessSupportStatus is not none and accessSupportDetails is provided', () => {
    const entryWithDetails = {
      ...entry,
      data: {
        ...entry.data,
        [FormFieldName.ACCESS_SUPPORT_STATUS]: 'yes',
        [FormFieldName.ACCESS_SUPPORT_DETAILS]: 'Some additional details',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithDetails} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders accessCompanion block when there is no accessSupportDetails and accessSupportRequest is none and when companion data exists', () => {
    const entryWithCompanion = {
      ...entry,
      data: {
        ...entry.data,
        [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'none',
        [FormFieldName.ACCESS_SUPPORT_COMPANION]: 'yes',
        [FormFieldName.ACCESS_SUPPORT_COMPANION_NAME]: 'Alice',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithCompanion} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders no requested access block when there is no relevant access data', () => {
    const entryWithoutAccessData = {
      ...entry,
      data: {
        ...entry.data,
        [FormFieldName.ACCESS_SUPPORT_STATUS]: 'none',
        [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'none',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithoutAccessData} />,
    );

    expect(container).toMatchSnapshot();
  });
});
