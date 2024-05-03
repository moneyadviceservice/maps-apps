import { render } from '@testing-library/react';
import { StepContainer } from './StepContainer';

jest.mock('@maps-digital/shared/hooks', () => ({
  useTranslation: () => ({ z: () => 'Back' }),
}));

describe('StepContainer component', () => {
  it('renders correctly as form', () => {
    const { container } = render(
      <StepContainer backLink="test/back/link">
        <span>Questions</span>
      </StepContainer>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with children only', () => {
    const { container } = render(
      <StepContainer backLink="test/back/link" action={'/api/submit'}>
        <span>Questions</span>
      </StepContainer>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
