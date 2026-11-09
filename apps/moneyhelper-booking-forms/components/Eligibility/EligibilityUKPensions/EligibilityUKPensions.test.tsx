import { render } from '@testing-library/react';

import useLanguage from '@maps-react/hooks/useLanguage';
import { mockErrors } from '@maps-react/mhf/mocks';
import { getFieldError } from '@maps-react/mhf/utils';

import { EligibilityUKPensions } from '.';
import { StepName } from '../../../lib/constants';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils');

describe.each(['en', 'cy'])('EligibilityUKPensions (%s)', (locale) => {
  beforeEach(() => {
    jest.mocked(useLanguage).mockReturnValue(locale);
    (getFieldError as jest.Mock).mockReturnValue(false);
  });

  it('renders component correctly', () => {
    const { container } = render(
      <EligibilityUKPensions step={StepName.ELIGIBILITY_UK_PENSIONS} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    (getFieldError as jest.Mock).mockReturnValue(true);
    const { container } = render(
      <EligibilityUKPensions
        errors={mockErrors}
        step={StepName.ELIGIBILITY_UK_PENSIONS}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
