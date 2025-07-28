import { render } from '@testing-library/react';

import { InformationType, NO_DATA, PensionType } from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { AdditionalDataTable } from './AdditionalDataTable';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

const mockDataNoAdditional = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('AdditionalDataTable', () => {
  const data = {
    ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
    additionalDataSources: [
      {
        informationType: InformationType.C_AND_C,
        url: 'http://example.com/candc',
      },
      {
        informationType: InformationType.ANR,
        url: 'http://example.com/anr',
      },
      {
        informationType: InformationType.SIP,
        url: 'http://example.com/sip',
      },
      {
        informationType: InformationType.IMP,
        url: 'http://example.com/imp',
      },
      {
        informationType: InformationType.SP,
        url: 'http://example.com/sp',
      },
    ],
  } as PensionArrangement;

  it('renders default table', () => {
    const { container } = render(<AdditionalDataTable data={data} />);
    expect(container).toBeInTheDocument();
  });

  it(`renders "${NO_DATA}" when there is no data source for a type`, () => {
    const { getAllByText } = render(
      <AdditionalDataTable data={mockDataNoAdditional} />,
    );
    expect(getAllByText(NO_DATA).length).toBe(
      Object.values(InformationType).length - 1,
    );
  });

  describe('When pension type is not SP', () => {
    it('renders the correct number of rows', () => {
      const { getAllByRole } = render(<AdditionalDataTable data={data} />);
      expect(getAllByRole('row').length).toBe(4);
    });

    it.each`
      description                  | type                                        | url                           | expectToRender
      ${'renders C_AND_C type'}    | ${'data.pensions.additional-types.C_AND_C'} | ${'http://example.com/candc'} | ${true}
      ${'renders ANR type'}        | ${'data.pensions.additional-types.ANR'}     | ${'http://example.com/anr'}   | ${true}
      ${'renders IMP type'}        | ${'data.pensions.additional-types.IMP'}     | ${'http://example.com/imp'}   | ${true}
      ${'renders SIP type'}        | ${'data.pensions.additional-types.SIP'}     | ${'http://example.com/sip'}   | ${true}
      ${'does not render SP type'} | ${'data.pensions.additional-types.SP'}      | ${''}                         | ${false}
    `('$description', ({ type, url, expectToRender }) => {
      const { queryByText, getByText } = render(
        <AdditionalDataTable data={data} />,
      );
      if (expectToRender) {
        expect(getByText(type)).toBeInTheDocument();
        expect(getByText(url)).toBeInTheDocument();
      } else {
        expect(queryByText(type)).not.toBeInTheDocument();
      }
    });
  });

  describe('When pension type is SP', () => {
    const mockDataSP = {
      ...data,
      pensionType: PensionType.SP,
    };
    it('renders the correct number of rows when SP', () => {
      const { getAllByRole } = render(
        <AdditionalDataTable data={mockDataSP} />,
      );
      expect(getAllByRole('row').length).toBe(1);
    });

    it.each`
      description                       | type                                        | url                        | expectToRender
      ${'renders SP type'}              | ${'data.pensions.additional-types.SP'}      | ${'http://example.com/sp'} | ${true}
      ${'does not render C_AND_C type'} | ${'data.pensions.additional-types.C_AND_C'} | ${''}                      | ${false}
      ${'does not render ANR type'}     | ${'data.pensions.additional-types.ANR'}     | ${''}                      | ${false}
      ${'does not render IMP type'}     | ${'data.pensions.additional-types.IMP'}     | ${''}                      | ${false}
      ${'does not render SIP type'}     | ${'data.pensions.additional-types.SIP'}     | ${''}                      | ${false}
    `('$description', ({ type, url, expectToRender }) => {
      const { queryByText, getByText } = render(
        <AdditionalDataTable data={mockDataSP} />,
      );
      if (expectToRender) {
        expect(getByText(type)).toBeInTheDocument();
        expect(getByText(url)).toBeInTheDocument();
      } else {
        expect(queryByText(type)).not.toBeInTheDocument();
      }
    });
  });
});
