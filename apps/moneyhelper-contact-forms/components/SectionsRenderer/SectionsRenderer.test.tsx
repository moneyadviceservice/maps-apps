import { render } from '@testing-library/react';

import { SectionsRenderer, SectionsRendererProps } from './SectionsRenderer';

import '@testing-library/jest-dom';

describe('SectionsRenderer', () => {
  const sections: SectionsRendererProps[] = [
    {
      title: 'mock-title',
      content: 'mock-content',
      items: ['mock-item'],
      footer: 'mock-footer',
    },
    {
      title: 'mock-title',
      content: 'mock-content',
      items: ['mock-item', 'mock-item', 'mock-item'],
    },
    {
      content: 'mock-content',
    },
  ];

  const mockTestIdPrefix = 'test-prefix';

  it('matches snapshot for all sections', () => {
    const { container } = render(
      <SectionsRenderer sections={sections} testIdPrefix={mockTestIdPrefix} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders nothing if sections is empty', () => {
    const { container } = render(
      <SectionsRenderer sections={[]} testIdPrefix={mockTestIdPrefix} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
