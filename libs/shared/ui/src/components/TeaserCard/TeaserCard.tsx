import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import NextLink from 'next/link';

import { twMerge } from 'tailwind-merge';

import { Heading, Level } from '../Heading';

export type TeaserCardProps = {
  title: string;
  description: string;
  href: string;
  image?: StaticImageData;
  headingLevel?: Level;
  imageClassName?: string;
  hrefTarget?: string;
  className?: string;
};

const defaultClasses = [
  't-teaser flex flex-col outline outline-1 outline-slate-400 shadow-bottom-gray rounded md:rounded-none md:rounded-bl-[36px] md:shadow-none overflow-hidden text-pink-600 bg-white',
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
  className,
}: TeaserCardProps) => {
  return (
    <NextLink
      href={href}
      target={hrefTarget}
      className={twMerge(
        defaultClasses,
        hoverClasses,
        focusClasses,
        activeClasses,
        className,
      )}
      data-testid="teaserCard"
    >
      {image && (
        <Image
          src={image}
          className={twMerge('object-cover h-full w-full', imageClassName)}
          alt=""
        />
      )}
      <div className="p-5 space-y-3 group">
        <Heading
          level={headingLevel}
          className={'text-xl font-bold text-inherit'}
        >
          {title}
        </Heading>
        <p className="inline-block w-full text-base text-gray-800 no-underline">
          {description}
        </p>
      </div>
    </NextLink>
  );
};
