import React from 'react';

import { render, screen } from '@testing-library/react';

import { ExpandableSection } from '.';

describe('ExpandableSection component', () => {
  it('renders correctly', () => {
    render(
      <ExpandableSection title="Expand">
        <p>Contents</p>
      </ExpandableSection>,
    );
    const section = screen.getByTestId('expandable-section');
    expect(section).toMatchSnapshot();
  });
  it('renders open', () => {
    render(
      <ExpandableSection title="Expand" open>
        <p>Contents</p>
      </ExpandableSection>,
    );
    const section = screen.getByTestId('expandable-section');
    expect(section).toMatchSnapshot();
  });
  it('renders secondary correctly', () => {
    render(
      <ExpandableSection title="Expand" variant="main">
        <p>Contents</p>
      </ExpandableSection>,
    );
    const section = screen.getByTestId('expandable-section');
    expect(section).toMatchSnapshot();
  });

  it('renders main left icon correctly', () => {
    render(
      <ExpandableSection title="Expand" variant="mainLeftIcon">
        <p>Contents</p>
      </ExpandableSection>,
    );
    const section = screen.getByTestId('expandable-section');
    expect(section).toMatchSnapshot();
  });

  it('renders accordion without icon correctly', () => {
    render(
      <ExpandableSection title="Expand" variant="linkWithoutIcon">
        <p>Contents</p>
      </ExpandableSection>,
    );
    const section = screen.getByTestId('expandable-section');
    expect(section).toMatchSnapshot();
  });

  it('renders accordion with different titles on close and on open correctly', () => {
    render(
      <ExpandableSection
        title="Expand"
        variant="main"
        closedTitle="Hide Content"
      >
        <p>Contents</p>
      </ExpandableSection>,
    );
    const section = screen.getByTestId('expandable-section');
    expect(section).toMatchSnapshot();
  });
});
