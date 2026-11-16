import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { MatchType, PensionType } from '../../lib/constants';
import type { PensionArrangement } from '../../lib/types';
import { PotValue } from './PotValue';

jest.mock('@maps-react/hooks/useTranslation');

const buildIllustration = (benefitType: string) => ({
  benefitType: benefitType,
  dcPot: 1000,
  illustrationType: 'AP',
});

const mockAVC = buildIllustration('AVC');
const mockDC = buildIllustration('DC');
const mockCBS = buildIllustration('CBS');
const mockNoPot = [buildIllustration('DB')];
const mockDCAVC = [buildIllustration('DC'), buildIllustration('AVC')];
const mockDC_CBS = [buildIllustration('DC'), buildIllustration('CBS')];
const mockDC_AVC_CBS = [
  buildIllustration('DC'),
  buildIllustration('CBS'),
  buildIllustration('AVC'),
];

const mockPensionArrangement = {
  externalPensionPolicyId: 'mockPolicyId',
  externalAssetId: 'mockAssetId',
  matchType: MatchType.DEFN,
  schemeName: 'mockSchemeName',
  pensionType: PensionType.DB,
  contributionsFromMultipleEmployers: false,
  pensionAdministrator: {
    name: 'mockAdministrator',
    contactMethods: [
      {
        preferred: false,
        contactMethodDetails: {
          email: 'mock@example.com',
        },
      },
    ],
  },
  benefitIllustrations: [
    {
      illustrationComponents: [mockDC],
    },
  ],
} as PensionArrangement;

describe('PotValue', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        switch (key) {
          case 'components.pension-pot.title':
            return 'Pot value';
          case 'components.pension-pot.text-dc':
            return 'DC';
          case 'components.pension-pot.text-avc':
            return 'AVC';
          case 'components.pension-pot.text-cbs':
            return 'CBS';
          case 'components.pension-pot.text-dc-avc':
            return 'DC and AVC';
          case 'components.pension-pot.text-dc-cbs':
            return 'DC and CBS';
          case 'components.pension-pot.text-avc-cbs':
            return 'AVC and CBS';
          case 'components.pension-pot.text-dc-avc-cbs':
            return 'DC, AVC and CBS';
          case 'components.pension-pot.accordion-title':
            return 'Accordion title';
          case 'components.pension-pot.accordion-dc':
            return 'DC details';
          case 'components.pension-pot.accordion-avc':
            return 'AVC details';
          case 'components.pension-pot.accordion-cbs':
            return 'CBS details';
          case 'components.pension-pot.accordion-dc-avc':
            return 'DC and AVC details';
          case 'components.pension-pot.accordion-dc-cbs':
            return 'DC and CBS details';
          case 'components.pension-pot.accordion-avc-cbs':
            return 'AVC and CBS details';
          case 'components.pension-pot.accordion-dc-avc-cbs':
            return 'DC, AVC and CBS details';
          default:
            return key;
        }
      },
    });
  });

  it('should display default component elements correctly', () => {
    render(<PotValue data={mockPensionArrangement} />);
    expect(screen.getByText('Pot value')).toBeInTheDocument();
    expect(screen.getByText('£1,000')).toBeInTheDocument();
  });

  it.each([
    ['DC pot', [mockDC], 'DC'],
    ['AVC pot', [mockAVC], 'AVC'],
    ['CBS pot', [mockCBS], 'CBS'],
    ['DC and AVC pot', mockDCAVC, 'DC and AVC'],
    ['DC and CBS pot', mockDC_CBS, 'DC and CBS'],
    ['AVC and CBS pot', [mockAVC, mockCBS], 'AVC and CBS'],
    ['DC, AVC and CBS pot', mockDC_AVC_CBS, 'DC, AVC and CBS'],
  ])(
    'should display correct pot text for %s',
    (_description, illustrationComponents, expectedTextKey) => {
      const data = {
        ...mockPensionArrangement,
        benefitIllustrations: [
          {
            illustrationComponents,
          },
        ],
      } as PensionArrangement;
      render(<PotValue data={data} />);
      expect(screen.getByText(expectedTextKey)).toBeInTheDocument();
    },
  );

  it.each([
    ['AVC pot', [mockAVC], 'AVC details'],
    ['DC pot', [mockDC], 'DC details'],
    ['CBS pot', [mockCBS], 'CBS details'],
    ['DC and AVC pot', mockDCAVC, 'DC and AVC details'],
    ['DC and CBS pot', mockDC_CBS, 'DC and CBS details'],
    ['AVC and CBS pot', [mockAVC, mockCBS], 'AVC and CBS details'],
    ['DC, AVC and CBS pot', mockDC_AVC_CBS, 'DC, AVC and CBS details'],
  ])(
    'should display correct accordion section with message for %s',
    (_description, illustrationComponents, expectedMessageKey) => {
      const data = {
        ...mockPensionArrangement,
        benefitIllustrations: [
          {
            illustrationComponents,
          },
        ],
      } as PensionArrangement;
      render(<PotValue data={data} />);
      expect(screen.getByText('Accordion title')).toBeInTheDocument();
      expect(screen.getByText(expectedMessageKey)).toBeInTheDocument();
    },
  );

  it('should not display expandable section when no message key', () => {
    const data = {
      ...mockPensionArrangement,
      benefitIllustrations: [
        {
          illustrationComponents: mockNoPot,
        },
      ],
    } as PensionArrangement;
    render(<PotValue data={data} />);
    expect(screen.queryByText('Accordion title')).not.toBeInTheDocument();
  });

  it('should handle empty benefitIllustrations array', () => {
    const data = {
      ...mockPensionArrangement,
      benefitIllustrations: [],
    } as PensionArrangement;
    render(<PotValue data={data} />);
    expect(screen.queryByText('Accordion title')).not.toBeInTheDocument();
  });

  it('should handle undefined benefitIllustrations', () => {
    const data = {
      ...mockPensionArrangement,
      benefitIllustrations: undefined,
    } as PensionArrangement;
    render(<PotValue data={data} />);
    expect(screen.queryByText('Accordion title')).not.toBeInTheDocument();
  });
});
