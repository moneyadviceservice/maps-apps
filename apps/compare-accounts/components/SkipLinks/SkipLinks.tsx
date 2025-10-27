import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type SkipLink = {
  focusID: string;
  label: string;
  testID: string;
};

export type Links = SkipLink[];

export type Props = {
  readonly skipLinks?: Links;
};

/**
 * NOTE: This component only shows when using keyboard navigation (use Tab to iterate through links)
 */
const SkipLinks = ({ skipLinks }: Props) => {
  const { z } = useTranslation();

  const containerStyles =
    'sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-1 focus-within:left-1 focus-within:z-20';
  const buttonStyles =
    'relative outline-none font-bold text-sm p-3 pr-6 pl-6 rounded bg-magenta-500 text-white shadow-bottom-gray mr-2 top-1';
  const focusStyles =
    'focus:text-gray-800 focus:bg-yellow-400 focus:border-b-purple-800 focus:border-b-4';
  const hoverStyles = 'hover:bg-white hover:border-none hover:text-blue-700';

  const links = skipLinks || [
    {
      focusID: 'main',
      label: z({ en: 'Skip to content', cy: 'Neidio at y cynnwys' }),
      testID: 'skip-to-content-link',
    },
  ];

  return (
    <div className={containerStyles}>
      {links.map((skipLink, i) => {
        return (
          <a
            key={i}
            className={twMerge(buttonStyles, focusStyles, hoverStyles)}
            href={`#${skipLink.focusID}`}
            data-testid={skipLink.testID}
          >
            {skipLink.label}
          </a>
        );
      })}
    </div>
  );
};

export default SkipLinks;
