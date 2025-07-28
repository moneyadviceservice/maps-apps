import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { FormWrapper } from './FormWrapper';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;
const mockStep = 'mock-step';

describe('FormWrapper', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });
  it('renders children inside the form', () => {
    const { container } = render(
      <FormWrapper step={mockStep}>
        <div data-testid="child">Child Content</div>
      </FormWrapper>,
    );
    expect(container).toMatchSnapshot();
  });
});
