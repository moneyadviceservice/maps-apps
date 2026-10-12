import { render } from '@testing-library/react';

import { mockErrors } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { PensionWiseDigitalAppointment } from '.';
import { StepName } from '../../../lib/constants';
import { describeEachLanguage } from '../../../test';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils');

describeEachLanguage('PensionWiseDigitalAppointment', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <PensionWiseDigitalAppointment
        step={StepName.PENSION_WISE_DIGITAL_APPOINTMENT}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <PensionWiseDigitalAppointment
        errors={mockErrors}
        step={StepName.PENSION_WISE_DIGITAL_APPOINTMENT}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
