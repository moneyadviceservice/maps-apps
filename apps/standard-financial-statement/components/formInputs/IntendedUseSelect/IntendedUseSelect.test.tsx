import { fireEvent, render } from '@testing-library/react';

import { IntendedUseSelect } from './IntendedUseSelect';

import '@testing-library/jest-dom';

jest.mock('@maps-react/common/components/Icon', () => ({
  IconType: {
    CHEVRON_DOWN: 'chevron-down',
  },
  Icon: ({ type, className }: { type: string; className?: string }) => (
    <div data-testid="icon" data-type={type} className={className}>
      {type}
    </div>
  ),
}));

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

describe('IntendedUseSelect', () => {
  const defaultProps = {
    defaultVal: '',
    otherDefaultVal: '',
    lang: 'en',
    isEditOrg: false,
  };

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<IntendedUseSelect {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders label when isEditOrg is false', () => {
    const { getByLabelText } = render(<IntendedUseSelect {...defaultProps} />);
    expect(getByLabelText('Filter by organisation type')).toBeInTheDocument();
  });

  it('does not render label when isEditOrg is true', () => {
    const { queryByLabelText } = render(
      <IntendedUseSelect {...defaultProps} isEditOrg />,
    );
    expect(
      queryByLabelText('Filter by organisation type'),
    ).not.toBeInTheDocument();
  });

  it('shows "other" input when "Other" option is selected', () => {
    const { getByTestId } = render(<IntendedUseSelect {...defaultProps} />);
    const select = getByTestId('select-input');
    fireEvent.change(select, { target: { value: 'other' } });

    expect(getByTestId('other-input')).toBeInTheDocument();
  });

  it('shows "other" input and renders default value', () => {
    const propsWithDefaultOther = {
      ...defaultProps,
      defaultVal: 'other',
      otherDefaultVal: 'other val',
    };
    const { getByTestId } = render(
      <IntendedUseSelect {...propsWithDefaultOther} />,
    );

    expect(getByTestId('other-input')).toBeInTheDocument();
  });

  it('does not show "other" input initially when other is not selected', () => {
    const { queryByTestId } = render(<IntendedUseSelect {...defaultProps} />);
    expect(queryByTestId('other-input')).not.toBeInTheDocument();
  });
});
