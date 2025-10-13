import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailType } from './PensionDetailType';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
const mockDBPension: PensionArrangement = {
  pensionType: PensionType.DB,
} as PensionArrangement;

const mockDCPension: PensionArrangement = {
  pensionType: PensionType.DC,
} as PensionArrangement;

describe('PensionDetailType', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        switch (key) {
          case 'data.pensions.types.DB':
            return `Defined benefit`;
          case 'data.pensions.types.DC':
            return `Defined contribution`;
          case 'tooltips.type-DB':
            return `DB tooltip content`;
          case 'tooltips.type-DC':
            return `DC tooltip content`;
          default:
            return key;
        }
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders pension detail type container', () => {
    render(<PensionDetailType data={mockDBPension} />);

    expect(screen.getByTestId('pension-detail-type')).toBeInTheDocument();
  });

  it('renders DB pension type with correct content', () => {
    render(<PensionDetailType data={mockDBPension} />);
    expect(screen.getByTestId('DB-icon')).toBeInTheDocument();
    expect(screen.getByText('Defined benefit')).toBeInTheDocument();
    expect(screen.getByText('DB tooltip content')).toBeInTheDocument();
  });

  it('renders DC pension type with correct content', () => {
    render(<PensionDetailType data={mockDCPension} />);
    expect(screen.getByTestId('DC-icon')).toBeInTheDocument();
    expect(screen.getByText('Defined contribution')).toBeInTheDocument();
    expect(screen.getByText('DC tooltip content')).toBeInTheDocument();
  });
});
