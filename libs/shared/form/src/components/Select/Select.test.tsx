import { fireEvent, render, screen } from '@testing-library/react';

import { Select } from './Select';

const options = [
  { text: 'English', value: 'en' },
  { text: 'Spanish', value: 'es' },
];

describe('Select component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Select name="language" options={options} label="Label" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with empty item text', () => {
    const { container } = render(
      <Select
        emptyItemText="Select a language"
        name="language"
        options={options}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with hidden empty item', () => {
    const { container } = render(
      <Select hideEmptyItem name="language" options={options} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with hidden placeholder', () => {
    const { container } = render(
      <Select hidePlaceholder name="language" options={options} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with error', () => {
    const { container } = render(
      <Select
        hasError
        error="This field is required"
        name="language"
        options={options}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with hidden label', () => {
    const { container } = render(
      <Select hideLabel name="language" options={options} label="Label" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with error wrapper', () => {
    const { container } = render(
      <Select
        hasErrorWrapper
        hasError
        error="This field is required"
        name="language"
        options={options}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a default value', () => {
    const { container } = render(
      <Select
        defaultValue="es"
        name="language"
        options={options}
        label="Label"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders as a controlled select when value is provided', () => {
    const handleChange = jest.fn();

    render(
      <Select
        name="language"
        options={options}
        value="en"
        onChange={handleChange}
        label="Label"
      />,
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('en');

    fireEvent.change(select, { target: { value: 'es' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
