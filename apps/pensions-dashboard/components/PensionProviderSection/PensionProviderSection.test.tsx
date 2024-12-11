import { render } from '@testing-library/react';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionProviderSection } from './PensionProviderSection';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  t: (key: string) => key,
}));

jest.mock('../PensionProviderDetailsTable', () => ({
  PensionProviderDetailsTable: ({ data }: { data: PensionArrangement }) => (
    <div data-testid="pension-provider-details-table">
      {JSON.stringify(data)}
    </div>
  ),
}));

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionProviderSection', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<PensionProviderSection data={mockData} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the heading', () => {
    const { getByRole } = render(<PensionProviderSection data={mockData} />);
    expect(getByRole('heading', { level: 2 })).toHaveTextContent(
      'pages.pension-details.pension-provider.heading',
    );
  });

  it('renders the PensionProviderDetailsTable with correct data', () => {
    const { getByTestId } = render(<PensionProviderSection data={mockData} />);
    expect(getByTestId('pension-provider-details-table')).toHaveTextContent(
      JSON.stringify(mockData),
    );
  });
});
