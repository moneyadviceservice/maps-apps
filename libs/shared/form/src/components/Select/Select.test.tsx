import React from 'react';

import { render } from '@testing-library/react';

import { Select } from './Select';

const options = [
  { text: 'English', value: 'en' },
  { text: 'Spanish', value: 'es' },
];

describe('Select component', () => {
  it('renders correctly', () => {
    const { container } = render(<Select name="language" options={options} />);
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
});
