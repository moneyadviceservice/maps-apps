import { render } from '@testing-library/react';

import { mockUseTranslation } from '@maps-react/mhf/mocks';

import { InformationSidebar } from '.';
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
        accessSupportStatus: 'welsh-speaking-pension-specialist',
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
        accessSupportStatus: 'yes',
        accessOptionsRequest: 'foreign-language-interpreter',
        accessLanguageType: 'arabic',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithLanguage} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('uses accessLanguageOther when accessLanguageType is other', () => {
    const entryWithOtherLanguage = {
      ...entry,
      data: {
        ...entry.data,
        accessSupportStatus: 'yes',
        accessOptionsRequest: 'foreign-language-interpreter',
        accessLanguageType: 'other',
        accessLanguageOther: 'spanish',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithOtherLanguage} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders an empty string for accessLanguage when accessLanguageType is other but accessLanguageOther is not provided', () => {
    const entryWithOtherLanguage = {
      ...entry,
      data: {
        ...entry.data,
        accessSupportStatus: 'yes',
        accessOptionsRequest: 'foreign-language-interpreter',
        accessLanguageType: 'other',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithOtherLanguage} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders accessRequest block when accessSupportStatus is not none and accessOptionsDetails is provided', () => {
    const entryWithDetails = {
      ...entry,
      data: {
        ...entry.data,
        accessSupportStatus: 'yes',
        accessOptionsDetails: 'Some additional details',
      },
    };

    const { container } = render(
      <InformationSidebar flow="test-flow" entry={entryWithDetails} />,
    );

    expect(container).toMatchSnapshot();
  });
});
