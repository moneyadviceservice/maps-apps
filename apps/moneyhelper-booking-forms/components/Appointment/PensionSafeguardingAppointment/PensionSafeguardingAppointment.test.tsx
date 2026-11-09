import { render } from '@testing-library/react';

import { PensionSafeguardingAppointment } from '.';
import { StepName } from '../../../lib/constants';
import { describeEachLanguage } from '../../../test';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describeEachLanguage('PensionSafeguardingAppointment Component', () => {
  it('renders component correctly', () => {
    const { container } = render(
      <PensionSafeguardingAppointment
        step={StepName.PENSION_SAFEGUARDING_APPOINTMENT}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
