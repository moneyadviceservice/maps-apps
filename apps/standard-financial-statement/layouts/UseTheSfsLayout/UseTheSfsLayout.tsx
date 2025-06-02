import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { UseTheSfsPageTemplate } from 'types/@adobe/page';
import { AssetBlob } from 'utils/getBlob/getBlob';

import { H1 } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { BackToTop } from '../../components/BackToTop';
import { DownloadLinks } from '../../components/DownloadLinks';
import { RichTextWrapper } from '../../components/RichTextWrapper';
import { SideNavigation } from '../../components/SideNavigation';

type Props = {
  page: UseTheSfsPageTemplate;
  slug: string[];
  lang: string;
  url: string;
  auth?: boolean;
  assetBlob?: AssetBlob[];
} & PropsWithChildren;

const classNamesRichText = [
  '[&_table]:border-0',
  '[&_table]:border-t-1',
  '[&_table>tbody>tr>td]:border-r-0',
  '[&_table>tbody>tr>th]:text-gray-800',
  '[&_table>tbody>tr>th]:font-normal',
  '[&_table>tbody>tr:nth-child(even)]:bg-gray-300',
  '[&_table>tbody>tr>th]:bg-inherit',
  '[&_table>tbody>tr>th]:border-r-0',
  '[&_table>tbody>tr]:border-r-0',
];

export const UseTheSfsLayout = ({
  page,
  lang,
  slug,
  url,
  auth = false,
  assetBlob,
  children,
}: Props) => {
  const hasSideNav = page?.navigationGroup?.length > 0;
  return (
    <Container className="max-w-[1272px]">
      <div
        className={twMerge([
          'mt-8 lg:mt-16 flex flex-col lg:flex-row lg:gap-16',
        ])}
      >
        {hasSideNav && (
          <SideNavigation
            isNavGroup={true}
            slug={slug}
            language={lang}
            links={page.navigationGroup}
          />
        )}
        <div className="pb-16 basis-2/3">
          <H1>{page?.title}</H1>
          {auth && (
            <div className="mt-6 lg:mt-10">
              {page.introText?.json && (
                <div className="mb-6">
                  <RichTextWrapper className="-mb-6 text-xl lg:text-2xl">
                    {mapJsonRichText(page.introText.json)}
                  </RichTextWrapper>
                  dd
                </div>
              )}
              <RichTextWrapper className={twMerge(classNamesRichText)}>
                {page.content.map((p) => mapJsonRichText(p.json))}
              </RichTextWrapper>
            </div>
          )}

          {!auth && page?.loginMessage?.loginIntro?.json && (
            <div className="mt-8">
              <RichTextWrapper>
                {mapJsonRichText(page?.loginMessage?.loginIntro.json)}
              </RichTextWrapper>
            </div>
          )}

          {children}

          {auth && assetBlob && (
            <DownloadLinks
              downloads={assetBlob
                .filter((asset) => asset.name.includes(`${lang}/`))
                .map((asset) => ({
                  fileName: asset.displayName?.replace(`${lang}/`, ''),
                  asset: {
                    size: asset.size,
                    _path: asset.url,
                    type: asset.contentType,
                  },
                }))}
              assetPath={'/api/download'}
            />
          )}

          <BackToTop url={url} containerClasses="mt-8" />
        </div>
      </div>
    </Container>
  );
};
