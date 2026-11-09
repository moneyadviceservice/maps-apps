import { render } from '@testing-library/react';

import {
  mockSections,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { AgreementAndConsent } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

describe('AgreementAndConsent Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockSections[0].items,
      locale: 'en',
    });
  });
  it('renders component correctly', () => {
    const { container } = render(<AgreementAndConsent step={mockSteps[0]} />);
    expect(container).toMatchSnapshot();
  });
});
