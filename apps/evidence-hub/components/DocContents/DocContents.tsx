import { PropsWithChildren } from 'react';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';

type ListLinkProps = {
  href: string;
} & PropsWithChildren;

const ListLink = ({ href, children }: ListLinkProps) => (
  <li className={'border-b-1 border-slate-400'}>
    <Link href={href} className="no-underline text-magenta-500 py-[6px] w-full">
      {children}
    </Link>
  </li>
);

export const DocContents = () => (
  <div className="mb-10">
    <Heading level={'h5'} component="h3" className="mb-6">
      On this page
    </Heading>
    <nav data-testid="doc-contents">
      <ul className="list-none border-t-1 border-slate-400">
        <ListLink href="#context">Context</ListLink>
        <ListLink href="#the-study">The study</ListLink>
        <ListLink href="#key-findings">Key findings</ListLink>
        <ListLink href="#points-to-consider">Points to consider</ListLink>
      </ul>
    </nav>
  </div>
);
