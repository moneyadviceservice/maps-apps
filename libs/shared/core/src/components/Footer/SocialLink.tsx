import React from 'react';

import { Link } from '@maps-react/common/components/Link';

interface SocialLinkProps {
  href: string;
  ariaLabel: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  ariaLabel,
  Icon,
  className,
}) => {
  return (
    <Link
      className={`w-full items-center justify-center text-center border border-gray-400 rounded-md px-4 py-2 hover:border-pink-400 cursor-pointer ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      withIcon={false}
    >
      <Icon className="fill-white group-hover:fill-pink-400" />
    </Link>
  );
};

export default SocialLink;
