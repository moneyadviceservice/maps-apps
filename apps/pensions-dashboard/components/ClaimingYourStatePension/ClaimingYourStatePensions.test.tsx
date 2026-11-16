import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ClaimingYourStatePension } from './ClaimingYourStatePension';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('ClaimingYourStatePension Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => ['item1', 'item2', 'item3'],
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<ClaimingYourStatePension />);
    expect(container).toMatchSnapshot();
  });

  it.each`
    description           | text
    ${'heading text'}     | ${'pages.pension-details.claiming-your-state-pension.heading'}
    ${'first list item'}  | ${'item1'}
    ${'second list item'} | ${'item2'}
    ${'third list item'}  | ${'item3'}
  `('renders $description', ({ text }) => {
    const { getByText } = render(<ClaimingYourStatePension />);
    expect(getByText(text)).toBeInTheDocument();
  });
});
