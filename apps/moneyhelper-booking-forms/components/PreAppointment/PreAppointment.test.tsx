import { render } from '@testing-library/react';

import { getFieldError } from '@maps-react/mhf/utils';

import { PreAppointment } from '.';
import { FlowName, StepName } from '../../lib/constants';
import { describeEachLanguage } from '../../test';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils');

const flows = [
  FlowName.PENSION_WISE,
  FlowName.DIVORCE_SEPARATION,
  FlowName.PENSION_SAFE_GUARDING,
];

describeEachLanguage('PreAppointment', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(undefined);
  });

  it.each(flows)('renders component correctly for flow %s', (flow) => {
    const { container } = render(
      <PreAppointment step={StepName.PRE_APPOINTMENT} flow={flow} />,
    );
    expect(container).toMatchSnapshot();
  });
});
