import { render } from '@testing-library/react';

import { Icon, IconType } from '@maps-react/common/components/Icon';

import { PensionsList } from '.';
import { mockPensionsSummary } from '../../lib/mocks/api';

const pensions = [
  mockPensionsSummary.pensions[0],
  mockPensionsSummary.pensions[2],
];

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
