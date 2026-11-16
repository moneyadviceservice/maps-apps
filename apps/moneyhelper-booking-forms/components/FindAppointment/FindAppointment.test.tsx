import { render } from '@testing-library/react';

import { mockErrors } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { StepName } from '../../lib/constants';
import { describeEachLanguage } from '../../test';
import { FindAppointment } from './';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils/getFieldError');

describeEachLanguage('FindAppointment', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(undefined);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <FindAppointment step={StepName.FIND_APPOINTMENT} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component correctly with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <FindAppointment errors={mockErrors} step={StepName.FIND_APPOINTMENT} />,
    );

    expect(container).toMatchSnapshot();
  });
});
