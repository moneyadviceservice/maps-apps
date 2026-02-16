import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { PensionDetailType } from './PensionDetailType';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

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
          case 'data.pensions.types.AVC':
            return `AVC`;
          case 'data.pensions.types.HYB':
            return `HYB`;
          case 'tooltips.type-DB':
            return `DB tooltip content`;
          case 'tooltips.type-DC':
            return `DC tooltip content`;
          case 'tooltips.type-AVC':
            return `AVC tooltip content`;
          case 'tooltips.type-HYB':
            return `HYB tooltip content`;
          default:
            return key;
        }
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    description                                        | type               | text
    ${'renders DB pension type with correct content'}  | ${PensionType.DB}  | ${'Defined benefit'}
    ${'renders DC pension type with correct content'}  | ${PensionType.DC}  | ${'Defined contribution'}
    ${'renders AVC pension type with correct content'} | ${PensionType.AVC} | ${'AVC'}
    ${'renders HYB pension type with correct content'} | ${PensionType.HYB} | ${'HYB'}
  `('renders $description', ({ text, type }) => {
    render(<PensionDetailType pensionType={type} />);
    expect(screen.getByTestId('pension-detail-type')).toBeInTheDocument();
    expect(screen.getByTestId(`${type}-icon`)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByText(`${type} tooltip content`)).toBeInTheDocument();
  });
});
