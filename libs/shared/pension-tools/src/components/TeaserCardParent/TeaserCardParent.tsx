import { twMerge } from 'tailwind-merge';

import { Heading, Level } from '@maps-react/common/components/Heading';
import {
  TeaserCard,
  TeaserCardProps,
} from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer/TeaserCardContainer';

export interface TeaserCardParentProps {
  heading: string;
  items: TeaserCardProps[];
  target: string;
  headingClasses?: string;
  teaserHeadingLevel?: Level;
}

export const TeaserCardParent = ({
  heading,
  items,
  target,
  headingClasses,
  teaserHeadingLevel,
}: TeaserCardParentProps) => (
  <>
    <Heading
      level="h1"
      component="h2"
      className={twMerge('my-6', headingClasses)}
    >
      {heading}
    </Heading>
    <TeaserCardContainer gridCols={2}>
      {items.map(({ title, description, href, image }, index) => (
        <TeaserCard
          key={`${title.replace(' ', '-')}${index}`}
          title={title}
          href={href}
          image={image}
          description={description}
          imageClassName="md:max-h-[200px]"
          hrefTarget={target}
          headingLevel={teaserHeadingLevel}
        />
      ))}
    </TeaserCardContainer>
  </>
);
