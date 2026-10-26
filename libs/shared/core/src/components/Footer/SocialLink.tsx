import React from 'react';

import { twMerge } from 'tailwind-merge';

interface SocialLinkProps {
  href: string;
  ariaLabel: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

const socialLinkClasses = [
  'group flex w-full items-center justify-center rounded-md border border-gray-400 px-4 py-2',
  'cursor-pointer no-underline outline-none',
  'hover:border-pink-400',
  'active:border-yellow-400',
  'focus-visible:border-purple-500 focus-visible:bg-yellow-400',
  'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-500',
];

const iconClasses = [
  'fill-white [&_path]:fill-white',
  'group-hover:fill-pink-400 group-hover:[&_path]:fill-pink-400',
  'group-active:fill-yellow-400 group-active:[&_path]:fill-yellow-400',
  'group-focus-visible:fill-gray-800 group-focus-visible:[&_path]:fill-gray-800',
];

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  ariaLabel,
  Icon,
  className,
}) => {
  return (
    <a
      className={twMerge(socialLinkClasses, className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      <Icon className={twMerge(iconClasses)} aria-hidden />
    </a>
  );
};

export default SocialLink;
