import React, { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { ListElement } from '.';

describe('List component', () => {
  const Content: ReactNode[] = [];
  beforeAll(() => {
    Content.push(<p>First line</p>);
    Content.push(<p>Second Line</p>);
    Content.push(<p>Third Line</p>);
  });
  it('renders the unordered magenta list correctly', () => {
    render(<ListElement items={Content} color="magenta" variant="unordered" />);
    const list = screen.getByTestId('list-element');
    expect(list).toMatchSnapshot();
  });

  it('renders the unordered dark list correctly', () => {
    render(<ListElement items={Content} color="dark" variant="unordered" />);
    const list = screen.getByTestId('list-element');
    expect(list).toMatchSnapshot();
  });

  it('renders the unordered blue list correctly', () => {
    render(<ListElement items={Content} color="blue" variant="unordered" />);
    const list = screen.getByTestId('list-element');
    expect(list).toMatchSnapshot();
  });

  it('renders the unordered magenta list correctly', () => {
    render(<ListElement items={Content} color="magenta" variant="ordered" />);
    const list = screen.getByTestId('list-element');
    expect(list).toMatchSnapshot();
  });

  it('renders the unordered dark list correctly', () => {
    render(<ListElement items={Content} color="dark" variant="ordered" />);
    const list = screen.getByTestId('list-element');
    expect(list).toMatchSnapshot();
  });

  it('renders the unordered blue list correctly', () => {
    render(<ListElement items={Content} color="blue" variant="ordered" />);
    const list = screen.getByTestId('list-element');
    expect(list).toMatchSnapshot();
  });
});
