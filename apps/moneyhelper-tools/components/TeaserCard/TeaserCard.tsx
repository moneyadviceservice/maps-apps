import NextLink from 'next/link';
import Image from 'next/image';
import { Heading, Level } from '@maps-digital/shared/ui';
import type { StaticImageData } from 'next/image';
import classNames from 'classnames';

export type TeaserCardProps = {
  title: string;
  description: string;
  href: string;
  image?: StaticImageData;
  headingLevel?: Level;
  imageClassName?: string;
  hrefTarget?: string;
};

const defaultClasses = [
  't-teaser rounded-bl-3xl flex flex-col outline outline-1 outline-slate-400 rounded overflow-hidden shadow-bottom-gray text-pink-600',
];
const hoverClasses = [
  'hover:outline-pink-800 hover:text-pink-800 hover:decoration-pink-800 hover:underline',
];

const focusClasses = [
  'focus:bg-yellow-200',
  'focus:shadow-none',
  'focus:!text-gray-800',
  'focus:!no-underline',
  'focus:outline',
  'focus:!outline-purple-800',
  'focus:outline-[4px]',
  'focus:outline-offset-0',
  'focus:shadow-none',
];

const activeClasses = [
  'active:bg-gray-200',
  'active:shadow-none',
  'active:text-gray-800',
  'active:no-underline',
  'active:outline',
  'active:outline-purple-800',
  'active:shadow-none',
  'active:outline-[4px]',
  'active:outline-offset-0',
];

export const TeaserCard = ({
  title,
  description,
  href,
  image,
  headingLevel = 'h5',
  imageClassName,
  hrefTarget = '_top',
}: TeaserCardProps) => {
  return (
    <NextLink
      href={href}
      target={hrefTarget}
      className={classNames(
        defaultClasses,
        hoverClasses,
        focusClasses,
        activeClasses,
      )}
      data-testid="teaserCard"
    >
      {image && (
        <Image
          src={image}
          className={classNames('object-cover h-full w-full', imageClassName)}
          alt=""
        />
      )}
      <div className="p-4 space-y-3 group">
        <Heading
          level={headingLevel}
          className={'text-xl font-bold text-inherit'}
        >
          {title}
        </Heading>
        <p className="text-base text-gray-800 inline-block w-full no-underline">
          {description}
        </p>
      </div>
    </NextLink>
  );
};
