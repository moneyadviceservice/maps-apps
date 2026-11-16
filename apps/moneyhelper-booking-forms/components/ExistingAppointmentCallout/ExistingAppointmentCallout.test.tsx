import { render } from '@testing-library/react';

import { mockSteps } from '@maps-react/mhf/mocks';

import { ExistingAppointmentCallout } from '.';
import { describeEachLanguage } from '../../test';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describeEachLanguage('ExistingAppointmentCallout Component', () => {
  it('renders component correctly', () => {
    const { container } = render(
      <ExistingAppointmentCallout step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });
});
