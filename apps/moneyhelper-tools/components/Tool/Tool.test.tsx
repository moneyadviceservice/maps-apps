import { tools } from 'data/tools-data';
import { fireEvent, render, screen } from '@testing-library/react';

import { Tool } from './Tool';

jest.mock('copy-to-clipboard', () => () => true);

describe('Select component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Tool name="Test" title="test" description="test" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const { container } = render(
      <Tool name="Test" title="test" description="test" />,
    );
    fireEvent.click(screen.getByTestId('copy-embed'));
    fireEvent.change(screen.getByTestId('language-select'));
    expect(container).toMatchSnapshot();
  });

  it('renders external tool correctly', () => {
    const { container } = render(
      <Tool
        name="Test"
        title="test"
        description="test"
        details={{
          en: {
            embedCode: 'test',
            url: 'test',
          },
          cy: {
            embedCode: 'test',
            url: 'test',
          },
        }}
      />,
    );
    fireEvent.click(screen.getByTestId('copy-embed'));
    fireEvent.change(screen.getByTestId('language-select'));
    expect(container).toMatchSnapshot();
  });

  it('links the pension type tool and embeds to the landing page', () => {
    const pensionTypeTool = tools.find((tool) => tool.title === 'Pension Type');
    if (!pensionTypeTool) {
      throw new Error('Pension Type tool is missing');
    }

    const { container } = render(<Tool {...pensionTypeTool} />);

    for (const [language, label] of [
      ['en', 'English'],
      ['cy', 'Cymraeg'],
    ]) {
      expect(
        screen.getByRole('link', { name: `${label} home page` }),
      ).toHaveAttribute('href', `/${language}/pension-type`);
      const exampleLink = screen.getByRole('link', {
        name: `${label} Example page`,
      });
      const exampleUrl = new URL(
        exampleLink.getAttribute('href') ?? '',
        location.origin,
      );
      expect(exampleUrl.searchParams.get('name')).toBe('pension-type');
      expect(exampleUrl.searchParams.get('language')).toBe(language);

      fireEvent.change(screen.getByTestId('language-select'), {
        target: { value: language },
      });
      expect(container.querySelector('code')).toHaveTextContent(
        `src="${location.origin}/${language}/pension-type?isEmbedded=true"`,
      );
    }
  });
});
