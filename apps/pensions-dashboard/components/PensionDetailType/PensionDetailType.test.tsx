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
          case 'data/types.DB':
            return `Defined benefit`;
          case 'data/types.DC':
            return `Defined contribution`;
          case 'data/types.AVC':
            return `AVC`;
          case 'data/types.HYB':
            return `HYB`;
          case 'data/types.CDC':
            return `CDC`;
          case 'data/types.CB':
            return `Cash Balance`;
          case 'data/types.VAR':
            return `Combination`;
          case 'tooltips.type-DB':
            return `DB tooltip content`;
          case 'tooltips.type-DC':
            return `DC tooltip content`;
          case 'tooltips.type-AVC':
            return `AVC tooltip content`;
          case 'tooltips.type-HYB':
            return `HYB tooltip content`;
          case 'tooltips.type-CDC':
            return `CDC tooltip content`;
          case 'tooltips.type-CB':
            return `CB tooltip content`;
          case 'tooltips.type-VAR':
            return `VAR tooltip content`;
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
    ${'renders CDC pension type with correct content'} | ${PensionType.CDC} | ${'CDC'}
    ${'renders CB pension type with correct content'}  | ${PensionType.CB}  | ${'Cash Balance'}
    ${'renders VAR pension type with correct content'} | ${PensionType.VAR} | ${'Combination'}
  `('renders $description', ({ text, type }) => {
    render(<PensionDetailType pensionType={type} />);
    expect(screen.getByTestId('pension-detail-type')).toBeInTheDocument();
    expect(screen.getByTestId(`${type}-icon`)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByText(`${type} tooltip content`)).toBeInTheDocument();
  });
});
