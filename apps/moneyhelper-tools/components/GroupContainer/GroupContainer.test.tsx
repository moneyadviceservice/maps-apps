import React from 'react';

import { GroupType } from 'data/types';
import { render, screen } from '@testing-library/react';

import { GroupContainer } from './GroupContainer';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/common/components/ExpandableSection', () => ({
  ExpandableSection: jest.fn(({ title, children }) => (
    <div>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )),
}));

jest.mock('@maps-react/common/components/Heading', () => ({
  Heading: jest.fn(({ children }) => <h2>{children}</h2>),
}));

describe('GroupContainer', () => {
  const groupKey = 'group1';
  const title = 'Sample Title';
  const children = <div>Child content</div>;

  it('renders ExpandableSection when component is GroupType.EXPANDABLE', () => {
    render(
      <GroupContainer
        component={GroupType.EXPANDABLE}
        title={title}
        groupKey={groupKey}
        open={true}
      >
        {children}
      </GroupContainer>,
    );

    const sectionTitle = screen.getByText(title);
    expect(sectionTitle).toBeInTheDocument();
    const sectionChildren = screen.getByText('Child content');
    expect(sectionChildren).toBeInTheDocument();
  });

  it('renders Heading when component is GroupType.HEADING', () => {
    render(
      <GroupContainer
        component={GroupType.HEADING}
        title={title}
        groupKey={groupKey}
      >
        {children}
      </GroupContainer>,
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(title);
    const headingChildren = screen.getByText('Child content');
    expect(headingChildren).toBeInTheDocument();
  });

  it('renders only children when component is neither EXPANDABLE nor HEADING', () => {
    render(
      <GroupContainer
        component={'UNKNOWN' as GroupType}
        title={title}
        groupKey={groupKey}
      >
        {children}
      </GroupContainer>,
    );

    const renderedChildren = screen.getByText('Child content');
    expect(renderedChildren).toBeInTheDocument();
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });
});
