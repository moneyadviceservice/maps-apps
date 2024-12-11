import { render } from '@testing-library/react';

import { mockPensionsData } from '../../lib/mocks';
import { BenefitIllustration } from '../../lib/types';
import { BenefitsIllustrationsTable } from './BenefitIllustrationsTable';

import '@testing-library/jest-dom/extend-expect';

const mockData = mockPensionsData.pensionPolicies[0].pensionArrangements[0]
  .benefitIllustrations as BenefitIllustration[];

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  t: (key: string) => key,
}));

describe('BenefitsIllustrationsTable', () => {
  it('renders correctly', () => {
    const { container } = render(
      <BenefitsIllustrationsTable data={mockData} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders benefit types correctly', () => {
    const { getByText } = render(
      <BenefitsIllustrationsTable data={mockData} />,
    );
    mockData.forEach((illustration) => {
      illustration.illustrationComponents.forEach(({ illustrationType }) => {
        expect(getByText(illustrationType)).toBeInTheDocument();
      });
    });
  });

  it.each([
    ['annual amounts', 'pages.pension-details.details.annual-amount'],
    ['monthly amounts', 'pages.pension-details.details.monthly-amount'],
  ])('renders %s correctly when hasPayableDetails is true', (_, amountType) => {
    const { getByText, queryAllByText } = render(
      <BenefitsIllustrationsTable data={mockData} hasPayableDetails={true} />,
    );
    expect(getByText(amountType)).toBeInTheDocument();
    expect(getByText('ERI')).toBeInTheDocument();
    expect(getByText('AP')).toBeInTheDocument();
    expect(
      getByText('pages.pension-details.details.benefit-type'),
    ).toBeInTheDocument();
    expect(getByText('pages.pension-details.headings.pot')).toBeInTheDocument();
    expect(queryAllByText('£540,500').length).toBeGreaterThan(0);
    expect(queryAllByText('Defined Contribution').length).toBeGreaterThan(0);
  });

  it.each([
    ['annual amounts', 'pages.pension-details.details.annual-amount'],
    ['monthly amounts', 'pages.pension-details.details.monthly-amount'],
  ])('does not render %s when hasPayableDetails is false', (_, amountType) => {
    const { queryByText } = render(
      <BenefitsIllustrationsTable data={mockData} hasPayableDetails={false} />,
    );
    expect(queryByText(amountType)).not.toBeInTheDocument();
  });

  it('does not render when data is empty', () => {
    const { container } = render(
      <BenefitsIllustrationsTable data={[]} hasPayableDetails={true} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
