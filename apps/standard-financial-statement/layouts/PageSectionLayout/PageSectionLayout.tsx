import { twMerge } from 'tailwind-merge';
import { PageSectionTemplate } from 'types/@adobe/page';

import { H1, Link } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';

import { BackToTop } from '../../components/BackToTop';
import { SectionPageWithLinks } from '../../components/SectionPageWithLinks';
import { SideNavigation } from '../../components/SideNavigation';

type Props = {
  page: PageSectionTemplate;
  slug: string[];
  lang: string;
  url: string;
};

function formatSectionData(page: PageSectionTemplate) {
  return {
    ...page,
    sections: page.section?.map((section) => {
      const header = section.json?.find(
        (json) => json?.nodeType === 'header' && json.style === 'h2',
      );
      const headingText = header?.content
        ?.map((content) => content?.value)
        ?.join(' ');
      return {
        header: {
          text: headingText ?? '',
          id: headingText?.replace(/\s/g, '') ?? '',
        },
        json:
          section?.json?.filter(
            (json) => !(json?.nodeType === 'header' && json?.style === 'h2'),
          ) || [],
      };
    }),
  };
}

export const PageSectionLayout = ({ page, lang, slug, url }: Props) => {
  const hasSideNav = page?.sideNavigationLinks?.length > 0;
  const data = formatSectionData(page);

  const links = data.sections?.map((section) => {
    return {
      linkTo: `#${section?.header?.id}`,
      text: section?.header?.text,
    };
  });
  const showDecimalList = links.some((l) => l.text.includes('.'));

  return (
    <Container className="max-w-[1272px]">
      <div
        className={twMerge([
          'mt-8 lg:mt-16 flex flex-col lg:flex-row lg:gap-16',
        ])}
      >
        {hasSideNav && (
          <SideNavigation
            slug={slug}
            language={lang}
            links={page.sideNavigationLinks}
          ></SideNavigation>
        )}
        <div className="pb-16 basis-2/3">
          <H1>{page?.title}</H1>

          {links && (
            <ul
              className={twMerge(
                ['mt-8'],
                showDecimalList ? ['list-decimal pl-8 font-bold'] : [],
              )}
            >
              {links?.map(({ linkTo, text }) => (
                <li key={text} className="mb-4">
                  <Link
                    href={linkTo}
                    className={twMerge([
                      'text-magenta-700',
                      'font-bold',
                      'visited:text-magenta-700',
                    ])}
                  >
                    {showDecimalList ? text.split('.')[1] : text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <SectionPageWithLinks sections={data.sections} />
          <BackToTop url={url} />
        </div>
      </div>
    </Container>
  );
};
