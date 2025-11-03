import { KeyInfo } from 'components/KeyInfo';
import { twMerge } from 'tailwind-merge';
import { DocumentTemplate, Tag } from 'types/@adobe/page';

import { Heading, Link } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { DocumentSections } from '../../components/DocumentSections';
import { getSectionData } from '../../utils/getSectionData';

type Props = {
  page: DocumentTemplate;
};

export const DocumentLayout = ({ page }: Props) => {
  const sectionData = getSectionData(page.sections);
  const { z } = useTranslation();

  const links = sectionData?.map((section) => {
    return {
      linkTo: `#${section?.header?.id}`,
      text: section?.header?.text,
    };
  });

  return (
    <Container className="max-w-[1272px]">
      <div className={twMerge(['mt-6 flex flex-col lg:flex-row lg:gap-16'])}>
        <div className="pb-16 basis-2/3">
          <Heading
            level={'h1'}
            className="my-6 text-blue-700 max-w-[812px]"
            data-testid="main-heading"
          >
            {page?.title}
          </Heading>

          <aside
            className="border-l-8 border-teal-400 py-4 pl-6 pr-0 mb-14"
            data-testid="evidence-type"
          >
            Evidence type:{' '}
            <span className="text-magenta-500" data-testid="evidence-type-data">
              {page.pageType?.name}
            </span>
            <ul className="flex m-0 p-0">
              {page.dataType?.map((type, index) => (
                <li key={type.key} className="pr-2">
                  {type.name}
                  {index < (page?.dataType as Tag[])?.length - 1 && ','}
                </li>
              ))}
            </ul>
          </aside>

          {links && (
            <>
              <p className="mb-5 font-bold">
                {z({ en: 'On this page', cy: 'Ar y dudalen hon' })}
              </p>
              <ul
                className={twMerge(['list-none border-t-1 border-slate-400'])}
              >
                {links?.map(({ linkTo, text }) => (
                  <li key={text} className="border-b-1 border-slate-400">
                    <Link
                      href={linkTo}
                      className={twMerge([
                        'no-underline text-magenta-500 py-[6px] w-full',
                      ])}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <DocumentSections sections={sectionData} />
        </div>
        <div className="mb-16 md:w-1/3">
          <KeyInfo page={page} />
        </div>
      </div>
    </Container>
  );
};
