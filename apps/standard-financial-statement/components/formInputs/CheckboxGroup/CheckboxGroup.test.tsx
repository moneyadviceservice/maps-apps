import slug from 'slug';
import { fireEvent, render, screen } from '@testing-library/react';

import { CheckboxGroup } from './CheckboxGroup';

import '@testing-library/jest-dom';

jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));

describe('CheckboxGroup', () => {
  const options = [
    { key: 'education', en: 'Education', cy: 'Addysg' },
    { key: 'health', en: 'Health', cy: 'Iechyd' },
    { key: 'arts', en: 'Arts', cy: 'Celfyddydau' },
  ];

  const defaultValues = [{ key: 'health', title: 'Health' }];

  it('renders checkboxes with labels', () => {
    render(
      <CheckboxGroup options={options} defaultValues={[]} legend="Sector" />,
    );

    options.forEach(({ key, en }) => {
      const id = slug(key);
      const checkbox = screen.getByRole('checkbox', { name: en });
      expect(checkbox).toHaveAttribute('id', id);
      expect(screen.getByText(en)).toBeInTheDocument();
    });
  });

  it('renders legend if provided', () => {
    render(
      <CheckboxGroup options={options} defaultValues={[]} legend="Sector" />,
    );
    expect(screen.getByText('Sector')).toBeInTheDocument();
  });

  it('checks default values', () => {
    render(
      <CheckboxGroup
        options={options}
        defaultValues={defaultValues}
        legend="Sector"
      />,
    );

    const healthCheckbox = screen.getByRole('checkbox', { name: 'Health' });
    expect(healthCheckbox).toBeChecked();
  });

  it('toggles checkbox selection on click', () => {
    render(
      <CheckboxGroup options={options} defaultValues={[]} legend="Sector" />,
    );

    const educationCheckbox = screen.getByRole('checkbox', {
      name: 'Education',
    });
    expect(educationCheckbox).not.toBeChecked();

    fireEvent.click(educationCheckbox);
    expect(educationCheckbox).toBeChecked();

    fireEvent.click(educationCheckbox);
    expect(educationCheckbox).not.toBeChecked();
  });

  it('uses custom classNames if provided', () => {
    const { container } = render(
      <CheckboxGroup
        options={options}
        defaultValues={[]}
        legend="Sector"
        classNames="custom-grid"
      />,
    );

    expect(container.querySelector('.custom-grid')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <CheckboxGroup
        options={options}
        defaultValues={defaultValues}
        legend="Sector"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
