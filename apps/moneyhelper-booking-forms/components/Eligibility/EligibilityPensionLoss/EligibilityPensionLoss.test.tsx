import { render } from '@testing-library/react';

import { mockErrors } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { EligibilityPensionLoss } from '.';
import { StepName } from '../../../lib/constants';
import { describeEachLanguage } from '../../../test';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils/getFieldError');

describeEachLanguage('EligibilityPensionLoss', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(undefined);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <EligibilityPensionLoss step={StepName.ELIGIBILITY_PENSION_LOSS} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <EligibilityPensionLoss
        errors={mockErrors}
        step={StepName.ELIGIBILITY_PENSION_LOSS}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
