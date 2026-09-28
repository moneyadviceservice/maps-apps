import { render } from '@testing-library/react';

import { ScamWarning } from './ScamWarning';

import '@testing-library/jest-dom/extend-expect';

describe('ScamWarning', () => {
  it('renders correctly', () => {
    const { container } = render(<ScamWarning title="test">test</ScamWarning>);
    expect(container).toMatchSnapshot();
  });

  it.each`
    title           | children                 | text
    ${'test title'} | ${(<p>test content</p>)} | ${'test title'}
    ${'test title'} | ${(<p>test content</p>)} | ${'test content'}
  `('renders $text correctly', ({ title, children, text }) => {
    const { getByText } = render(
      <ScamWarning title={title}>{children}</ScamWarning>,
    );
    expect(getByText(text)).toBeInTheDocument();
  });
});
