import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import NextLink from 'next/link';

import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Heading, Level } from '../Heading';
import { inlineLinkClasses } from '../Link';

export type TeaserCardProps = {
  title: string;
  description: string;
  href: string;
  image?: StaticImageData;
  headingLevel?: Level;
  headingComponent?: React.ElementType;
  imageClassName?: string;
  hrefTarget?: string;
  className?: string;
};

const cardClasses = [
  't-teaser relative flex flex-col outline outline-1 outline-slate-400 shadow-bottom-gray rounded md:rounded-none md:rounded-bl-[36px] md:shadow-none overflow-hidden bg-white',
];

const headingLinkClasses = [...inlineLinkClasses];

const nonInteractiveCardContentClasses = ['pointer-events-none'];

export const TeaserCard = ({
  title,
  description,
  href,
  image,
  headingLevel = 'h5',
  headingComponent,
  imageClassName,
  hrefTarget = '_top',
  className,
}: TeaserCardProps) => {
  const { z } = useTranslation();
  const opensInNewWindow = hrefTarget === '_blank';
  const opensInNewWindowText = z({
    en: ' (opens in a new window)',
    cy: ' (yn agor mewn ffenestr newydd)',
  });

  return (
    <div className={twMerge(cardClasses, className)} data-testid="teaserCard">
      {image && (
        <Image
          src={image}
          className={twMerge(
            'object-cover h-full w-full',
            nonInteractiveCardContentClasses,
            imageClassName,
          )}
          alt=""
        />
      )}
      <div className="p-5 space-y-3">
        <Heading
          level={headingLevel}
          component={headingComponent}
          className="text-xl font-bold"
        >
          <NextLink
            href={href}
            target={hrefTarget}
            className={twMerge(headingLinkClasses)}
          >
            {title}
            {opensInNewWindow && (
              <span className="sr-only">{opensInNewWindowText}</span>
            )}
          </NextLink>
        </Heading>
        <p
          className={twMerge(
            'inline-block w-full text-base text-gray-800 no-underline',
            nonInteractiveCardContentClasses,
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
