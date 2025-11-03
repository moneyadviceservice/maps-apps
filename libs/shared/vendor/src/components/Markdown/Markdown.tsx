/* eslint-disable @typescript-eslint/no-explicit-any */
import { Children } from 'react';
import { useRemarkSync } from 'react-remark';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Tooltip } from '@maps-react/common/components/Tooltip';

type MarkdownProps = {
  content: string;
  className?: string;
  testId?: string;
  disableParagraphs?: boolean;
};

export const Markdown = ({
  content,
  disableParagraphs,
  className,
  testId,
}: MarkdownProps) => {
  const reactContent = useRemarkSync(content, {
    rehypeReactOptions: {
      components: {
        ...(disableParagraphs
          ? {
              p: (props: React.HTMLProps<HTMLDivElement>) => (
                <span {...props} className={className} data-testid={testId}>
                  {props.children}
                </span>
              ),
            }
          : {
              p: (props: React.HTMLProps<HTMLDivElement>) => (
                <Paragraph {...props} className={className} testId={testId}>
                  {props.children}
                </Paragraph>
              ),
            }),
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
        code: (props: any) => {
          const [prefix, markdown, center] = (props.children?.[0] ?? '').split(
            '::',
          );

          if (prefix === 'tooltip') {
            const tooltipProps =
              center === 'center' ? { centerArrow: true } : {};
            return (
              <Tooltip {...tooltipProps}>
                <Markdown content={markdown} disableParagraphs />
              </Tooltip>
            );
          }

          return <code {...props} />;
        },
      },
    },
  });

  return reactContent;
};
