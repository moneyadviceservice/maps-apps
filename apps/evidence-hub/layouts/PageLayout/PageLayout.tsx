import { twMerge } from 'tailwind-merge';
import { PageTemplate } from 'types/@adobe/page';

import { Heading } from '@maps-react/common/index';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { DocumentSections } from '../../components/DocumentSections';
import { getSectionData } from '../../utils/getSectionData';

type Props = {
  page: PageTemplate;
};

export const PageLayout = ({ page }: Props) => {
  const sectionData = getSectionData(page.sections);
  const { z } = useTranslation();

  const links = sectionData
    ?.map((section) => {
      return {
        linkTo: `#${section?.header?.id}`,
        text: section?.header?.text,
      };
    })
    .filter((link) => link.text && link.text.trim() !== '');

  const overview = page.overview?.json?.map((s) => mapJsonRichText([s]));

  return (
    <div className={twMerge(['mt-6 flex flex-col lg:flex-row lg:gap-16'])}>
      <div className="pb-16 basis-2/3">
        <Heading
          level={'h1'}
          className="mb-6 text-blue-700 max-w-[812px]"
          data-testid="main-heading"
        >
          {page?.title || page?.seoTitle}
        </Heading>

        {page?.overview && (
          <div
            className="pt-4 pb-2 pl-6 pr-0 mb-8 border-l-8 border-teal-400"
            data-testid="page-description"
          >
            <div className="text-2xl">{overview}</div>
          </div>
        )}

        {links?.length > 0 && (
          <>
            <p className="mb-5 font-bold">
              {z({ en: 'On this page', cy: 'Ar y dudalen hon' })}
            </p>
            <ul className={twMerge(['list-none border-t-1 border-slate-400'])}>
              {links?.map(({ linkTo, text }) => (
                <li key={text} className="border-b-1 border-slate-400">
                  <a
                    href={linkTo}
                    className={twMerge([
                      'no-underline text-magenta-500 py-[6px] w-full block',
                    ])}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
        <DocumentSections sections={sectionData} />
      </div>
    </div>
  );
};
