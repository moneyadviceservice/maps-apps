import { render } from '@testing-library/react';

import { mockErrors } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { EligibilityOver50 } from '.';
import { StepName } from '../../../lib/constants';
import { describeEachLanguage } from '../../../test';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils');

describeEachLanguage('EligibilityOver50', () => {
  beforeEach(() => {
    (getFieldError as jest.Mock).mockReturnValue(undefined);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <EligibilityOver50 step={StepName.ELIGIBILITY_OVER_50} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <EligibilityOver50
        errors={mockErrors}
        step={StepName.ELIGIBILITY_OVER_50}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
