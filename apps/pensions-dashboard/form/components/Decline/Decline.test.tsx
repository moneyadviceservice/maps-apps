import { render } from '@testing-library/react';

import {
  mockSections,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { Decline } from '.';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

describe('Decline Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockSections,
    });
  });
  it('renders component correctly', () => {
    const { container } = render(<Decline step={mockSteps[0]} />);
    expect(container).toMatchSnapshot();
  });
});
