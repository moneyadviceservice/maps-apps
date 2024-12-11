import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailsSection } from './PensionDetailsSection';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailsSection', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders correctly', () => {
    const { container } = render(
      <PensionDetailsSection data={mockData} hasPayableDetails={true} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders heading and table when benefitIllustrations exist', () => {
    const { getByText } = render(
      <PensionDetailsSection data={mockData} hasPayableDetails={true} />,
    );

    expect(
      getByText('pages.pension-details.details.heading'),
    ).toBeInTheDocument();
    expect(
      getByText('pages.pension-details.details.heading'),
    ).toBeInTheDocument();
  });

  it('does not render when benefitIllustrations do not exist', () => {
    const data: PensionArrangement = {} as PensionArrangement;

    const { container } = render(
      <PensionDetailsSection data={data} hasPayableDetails={true} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders table with correct payable details', () => {
    const { getByText, queryAllByText } = render(
      <PensionDetailsSection data={mockData} hasPayableDetails={false} />,
    );

    expect(getByText('ERI')).toBeInTheDocument();
    expect(getByText('AP')).toBeInTheDocument();
    expect(
      getByText('pages.pension-details.details.benefit-type'),
    ).toBeInTheDocument();
    expect(getByText('pages.pension-details.headings.pot')).toBeInTheDocument();
    expect(queryAllByText('£540,500').length).toBeGreaterThan(0);
    expect(queryAllByText('Defined Contribution').length).toBeGreaterThan(0);
  });
});
