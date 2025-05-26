/* eslint-disable @typescript-eslint/no-explicit-any */
import { Children } from 'react';
import { useRemarkSync } from 'react-remark';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type MarkdownProps = {
  content: string;
  className?: string;
};

export const Markdown = ({ content, className }: MarkdownProps) => {
  const reactContent = useRemarkSync(content, {
    rehypeReactOptions: {
      components: {
        p: (props: React.HTMLProps<HTMLDivElement>) => (
          <Paragraph {...props} className={className}>
            {props.children}
          </Paragraph>
        ),
        a: (props: any) => {
          const children = Children.toArray(props.children);
          const internalLink = children.some(
            (child) =>
              typeof child === 'string' && child.includes('_target=_self'),
          );

          const linkContent = children.map((child) =>
            typeof child === 'string'
              ? child.replace(/_target=_self/g, '')
              : child,
          );

          return (
            <Link
              {...props}
              className={className}
              target={internalLink ? '_self' : '_blank'}
              rel="noopener noreferrer"
              asInlineText
            >
              {linkContent}
            </Link>
          );
        },
      },
    },
  });
  return reactContent;
};
