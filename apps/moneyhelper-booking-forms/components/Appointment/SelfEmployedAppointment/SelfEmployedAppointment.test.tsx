import { render } from '@testing-library/react';

import { SelfEmployedAppointment } from '.';
import { StepName } from '../../../lib/constants';
import { describeEachLanguage } from '../../../test';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describeEachLanguage('SelfEmployedAppointment Component', () => {
  it('renders component correctly', () => {
    const { container } = render(
      <SelfEmployedAppointment step={StepName.SELF_EMPLOYED_APPOINTMENT} />,
    );
    expect(container).toMatchSnapshot();
  });
});
