import { render } from '@testing-library/react';

import { getFieldError } from '@maps-react/mhf/utils/getFieldError';

import { EligibilityAgeExceptions } from '.';
import { StepName } from '../../../lib/constants';
import { describeEachLanguage } from '../../../test';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils/getFieldError');

describeEachLanguage('EligibilityAgeExceptions', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(undefined);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <EligibilityAgeExceptions step={StepName.ELIGIBILITY_AGE_EXCEPTIONS} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue('required');
    const { container } = render(
      <EligibilityAgeExceptions step={StepName.ELIGIBILITY_AGE_EXCEPTIONS} />,
    );
    expect(container).toMatchSnapshot();
  });
});
