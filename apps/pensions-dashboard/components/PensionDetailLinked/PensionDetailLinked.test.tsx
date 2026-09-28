import { render, screen } from '@testing-library/react';

import { PensionArrangement } from '../../lib/types';
import { PensionDetailLinked } from './PensionDetailLinked';

import '@testing-library/jest-dom/extend-expect';

// Mock the translation hook
jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: jest.fn((key: string) => {
      const translations: { [key: string]: string } = {
        'common.linked-pension': 'Linked pension',
        'common.linked-pensions': 'Linked pensions',
        'tooltips.linked-pension': 'Tooltip text for linked pension',
      };
      return translations[key] || key;
    }),
    locale: 'en',
  }),
}));

describe('PensionDetailLinked', () => {
  const mockPensionArrangement = {
    externalAssetId: '123',
    schemeName: 'Test Scheme',
    linkedPensions: [
      {
        externalAssetId: 'linked-1',
        schemeName: 'Linked Scheme 1',
        pensionType: 'DC',
      },
      {
        externalAssetId: 'linked-2',
        schemeName: 'Linked Scheme 2',
        pensionType: 'DB',
      },
    ],
  } as PensionArrangement;

  it('renders linked pensions section with correct structure', () => {
    render(<PensionDetailLinked data={mockPensionArrangement} />);

    expect(screen.getByTestId('pension-detail-linked')).toBeInTheDocument();
    expect(screen.getByTestId('linked-pension-icon')).toBeInTheDocument();
    expect(screen.getByText('Linked pensions')).toBeInTheDocument();
    expect(screen.getByTestId('linked-pensions-list')).toBeInTheDocument();
    expect(
      screen.getByText('Tooltip text for linked pension'),
    ).toBeInTheDocument();
  });

  it('displays singular text for single linked pension', () => {
    const singleLinkedPension = {
      ...mockPensionArrangement,
      linkedPensions: [mockPensionArrangement.linkedPensions?.[0]],
    } as PensionArrangement;

    render(<PensionDetailLinked data={singleLinkedPension} />);
    expect(screen.getByText('Linked pension')).toBeInTheDocument();
  });

  it('sorts linked pensions by scheme name alphabetically', () => {
    const unsortedData = {
      ...mockPensionArrangement,
      linkedPensions: [
        {
          externalAssetId: 'linked-z',
          schemeName: 'Z Scheme',
          pensionType: 'DC',
        },
        {
          externalAssetId: 'linked-a',
          schemeName: 'A Scheme',
          pensionType: 'DB',
        },
      ],
    } as PensionArrangement;

    render(<PensionDetailLinked data={unsortedData} />);

    const buttons = screen.getAllByTestId('details-link');
    expect(buttons[0]).toHaveTextContent('A Scheme');
    expect(buttons[1]).toHaveTextContent('Z Scheme');
  });

  it('renders correct form inputs for each linked pension', () => {
    render(<PensionDetailLinked data={mockPensionArrangement} />);

    // Check hidden inputs exist with correct values
    const pensionIdInputs = screen.getAllByDisplayValue(/linked-\d/);
    const localeInputs = screen.getAllByDisplayValue('en');
    const pensionTypeInputs = screen.getAllByDisplayValue(/(DC|DB)/);

    expect(pensionIdInputs).toHaveLength(2);
    expect(localeInputs).toHaveLength(2);
    expect(pensionTypeInputs).toHaveLength(2);
  });

  it('renders buttons with correct form action and scheme names', () => {
    render(<PensionDetailLinked data={mockPensionArrangement} />);

    const buttons = screen.getAllByTestId('details-link');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute('formaction', '/api/set-pension-id');
    expect(buttons[1]).toHaveAttribute('formaction', '/api/set-pension-id');

    expect(buttons[0]).toHaveTextContent('Linked Scheme 1');
    expect(buttons[1]).toHaveTextContent('Linked Scheme 2');
  });

  it('renders null when no linked pensions exist', () => {
    const dataWithoutLinkedPensions = {
      ...mockPensionArrangement,
      linkedPensions: [],
    };

    render(<PensionDetailLinked data={dataWithoutLinkedPensions} />);
    expect(
      screen.queryByTestId('pension-detail-linked'),
    ).not.toBeInTheDocument();
  });

  it('renders null when linkedPensions is undefined', () => {
    const dataWithoutLinkedPensions = {
      ...mockPensionArrangement,
      linkedPensions: undefined,
    };

    render(<PensionDetailLinked data={dataWithoutLinkedPensions} />);
    expect(
      screen.queryByTestId('pension-detail-linked'),
    ).not.toBeInTheDocument();
  });
});
