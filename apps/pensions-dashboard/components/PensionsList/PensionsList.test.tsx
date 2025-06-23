import { render } from '@testing-library/react';

import { Icon, IconType } from '@maps-react/common/components/Icon';

import { PensionsList } from '.';
import { PensionArrangement } from '../../lib/types';

const pensions = [
  {
    externalAssetId: '1',
    matchType: 'DEFN',
    schemeName: 'State Pension',
    pensionType: 'SP',
    contributionsFromMultipleEmployers: false,
    pensionAdministrator: {
      name: 'DWP',
      contactMethods: [
        {
          preferred: false,
          contactMethods: [
            {
              preferred: true,
              contactMethodDetails: {
                number: '+123 1111111111',
                usage: ['A', 'M'],
              },
            },
          ],
        },
      ],
    },
  },
  {
    externalAssetId: '2',
    matchType: 'DEFN',
    schemeName: 'Your Pension DC Master Trust',
    pensionType: 'DC',
    contributionsFromMultipleEmployers: false,
    pensionAdministrator: {
      name: 'Your Pension',
      contactMethods: [
        {
          preferred: true,
          contactMethodDetails: {
            number: '+123 1111111111',
            usage: ['A', 'M'],
          },
        },
      ],
    },
  },
] as PensionArrangement[];

describe('PensionsList', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PensionsList
        pensions={pensions}
        icon={<Icon type={IconType.TICK_GREEN} />}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
