import { render } from '@testing-library/react';

import { mockUseTranslation } from '@maps-react/mhf/mocks';

import { ExistingAppointmentCallout } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

// Mock the `useTranslation` hook
describe('ExistingAppointmentCallout Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<ExistingAppointmentCallout />);
    expect(container).toMatchSnapshot();
  });
});
