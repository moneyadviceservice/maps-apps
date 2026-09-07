import { render } from '@testing-library/react';

import { data } from './pension-type';

describe('pension-type results data', () => {
  it('exports headings with a defaultTitle', () => {
    expect(data.headings.defaultTitle.en).toBeTruthy();
    expect(data.headings.defaultTitle.cy).toBeTruthy();
  });

  it('exports three conditional titles', () => {
    expect(data.headings.conditionalTitles).toHaveLength(3);
  });

  it('each conditional title has conditions and a title', () => {
    data.headings.conditionalTitles.forEach((ct) => {
      expect(ct.title.en).toBeTruthy();
      expect(ct.title.cy).toBeTruthy();
      expect(ct.conditions.length).toBeGreaterThan(0);
    });
  });

  it('exports content with defaultContent', () => {
    expect(data.content.defaultContent.en).toBeDefined();
    expect(data.content.defaultContent.cy).toBeDefined();
  });

  it('exports one conditional content entry with conditions', () => {
    expect(data.content.conditionalContent).toHaveLength(1);
    expect(
      data.content.conditionalContent[0].conditions.length,
    ).toBeGreaterThan(0);
  });

  it('renders defaultContent en JSX without error', () => {
    const { container } = render(<>{data.content.defaultContent.en}</>);
    expect(container).toBeTruthy();
  });

  it('renders defaultContent cy JSX without error', () => {
    const { container } = render(<>{data.content.defaultContent.cy}</>);
    expect(container).toBeTruthy();
  });

  it('renders conditional content en JSX without error', () => {
    const { container } = render(
      <>{data.content.conditionalContent[0].content.en}</>,
    );
    expect(container).toBeTruthy();
  });

  it('renders conditional content cy JSX without error', () => {
    const { container } = render(
      <>{data.content.conditionalContent[0].content.cy}</>,
    );
    expect(container).toBeTruthy();
  });
});
