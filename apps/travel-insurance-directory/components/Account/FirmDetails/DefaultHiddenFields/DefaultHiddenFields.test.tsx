import { render } from '@testing-library/react';

import { DefaultHiddenFields } from './DefaultHiddenFields';

describe('DefaultHiddenFields', () => {
  it('renders the hidden inputs with the correct names and values', () => {
    const testProps = {
      firmId: 'firm-123',
      isChangeAnswer: 'yes',
    };

    const { container } = render(<DefaultHiddenFields {...testProps} />);

    const firmIdInput = container.querySelector('input[name="firmId"]');
    const isChangeAnswerInput = container.querySelector(
      'input[name="isChangeAnswer"]',
    );

    expect(firmIdInput).toBeInTheDocument();
    expect(firmIdInput).toHaveValue('firm-123');

    expect(isChangeAnswerInput).toBeInTheDocument();
    expect(isChangeAnswerInput).toHaveValue('yes');
  });

  it('handles optional undefined props gracefully', () => {
    const { container } = render(<DefaultHiddenFields firmId="firm-456" />);

    const isChangeAnswerInput = container.querySelector(
      'input[name="isChangeAnswer"]',
    );

    expect(isChangeAnswerInput).not.toBeInTheDocument();
  });
});
