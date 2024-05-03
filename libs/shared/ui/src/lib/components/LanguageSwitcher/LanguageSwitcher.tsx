import { NextRouter, useRouter } from 'next/router';
import { useTranslation } from '@maps-digital/shared/hooks';
import { Link } from '../../components/Link';

const LanguageLink = ({ router }: { router: NextRouter }) => {
  const { z } = useTranslation();
  const afterClasses =
    "after:content-[''] after:inline-block after:absolute after:-bottom-1 after:left-0 after:bg-white after:w-full after:h-[1px]";

  return (
    <Link
      href={{
        query: {
          ...router?.query,
          language: z({ en: 'cy', cy: 'en' }),
        },
      }}
      lang={z({ en: 'cy', cy: 'en' })}
      hrefLang={z({ en: 'cy', cy: 'en' })}
      rel="alternate"
      variant="whiteText"
      className={`group underline hover:text-white p-2 px-4`}
    >
      <span className="sr-only">
        {z({
          en: 'Newid yr iaith ir Gymraeg',
          cy: 'Change the language to English',
        })}
      </span>
      <span
        aria-hidden="true"
        className={`inline-block relative ${afterClasses} group-hover:after:h-[2px] `}
      >
        {z({
          en: 'Cymraeg',
          cy: 'English',
        })}
      </span>
    </Link>
  );
};

const LanguageSpan = () => {
  const { z } = useTranslation();

  return (
    <span className="text-white p-2 px-4" aria-current="true">
      {z({ en: 'English', cy: 'Cymraeg' })}
    </span>
  );
};

export type LanguageSwitcherProps = {
  testId?: string;
};

export const LanguageSwitcher = ({ testId }: LanguageSwitcherProps) => {
  const { z } = useTranslation();
  const router = useRouter();
  const afterClasses =
    "after:content-[''] after:inline-block after:h-6 after:relative after:top-2 after:border-white after:border-r-1";

  return (
    <nav
      className="hidden md:block absolute right-[70px]"
      data-testid={testId}
      aria-label="Language switcher"
    >
      <ul>
        <li className={`inline-block ${afterClasses}`}>
          {z({
            en: <LanguageSpan />,
            cy: <LanguageLink router={router} />,
          })}
        </li>
        <li className="inline-block">
          {z({
            en: <LanguageLink router={router} />,
            cy: <LanguageSpan />,
          })}
        </li>
      </ul>
    </nav>
  );
};
