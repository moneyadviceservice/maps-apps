import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { FormErrorCallout } from './FormErrorCallout';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

const mockErrors = [
  { field: 'field-1', message: 'Field 1 is required' },
  { field: 'field-2', message: 'Field 2 is required' },
];
const mockStep = 'step-1';

describe('FormErrorCallout', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('should render with errors', () => {
    const { container } = render(
      <FormErrorCallout errors={mockErrors} step={mockStep} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render null if errors are undefined', () => {
    const { container } = render(
      <FormErrorCallout errors={undefined} step={mockStep} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render null if errors are empty', () => {
    const { container } = render(
      <FormErrorCallout errors={[]} step={mockStep} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render null if step is not provided', () => {
    const { container } = render(
      <FormErrorCallout errors={mockErrors} step={undefined} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
