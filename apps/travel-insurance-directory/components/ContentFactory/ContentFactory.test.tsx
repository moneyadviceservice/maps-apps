import { CopyItem } from 'data/pages/register/types';
import { render, screen } from '@testing-library/react';

import { CalloutVariant } from '@maps-react/common/components/Callout';

import { ContentFactory } from './ContentFactory';

describe('ContentFactory', () => {
  const mockCopy: CopyItem[] = [
    {
      component: 'heading',
      level: 'h1',
      content: 'Main Title',
      style: 'custom-h1-class',
    },
    {
      component: 'paragraph',
      content: 'Standard paragraph text.',
      style: 'text-blue-500',
    },
    {
      component: 'paragraph',
      content: 'Paragraph with email placeholder {email}.',
      placeholder: {
        ref: '{email}',
        propName: 'email',
        replacementClassName: 'font-bold',
      },
    },
    {
      component: 'span',
      content: 'Small label text',
      style: 'uppercase',
    },
    {
      component: 'list',
      items: [{ label: 'Item 1', hintText: 'Hint 1' }, { label: 'Item 2' }],
    },
    {
      component: 'callout',
      variant: CalloutVariant.DEFAULT,
      style: 'mb-8',
      heading: {
        component: 'heading',
        content: 'Callout Title',
        level: 'h2',
        componentLevel: 'h3',
        style: 'mb-4',
      },
      copy: [
        { component: 'paragraph', content: 'Nested paragraph inside callout.' },
      ],
    },
  ];

  it('renders a heading with correct level and style', () => {
    render(<ContentFactory copy={[mockCopy[0]]} />);
    const heading = screen.getByText('Main Title');
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveClass('custom-h1-class');
  });

  it('renders a paragraph with standard and custom classes', () => {
    render(<ContentFactory copy={[mockCopy[1]]} />);
    const p = screen.getByText('Standard paragraph text.');
    expect(p).toHaveClass('mb-6', 'text-lg', 'text-blue-500');
  });

  it('renders a paragraph and replaces placeholder with actual value', () => {
    render(
      <ContentFactory
        copy={[mockCopy[2]]}
        copyPlaceholderValues={{ email: 'test@example.com' }}
      />,
    );
    const p = screen.getByTestId('copyItemContent-0');
    expect(p).toHaveClass('mb-6', 'text-lg', '');
    expect(p).toHaveTextContent(
      'Paragraph with email placeholder test@example.com.',
    );
  });

  it('renders a block span correctly', () => {
    render(<ContentFactory copy={[mockCopy[3]]} />);
    const span = screen.getByText('Small label text');
    expect(span).toHaveClass('block', 'uppercase');
  });

  it('renders list items with labels and hint text', () => {
    render(<ContentFactory copy={[mockCopy[4]]} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Hint 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    expect(screen.getByText('Item 1')).toHaveClass('font-semibold');
    expect(screen.getByText('Item 2')).not.toHaveClass('font-semibold');
  });

  it('renders a recursive callout correctly', () => {
    render(<ContentFactory copy={[mockCopy[5]]} />);

    expect(screen.getByText('Callout Title')).toBeInTheDocument();

    expect(
      screen.getByText('Nested paragraph inside callout.'),
    ).toBeInTheDocument();
  });

  it('renders children passed to the component', () => {
    render(
      <ContentFactory copy={[]}>
        <div data-testid="child-element">Legacy Child</div>
      </ContentFactory>,
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });

  it('returns null for an unrecognized component type', () => {
    const invalidCopy = [
      { component: 'unknown-type' },
    ] as unknown as CopyItem[];
    const { container } = render(<ContentFactory copy={invalidCopy} />);
    expect(container.firstChild).toBeNull();
  });
});
