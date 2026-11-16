import { render } from '@testing-library/react';

import { data } from './pension-type';

describe('pension-type results data', () => {
  it('exports three result sections with titles, content and conditions', () => {
    expect(data.results).toHaveLength(3);
    data.results.forEach((result) => {
      expect(result.title.en).toBeTruthy();
      expect(result.title.cy).toBeTruthy();
      expect(result.content.en).toBeDefined();
      expect(result.content.cy).toBeDefined();
      expect(
        result.conditions?.length ?? result.conditionGroups?.length,
      ).toBeGreaterThan(0);
    });
  });

  it('renders all result content in English and Welsh without error', () => {
    data.results.forEach(({ content }) => {
      expect(render(<>{content.en}</>).container).toBeTruthy();
      expect(render(<>{content.cy}</>).container).toBeTruthy();
    });
  });
});
