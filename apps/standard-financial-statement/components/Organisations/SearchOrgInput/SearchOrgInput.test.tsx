import { fireEvent, render } from '@testing-library/react';

import { SearchOrgInput } from './SearchOrgInput';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

jest.mock('@maps-react/common/components/Icon', () => ({
  Icon: () => <span data-testid="search-icon" />,
  IconType: { SEARCH_ICON: 'search-icon' },
}));

describe('SearchOrgInput', () => {
  const onChangeHandler = jest.fn();

  beforeEach(() => {
    onChangeHandler.mockClear();
  });

  it('renders input and button elements', () => {
    const { container, getByRole } = render(
      <SearchOrgInput onChangeHandler={onChangeHandler} value="" />,
    );

    const input = getByRole('textbox');
    const button = getByRole('button');

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('renders the search icon inside the button', () => {
    const { getByTestId } = render(
      <SearchOrgInput onChangeHandler={onChangeHandler} value="" />,
    );
    expect(getByTestId('search-icon')).toBeInTheDocument();
  });

  it('calls onChangeHandler when typing in input', () => {
    const { getByRole } = render(
      <SearchOrgInput onChangeHandler={onChangeHandler} value="" />,
    );
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(onChangeHandler).toHaveBeenCalledTimes(1);
  });

  it('uses the provided input value', () => {
    const { getByRole } = render(
      <SearchOrgInput onChangeHandler={onChangeHandler} value="hello" />,
    );
    const input = getByRole('textbox') as HTMLInputElement;

    expect(input.value).toBe('hello');
  });
});
