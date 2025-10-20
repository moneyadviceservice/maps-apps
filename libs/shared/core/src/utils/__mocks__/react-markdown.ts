import React from 'react';

interface ReactMarkdownProps {
  children: string;
  components?: {
    a?: (props: { href: string; children: string }) => React.ReactElement;
  };
}

const ReactMarkdown: React.FC<ReactMarkdownProps> = ({
  children,
  components,
}) => {
  let content = children;

  // Handle bold text
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Handle links
  if (components?.a) {
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      const props = { href, children: text };
      const element = components.a?.(props);
      if (React.isValidElement(element)) {
        const elementProps = element.props as { className?: string };
        return `<a href="${href}" class="${
          elementProps.className || ''
        }">${text}</a>`;
      }
      return `<a href="${href}">${text}</a>`;
    });
  } else {
    content = content.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>',
    );
  }

  return React.createElement('div', {
    'data-testid': 'react-markdown',
    dangerouslySetInnerHTML: { __html: content },
  });
};

export default ReactMarkdown;
