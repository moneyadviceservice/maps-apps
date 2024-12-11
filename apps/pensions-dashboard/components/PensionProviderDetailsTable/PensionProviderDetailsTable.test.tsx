import { render } from '@testing-library/react';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionProviderDetailsTable } from './PensionProviderDetailsTable';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  t: (key: string) => key,
}));

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionProviderDetailsTable', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PensionProviderDetailsTable data={mockData} />,
    );
    expect(container).toMatchSnapshot();
  });

  it.each`
    description                   | text
    ${'employer name'}            | ${'Borough Finance Centre'}
    ${'employment dates'}         | ${'From 16 May 2011'}
    ${'preferred contact method'} | ${/\+44 800873434/}
  `('renders $description', ({ text }) => {
    const { getByText } = render(
      <PensionProviderDetailsTable data={mockData} />,
    );
    expect(getByText(text)).toBeInTheDocument();
  });

  it.each`
    description                 | text
    ${'pension provider name'}  | ${'Pension Admin Highland'}
    ${'email contact method'}   | ${/mastertrust@highlandadmin.com/}
    ${'website contact method'} | ${'https://www.highlandadmin.co.uk'}
  `('renders $description', ({ text }) => {
    const { queryAllByText } = render(
      <PensionProviderDetailsTable data={mockData} />,
    );
    expect(queryAllByText(text).length).toBeGreaterThan(0);
  });

  it.each`
    description         | text
    ${'address line 1'} | ${'1 Travis Avenue'}
    ${'address line 2'} | ${'Main Street'}
    ${'city'}           | ${'Liverpool'}
    ${'postcode'}       | ${'M16 0QG'}
    ${'country'}        | ${'United Kingdom'}
  `('renders $description', ({ text }) => {
    const { getByText } = render(
      <PensionProviderDetailsTable data={mockData} />,
    );
    expect(getByText(text)).toBeInTheDocument();
  });
});
