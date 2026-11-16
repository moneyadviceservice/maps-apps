import { twMerge } from 'tailwind-merge';
import useTranslation from '@maps-react/hooks/useTranslation';

import { H2, Heading, Link, Paragraph } from '@maps-react/common/index';

export const getErrorPageContent = (
  lang: string,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return (
    <div className={twMerge('lg:max-w-[840px] space-y-8 pt-8 lg:pt-16')}>
      <Heading>
        {z({
          en: "Sorry, we couldn't find the page you're looking for",
          cy: "Mae'n ddrwg gennym, nid oeddem yn gallu ddod o hyd i'r dudalen rydych yn chwilio amdani",
        })}
      </Heading>
      <Paragraph>
        {z({
          en: 'It may no longer exist, or the link contained an error.',
          cy: "Efallai nad yw'n bodoli mwyach, neu roedd y ddolen yn cynnwys gwall.",
        })}
      </Paragraph>
      <H2>
        {z({
          en: 'What you can do',
          cy: 'Yr hyn y gallwch ei wneud',
        })}
      </H2>
      <ul className="pl-8 space-y-2 list-disc">
        <li>
          {z({
            en: 'Look for the page via the',
            cy: "Chwiliwch am y dudalen drwy'r",
          })}{' '}
          <Link
            href={`/${lang}`}
            className="text-magenta-800 text-[18px] font-bold"
          >
            {z({
              en: 'homepage',
              cy: 'Hafan',
            })}
          </Link>
        </li>
        <li>
          {z({
            en: 'Visit our',
            cy: 'Ewch i',
          })}{' '}
          <Link
            href={`/${lang}/research-library`}
            className="text-magenta-800 text-[18px] font-bold"
          >
            {z({
              en: 'research library',
              cy: 'llyfrgell ymchwil',
            })}
          </Link>
        </li>
        <li>
          {z({
            en: 'Use the search form in the header of the website',
            cy: 'Defnyddiwch y ffurflen chwilio ar bennawd y wefan',
          })}
        </li>
      </ul>
    </div>
  );
};
