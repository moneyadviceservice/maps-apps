import React from 'react';
import { render, screen } from '@testing-library/react';
import { Heading, H1, H2, H3, H4, H5, H6 } from '.';

describe('Heading component', () => {
  it('renders correctly', () => {
    render(<Heading data-testid="heading">Heading</Heading>);
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
  it('renders correctly with custom props', () => {
    render(
      <Heading
        data-testid="heading"
        level="h3"
        color="text-red-700"
        fontWeight="font-[300]"
      >
        Heading
      </Heading>,
    );
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
  it('renders with different component', () => {
    render(
      <Heading data-testid="heading" level="h1" component="h2">
        Heading
      </Heading>,
    );
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
  it('H1 renders correctly', () => {
    render(<H1 data-testid="heading">Heading</H1>);
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
  it('H2 renders correctly', () => {
    render(<H2 data-testid="heading">Heading</H2>);
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
  it('H3 renders correctly', () => {
    render(<H3 data-testid="heading">Heading</H3>);
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
  it('H4 renders correctly', () => {
    render(<H4 data-testid="heading">Heading</H4>);
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
  it('H5 renders correctly', () => {
    render(<H5 data-testid="heading">Heading</H5>);
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
  it('H6 renders correctly', () => {
    render(<H6 data-testid="heading">Heading</H6>);
    const heading = screen.getByTestId('heading');
    expect(heading).toMatchSnapshot();
  });
});
