import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '.';
import { Icon, IconType } from '../Icon';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button data-testid="button">Click me</Button>);
    const button = screen.getByTestId('button');
    expect(button).toMatchSnapshot();
  });
  it('renders secondary variant correctly', () => {
    render(
      <Button data-testid="button" variant="secondary">
        Click me
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button).toMatchSnapshot();
  });
  it('renders loading variant correctly', () => {
    render(
      <Button data-testid="button" variant="loading">
        Click me
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button).toMatchSnapshot();
  });
  it('renders chevron icon to the right correctly', () => {
    render(
      <Button data-testid="button" iconRight={<Icon type={IconType.CHEVRON} />}>
        Click me
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button).toMatchSnapshot();
  });
  it('renders chevron icon to the left correctly', () => {
    render(
      <Button data-testid="button" iconLeft={<Icon type={IconType.CHEVRON} />}>
        Click me
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button).toMatchSnapshot();
  });
  it('renders link variant correctly', () => {
    render(
      <Button data-testid="button" variant="link">
        Edit
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button).toMatchSnapshot();
  });
  it('renders as anchor', () => {
    render(
      <Button
        data-testid="button"
        variant="link"
        as="a"
        href="https://www.moneyhelper.org.uk/en"
      >
        Back
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button).toMatchSnapshot();
  });
});
