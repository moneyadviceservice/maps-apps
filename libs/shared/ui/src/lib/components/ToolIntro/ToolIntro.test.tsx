import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToolIntro } from '.';

describe('ToolIntro component', () => {
  it('renders correctly ', () => {
    render(
      <ToolIntro>
        <p>Lorem ipsum</p>
      </ToolIntro>,
    );
    const toolIntro = screen.getByTestId('tool-intro');
    expect(toolIntro).toMatchSnapshot();
  });
});
