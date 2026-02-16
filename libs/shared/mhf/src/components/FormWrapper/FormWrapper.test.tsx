import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { FormWrapper, getButtonText } from './FormWrapper';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('FormWrapper', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    jest.clearAllMocks();
  });

  it('renders children inside the form', () => {
    const { container } = render(
      <FormWrapper>
        <div>Child Content</div>
      </FormWrapper>,
    );
    expect(container).toMatchSnapshot();
  });
});

describe('getButtonText', () => {
  it('returns send-text for last input step', () => {
    const result = getButtonText(mockUseTranslation().t, 'step-1', true);
    expect(result).toBe('common.form.button.send-text');
  });

  it('returns custom step key if available', () => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) =>
        key === 'common.form.button.custom-step' ? 'Custom Button' : key,
      locale: 'en',
    });
    const result = getButtonText(mockUseTranslation().t, 'custom-step', false);
    expect(result).toBe('Custom Button');
  });

  it('returns continue-text if no custom key found', () => {
    const result = getButtonText(mockUseTranslation().t, 'unknown-step', false);
    expect(result).toBe('common.form.button.continue-text');
  });
});
