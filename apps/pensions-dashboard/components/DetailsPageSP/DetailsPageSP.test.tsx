import React from 'react';

import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { DetailsPageSP } from './DetailsPageSP';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockSPData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('DetailsPageSp Component', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) => [key],
      locale: 'en',
    });
  });

  it('renders state pension details page correctly', () => {
    const { container } = render(<DetailsPageSP data={mockSPData} />);
    expect(container).toMatchSnapshot();
  });

  it.each`
    unavailableCode | description
    ${undefined}    | ${'renders without unavailable code'}
    ${'WU'}         | ${'renders with WU unavailable code'}
  `('$description', ({ unavailableCode }) => {
    const { container } = render(
      <DetailsPageSP data={mockSPData} unavailableCode={unavailableCode} />,
    );
    expect(container).toMatchSnapshot();
  });
});
