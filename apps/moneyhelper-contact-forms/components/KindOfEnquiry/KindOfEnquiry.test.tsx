import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { KindOfEnquiry } from './';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');

const mockUseTranslation = useTranslation as jest.Mock;

// Mock the `useTranslation` hook
describe('KindOfEnquiry Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => [
        { value: 'kind-of-enquiry-value', text: 'Kind of Enquiry' },
      ],
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<KindOfEnquiry flow="flow" />);
    expect(container).toMatchSnapshot();
  });

  it('renders component with errors', () => {
    const { container } = render(
      <KindOfEnquiry
        errors={[{ field: 'mock-field', message: 'mock-error' }]}
        flow="flow"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
