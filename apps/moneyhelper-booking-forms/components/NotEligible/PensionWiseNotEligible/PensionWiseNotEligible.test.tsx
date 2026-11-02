import { render } from '@testing-library/react';

import { PensionWiseNotEligible } from '.';
import { StepName } from '../../../lib/constants';
import { describeEachLanguage } from '../../../test';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@maps-react/mhf/utils');

// Mock the `useTranslation` hook
describeEachLanguage('PensionWiseNotEligible', () => {
  it('renders component correctly', () => {
    const { container } = render(
      <PensionWiseNotEligible step={StepName.PENSION_WISE_NOT_ELIGIBLE} />,
    );
    expect(container).toMatchSnapshot();
  });
});
