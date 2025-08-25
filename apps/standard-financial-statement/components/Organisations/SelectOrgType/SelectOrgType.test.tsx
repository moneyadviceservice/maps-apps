import { fireEvent, render } from '@testing-library/react';

import { SelectOrgType } from './SelectOrgType';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

jest.mock('@maps-react/common/components/Icon', () => ({
  Icon: ({ className }: { className: string }) => (
    <div data-testid="chevron-icon" className={className}>
      Icon
    </div>
  ),
  IconType: { CHEVRON_DOWN: 'chevron-down' },
}));

describe('SelectOrgType', () => {
  const onClickHandler = jest.fn();

  beforeEach(() => {
    onClickHandler.mockClear();
  });

  it('renders a select element with options', () => {
    const { container, getByRole, getAllByRole } = render(
      <SelectOrgType onClickHandler={onClickHandler} defaultVal="" lang="en" />,
    );

    const select = getByRole('combobox');
    expect(select).toBeInTheDocument();

    const options = getAllByRole('option');
    expect(options.length).toBeGreaterThan(1);

    expect(container).toMatchSnapshot();
  });

  it('triggers onClickHandler when an option is selected', () => {
    const { getByRole } = render(
      <SelectOrgType onClickHandler={onClickHandler} defaultVal="" lang="en" />,
    );

    const select = getByRole('combobox');
    fireEvent.change(select, { target: { value: 'some-value' } });

    expect(onClickHandler).toHaveBeenCalledTimes(1);
  });

  it('uses the provided default value', () => {
    const { getByRole } = render(
      <SelectOrgType
        onClickHandler={onClickHandler}
        defaultVal="Debt management company"
        lang="en"
      />,
    );

    const select = getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Debt management company');
  });

  it('renders dropdown icon', () => {
    const { getByTestId } = render(
      <SelectOrgType onClickHandler={onClickHandler} defaultVal="" lang="en" />,
    );

    expect(getByTestId('chevron-icon')).toBeInTheDocument();
  });
});
