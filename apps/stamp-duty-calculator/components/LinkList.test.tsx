import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LinkList } from './LinkList';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    className,
    title,
    rel,
    target,
  }: any) {
    return (
      <a
        href={href}
        className={className}
        title={title}
        rel={rel}
        target={target}
      >
        {children}
      </a>
    );
  };
});

// Mock the common components
jest.mock('@maps-react/common/components/Heading', () => ({
  H2: ({ children, color }: any) => <h2 className={color}>{children}</h2>,
}));

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children }: any) => <p>{children}</p>,
}));

describe('LinkList', () => {
  const mockLinks = [
    {
      title: 'First Link',
      href: '/first-link',
    },
    {
      title: 'Second Link',
      href: '/second-link',
      target: '_self',
    },
    {
      title: 'External Link',
      href: 'https://example.com',
      target: '_blank',
    },
  ];

  const defaultProps = {
    title: 'Test Link List',
    links: mockLinks,
  };

  describe('Basic rendering', () => {
    it('should render the title', () => {
      render(<LinkList {...defaultProps} />);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Test Link List')).toBeInTheDocument();
    });

    it('should render all links', () => {
      render(<LinkList {...defaultProps} />);

      expect(screen.getByText('First Link')).toBeInTheDocument();
      expect(screen.getByText('Second Link')).toBeInTheDocument();
      expect(screen.getByText('External Link')).toBeInTheDocument();
    });

    it('should render links with correct hrefs', () => {
      render(<LinkList {...defaultProps} />);

      expect(screen.getByText('First Link').closest('a')).toHaveAttribute(
        'href',
        '/first-link',
      );
      expect(screen.getByText('Second Link').closest('a')).toHaveAttribute(
        'href',
        '/second-link',
      );
      expect(screen.getByText('External Link').closest('a')).toHaveAttribute(
        'href',
        'https://example.com',
      );
    });

    it('should render arrow icons for each link', () => {
      const { container } = render(<LinkList {...defaultProps} />);

      const svgElements = container.querySelectorAll('svg');
      expect(svgElements).toHaveLength(3);

      svgElements.forEach((svg) => {
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Optional description', () => {
    it('should render description when provided', () => {
      const propsWithDescription = {
        ...defaultProps,
        description: 'This is a test description',
      };

      render(<LinkList {...propsWithDescription} />);

      expect(
        screen.getByText('This is a test description'),
      ).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      render(<LinkList {...defaultProps} />);

      expect(
        screen.queryByText('This is a test description'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Target attributes', () => {
    it('should respect individual link targets when not embedded', () => {
      render(<LinkList {...defaultProps} isEmbedded={false} />);

      expect(screen.getByText('First Link').closest('a')).not.toHaveAttribute(
        'target',
      );
      expect(screen.getByText('Second Link').closest('a')).toHaveAttribute(
        'target',
        '_self',
      );
      expect(screen.getByText('External Link').closest('a')).toHaveAttribute(
        'target',
        '_blank',
      );
    });

    it('should force all links to open in new tab when embedded', () => {
      render(<LinkList {...defaultProps} isEmbedded={true} />);

      expect(screen.getByText('First Link').closest('a')).toHaveAttribute(
        'target',
        '_blank',
      );
      expect(screen.getByText('Second Link').closest('a')).toHaveAttribute(
        'target',
        '_blank',
      );
      expect(screen.getByText('External Link').closest('a')).toHaveAttribute(
        'target',
        '_blank',
      );
    });
  });

  describe('CSS classes and styling', () => {
    it('should apply correct CSS classes to the container', () => {
      render(<LinkList {...defaultProps} />);

      const container = screen.getByText('Test Link List').closest('div');
      expect(container).toHaveClass('space-y-6');
    });

    it('should apply correct CSS classes to the heading', () => {
      render(<LinkList {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-blue-700');
    });

    it('should apply correct CSS classes to the list', () => {
      render(<LinkList {...defaultProps} />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('t-link-list');
    });

    it('should apply correct CSS classes to link items', () => {
      render(<LinkList {...defaultProps} />);

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item).toHaveClass(
          'border-b',
          'first:border-t',
          'border-slate-400',
        );
      });
    });

    it('should apply correct CSS classes to links', () => {
      render(<LinkList {...defaultProps} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass(
          'block',
          'py-2',
          'text-pink-800',
          'cursor-pointer',
          'hover:text-pink-900',
          'hover:underline',
          'hover:bg-slate-200',
          'focus:bg-yellow-400',
          'focus:underline',
          'focus:text-gray-800',
          'focus:shadow-link-focus',
          'hover:shadow-transparent',
          'focus-within:outline-none',
          'active:text-gray-800',
          'active:underline',
          'active:bg-transparent',
          'visited:text-purple-700',
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should set title attribute on links', () => {
      render(<LinkList {...defaultProps} />);

      expect(screen.getByText('First Link').closest('a')).toHaveAttribute(
        'title',
        'First Link',
      );
      expect(screen.getByText('Second Link').closest('a')).toHaveAttribute(
        'title',
        'Second Link',
      );
      expect(screen.getByText('External Link').closest('a')).toHaveAttribute(
        'title',
        'External Link',
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle empty links array', () => {
      const emptyLinksProps = {
        ...defaultProps,
        links: [],
      };

      render(<LinkList {...emptyLinksProps} />);

      expect(screen.getByText('Test Link List')).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('should filter out falsy links', () => {
      const linksWithFalsy = [
        mockLinks[0],
        null,
        undefined,
        mockLinks[1],
        false,
      ];

      const propsWithFalsyLinks = {
        ...defaultProps,
        links: linksWithFalsy as any,
      };

      render(<LinkList {...propsWithFalsyLinks} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
      expect(screen.getByText('First Link')).toBeInTheDocument();
      expect(screen.getByText('Second Link')).toBeInTheDocument();
    });

    it('should handle links without target property', () => {
      const linksWithoutTarget = [
        {
          title: 'Link Without Target',
          href: '/no-target',
        },
      ];

      const propsWithoutTarget = {
        ...defaultProps,
        links: linksWithoutTarget,
      };

      render(<LinkList {...propsWithoutTarget} />);

      const link = screen.getByText('Link Without Target').closest('a');
      expect(link).not.toHaveAttribute('target');
    });
  });

  describe('Key generation', () => {
    it('should generate unique keys for list items', () => {
      // This is more of an implementation detail, but we can test
      // that duplicate titles with different hrefs are handled correctly
      const duplicateTitleLinks = [
        {
          title: 'Same Title',
          href: '/first-path',
        },
        {
          title: 'Same Title',
          href: '/second-path',
        },
      ];

      const propsWithDuplicates = {
        ...defaultProps,
        links: duplicateTitleLinks,
      };

      render(<LinkList {...propsWithDuplicates} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);

      const links = screen.getAllByText('Same Title');
      expect(links).toHaveLength(2);
      expect(links[0].closest('a')).toHaveAttribute('href', '/first-path');
      expect(links[1].closest('a')).toHaveAttribute('href', '/second-path');
    });
  });
});
