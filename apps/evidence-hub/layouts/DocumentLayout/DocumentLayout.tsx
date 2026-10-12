import { KeyInfo } from 'components/KeyInfo';
import { twMerge } from 'tailwind-merge';
import { DocumentTemplate } from 'types/@adobe/page';

import { Heading, Link } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';

import { DocumentSections } from '../../components/DocumentSections';
import { getSectionData } from '../../utils/getSectionData';

type Props = {
  page: DocumentTemplate;
};

export const DocumentLayout = ({ page }: Props) => {
  const sectionData = getSectionData(page.sections);

  const links = sectionData?.map((section) => {
    return {
      linkTo: `#${section?.header?.id}`,
      text: section?.header?.text,
    };
  });

  return (
    <Container className="max-w-[1200px] p-0">
      <div className={twMerge(['mt-6 pb-16'])}>
        <div className="flex flex-col lg:flex-row">
          <div className="basis-2/3">
            <Heading
              level={'h1'}
              className="mb-6 text-blue-700 max-w-[812px]"
              data-testid="main-heading"
            >
              {page?.title}
            </Heading>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="basis-2/3">
            {links && (
              <>
                <Heading level={'h6'} component="h2" className="mb-5">
                  On this page
                </Heading>
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
          <div className="mb-16 lg:w-1/3">
            <KeyInfo page={page} />
          </div>
        </div>
      </div>
    </Container>
  );
};
