import { render } from '@testing-library/react';

import { SubTitleRenderer } from './SubTitleRenderer';

import '@testing-library/jest-dom';

describe('SubTitleRenderer', () => {
  const mockContent = 'mock-subtitle';
  const mockTestIdPrefix = 'test-prefix';

  it('matches snapshot for all sections', () => {
    const { container } = render(
      <SubTitleRenderer content={mockContent} testId={mockTestIdPrefix} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders nothing if subTitle is empty', () => {
    const { container } = render(
      <SubTitleRenderer content="" testId={mockTestIdPrefix} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
