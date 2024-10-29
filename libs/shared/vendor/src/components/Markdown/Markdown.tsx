/* eslint-disable @typescript-eslint/no-explicit-any */
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
        a: (props: any) => (
          <Link
            {...props}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
            asInlineText
          >
            {props.children}
          </Link>
        ),
      },
    },
  });
  return reactContent;
};
