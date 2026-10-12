import { render } from '@testing-library/react';

import { Checkbox, CheckboxGroup } from './Checkbox';

import '@testing-library/jest-dom';

describe('Checkbox component (deprecated)', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Checkbox id="test-id" name="test-name" value="">
        Lorem Ipsum
      </Checkbox>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('applies error styles when hasError is true', () => {
    const { container } = render(
      <Checkbox id="error-id" name="error-name" hasError value="">
        Error Checkbox
      </Checkbox>,
    );

    const checkboxDiv = container.querySelector('div');
    expect(checkboxDiv?.className).toMatch(/border-red-700/);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('CheckboxGroup component', () => {
  const defaultProps = {
    name: 'toppings',
    label: 'Pizza toppings',
    items: [
      { label: 'Add cheese', value: 'addCheese', hint: 'Cheese is extra' },
      { label: 'Add olives', value: 'addOlives' },
      { label: 'Add peppers', value: 'addPeppers' },
    ],
  };

  it('renders checkbox group correctly', () => {
    const { container } = render(<CheckboxGroup {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders single item', () => {
    const { container } = render(
      <CheckboxGroup
        {...defaultProps}
        items={[{ label: 'Add cheese', value: 'addCheese' }]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with hint text', () => {
    const { container } = render(
      <CheckboxGroup {...defaultProps} hint="Choose all that apply" />,
    );
    expect(container).toMatchSnapshot();

    defaultProps.items
      .filter((item) => Object.hasOwn(item, 'hint'))
      .forEach((itemWithHint) => {
        expect(
          container
            .querySelector(`input[value="${itemWithHint.value}"]`)
            ?.getAttribute('aria-describedby'),
        ).toContain(`checkbox-group-${itemWithHint.value}-hint`);
      });
  });

  it('renders with error state', () => {
    const { container } = render(
      <CheckboxGroup {...defaultProps} error="This field is required" />,
    );
    expect(container).toMatchSnapshot();
    container
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkboxInput) => {
        expect(checkboxInput).toHaveAttribute('aria-invalid', 'true');
        expect(checkboxInput.getAttribute('aria-describedby')).toContain(
          'checkbox-group-error',
        );
      });
  });

  it('renders with defaultChecked prefill', () => {
    const { container } = render(
      <CheckboxGroup
        {...defaultProps}
        defaultChecked={['addCheese', 'addPeppers']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with error and hint together', () => {
    const { container } = render(
      <CheckboxGroup
        {...defaultProps}
        hint="Choose all that apply"
        error="At least one option is required"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with children content', () => {
    const { container } = render(
      <CheckboxGroup {...defaultProps}>
        <p>Additional information below</p>
      </CheckboxGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with hideLabel (sr-only)', () => {
    const { container } = render(
      <CheckboxGroup {...defaultProps} hideLabel={true} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with custom testId', () => {
    const { getByTestId } = render(
      <CheckboxGroup {...defaultProps} testId="custom-group" />,
    );
    expect(getByTestId('custom-group')).toMatchSnapshot();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <CheckboxGroup {...defaultProps} className="custom-class" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('can render without the Errors wrapper', () => {
    const { getByTestId, queryByTestId } = render(
      <CheckboxGroup
        {...defaultProps}
        testId="checkbox-no-error-wrapper"
        className="custom-class"
        hasErrorWrapper={false}
      />,
    );

    expect(queryByTestId('errors')).not.toBeInTheDocument();
    expect(getByTestId('checkbox-no-error-wrapper')).toHaveClass(
      'custom-class',
    );
  });

  it('renders with all props combined', () => {
    const { container } = render(
      <CheckboxGroup
        {...defaultProps}
        hint="Select all toppings you want"
        error="You must select at least one"
        defaultChecked={['addCheese']}
        testId="pizza-toppings"
        className="mb-4"
      >
        <p>Note: Extra cheese costs more</p>
      </CheckboxGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders item-level disabled state', () => {
    const { getByDisplayValue } = render(
      <CheckboxGroup
        {...defaultProps}
        items={[
          { label: 'Add cheese', value: 'addCheese', disabled: true },
          { label: 'Add olives', value: 'addOlives' },
        ]}
      />,
    );

    expect(getByDisplayValue('addCheese')).toBeDisabled();
    expect(getByDisplayValue('addOlives')).not.toBeDisabled();
  });
});
