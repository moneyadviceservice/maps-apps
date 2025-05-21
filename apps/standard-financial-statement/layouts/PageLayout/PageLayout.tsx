import { twMerge } from 'tailwind-merge';
import { PageTemplate } from 'types/@adobe/page';

import { H1 } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import { EmbeddedTool } from '@maps-react/core/components/EmbeddedTool';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { BackToTop } from '../../components/BackToTop';
import { DownloadLinks } from '../../components/DownloadLinks';
import { ImageLinkGroup } from '../../components/ImageLinkGroup';
import { RichTextWrapper } from '../../components/RichTextWrapper';
import { SideNavigation } from '../../components/SideNavigation';

type Props = {
  assetPath: string;
  page: PageTemplate;
  slug: string[];
  lang: string;
  url: string;
  children?: React.ReactNode;
};

export const PageLayout = ({
  assetPath,
  page,
  lang,
  slug,
  url,
  children,
}: Props) => {
  const hasSideNav = page?.sideNavigationLinks?.length > 0;

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
            links={page.sideNavigationLinks.map((link) => ({
              ...link,
              isEmbedded: true,
            }))}
          />
        )}
        <div className="pb-16 basis-2/3">
          <H1>{page?.title}</H1>
          <div className="mt-6 lg:mt-10">
            {page.introText?.json && (
              <div className="mb-6 text-xl lg:text-2xl lg:mb-10">
                {mapJsonRichText(page.introText.json)}
              </div>
            )}
            <RichTextWrapper>
              {page.content.map((p) => mapJsonRichText(p.json))}
            </RichTextWrapper>
          </div>

          {page.governanceList?.length > 0 && (
            <ImageLinkGroup
              title={page.governanceTitle ?? ''}
              assetPath={assetPath}
              org={page.governanceList}
            />
          )}
          {page.embed && (
            <EmbedPageLayout>
              <EmbeddedTool toolData={page.embed} classes="mt-12" />
            </EmbedPageLayout>
          )}

          {children}

          {page.downloads?.length > 0 && (
            <DownloadLinks downloads={page.downloads} assetPath={assetPath} />
          )}

          <BackToTop url={url} />
        </div>
      </div>
    </Container>
  );
};
