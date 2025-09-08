import { twMerge } from 'tailwind-merge';
import { PageTemplate } from 'types/@adobe/page';

import { H1, H2 } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import { EmbeddedTool } from '@maps-react/core/components/EmbeddedTool';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { mapJsonRichText, Node } from '@maps-react/vendor/utils/RenderRichText';

// Helper function to extract text content from a node for ID generation
const extractTextContent = (node: Node): string => {
  if (node.value) {
    return node.value;
  }
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextContent).join('');
  }
  return '';
};

// Helper function to generate a URL-friendly ID from text
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

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
  topInfo?: React.ReactNode;
};

export const PageLayout = ({
  assetPath,
  page,
  lang,
  slug,
  url,
  children,
  topInfo,
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
            links={page.sideNavigationLinks?.map((link) => ({
              ...link,
              isEmbedded: true,
            }))}
          />
        )}
        <div className="pb-16 basis-2/3">
          <H1>{page?.title}</H1>
          {topInfo}
          <div className="mt-6 lg:mt-10">
            {page.introText?.json && (
              <div className="mb-6 text-xl lg:text-2xl lg:mb-10">
                {mapJsonRichText(page.introText.json)}
              </div>
            )}

            <RichTextWrapper>
              {page.content?.map((p, index) => {
                return p.json?.map((node, nodeIndex) => {
                  // Check if this is a header node
                  if (node.nodeType === 'header' && node.style === 'h2') {
                    const headerText = extractTextContent(node);
                    const headerId = generateId(headerText);

                    return (
                      <H2
                        key={`${index}-${nodeIndex}`}
                        level="h2"
                        className="mt-10 mb-4"
                        id={headerId}
                      >
                        {headerText}
                      </H2>
                    );
                  }

                  // For non-header content, render normally
                  return mapJsonRichText([node]);
                });
              })}
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
