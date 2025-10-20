import { ReactNode } from 'react';

import { DocumentTemplate, Tag } from 'types/@adobe/page';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/index';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import {
  JsonRichText,
  mapJsonRichText,
} from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

interface Props {
  title: string;
  tags?: Tag[];
  children?: ReactNode | JsonRichText;
}

const TagList = ({ title, tags, children }: Props) => (
  <div className="mb-4">
    <span className="font-bold block">{title}</span>
    {tags && tags.length > 0 && (
      <ul className="list-disc pl-8">
        {tags.map((tag) => (
          <li key={tag.key}>{tag.name}</li>
        ))}
      </ul>
    )}
    {children && <>{children}</>}
  </div>
);

export const KeyInfo = ({ page }: { page: DocumentTemplate }) => (
  <aside className="md:pl-20" data-testid="key-info">
    <Heading
      level={'h4'}
      component={'h2'}
      className="mb-4"
      data-testid="heading"
    >
      Key Info
    </Heading>
    {page.clientGroup?.length > 0 && (
      <TagList title="Client Group" tags={page.clientGroup} />
    )}
    {page.topic?.length > 0 && <TagList title="Topics" tags={page.topic} />}
    {page?.countryOfDelivery?.length > 0 && (
      <TagList title="Country/Countries" tags={page.countryOfDelivery} />
    )}
    {page?.publishDate && (
      <TagList title="Year of publication">
        <p suppressHydrationWarning>
          {new Date(page?.publishDate).getFullYear()}
        </p>
      </TagList>
    )}
    {page?.lastUpdatedDate && (
      <TagList title="Year of last update">
        <p suppressHydrationWarning>
          {new Date(page?.lastUpdatedDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </TagList>
    )}
    {page.links?.length > 0 && (
      <TagList title="Links to other information">
        <ul>
          {page.links.map((link) => (
            <li key={link.text}>
              <Link href={link.linkTo}>{link.text}</Link>
            </li>
          ))}
        </ul>
      </TagList>
    )}
    {page.contactInformation?.json && (
      <TagList title="Contact information">
        <RichTextAem>
          {mapJsonRichText(page.contactInformation.json)}
        </RichTextAem>
      </TagList>
    )}
  </aside>
);
