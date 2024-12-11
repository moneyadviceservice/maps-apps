import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { InformationType } from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailMoreInfo } from './PensionDetailMoreInfo';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailMoreInfo', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders correctly', () => {
    const { container } = render(<PensionDetailMoreInfo data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it('renders the correct information for C_AND_C type', () => {
    const data = {
      ...mockData,
      additionalDataSources: [
        {
          informationType: InformationType.C_AND_C,
          url: 'http://example.com/costs',
        },
      ],
    };
    const { getByText } = render(<PensionDetailMoreInfo data={data} />);
    expect(
      getByText(/pages.pension-details.more-info.costs/),
    ).toBeInTheDocument();
    expect(getByText('(opens in a new window)')).toBeInTheDocument();
    expect(getByText('http://example.com/costs')).toBeInTheDocument();
  });

  it('renders the correct information for SP type', () => {
    const data = {
      ...mockData,
      additionalDataSources: [
        {
          informationType: InformationType.SP,
          url: 'http://example.com/sp',
        },
      ],
    };
    const { getByText } = render(<PensionDetailMoreInfo data={data} />);
    expect(getByText(/pages.pension-details.more-info.sp/)).toBeInTheDocument();
    expect(getByText('http://example.com/sp')).toBeInTheDocument();
  });

  it('renders nothing if additionalDataSources is empty', () => {
    const data: PensionArrangement = {
      ...mockData,
      additionalDataSources: [],
    };
    const { container } = render(<PensionDetailMoreInfo data={data} />);
    expect(container).toBeEmptyDOMElement();
  });
});
