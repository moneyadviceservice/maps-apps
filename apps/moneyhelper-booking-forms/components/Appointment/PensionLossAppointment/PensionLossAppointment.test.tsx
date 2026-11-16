import { render } from '@testing-library/react';

import { PensionLossAppointment } from '.';
import { StepName } from '../../../lib/constants';
import { describeEachLanguage } from '../../../test';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describeEachLanguage('PensionLossAppointment', () => {
  it('renders component correctly', () => {
    const { container } = render(
      <PensionLossAppointment step={StepName.PENSION_LOSS_APPOINTMENT} />,
    );
    expect(container).toMatchSnapshot();
  });
});
