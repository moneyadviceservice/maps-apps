import React from 'react';

import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { DetailsPage } from './DetailsPage';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('DetailsPage Component', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: (key: string) => [key],
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(<DetailsPage data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it.each`
    unavailableCode | description
    ${undefined}    | ${'renders without unavailable code'}
    ${'WU'}         | ${'renders with WU unavailable code'}
  `('$description', ({ unavailableCode }) => {
    const { container } = render(
      <DetailsPage data={mockData} unavailableCode={unavailableCode} />,
    );
    expect(container).toMatchSnapshot();
  });
});
