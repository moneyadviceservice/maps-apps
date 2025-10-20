import { PropsWithChildren, useEffect, useState } from 'react';

import CalloutMessage from 'components/CalloutMessage/CalloutMessage';
import { CalloutNoJs } from 'components/ToggleFormProvider';
import { twMerge } from 'tailwind-merge';
import { UseTheSfsPageTemplate } from 'types/@adobe/page';
import { AssetBlob } from 'utils/getBlob/getBlob';

import { H1, H2, Link, Paragraph } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';
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
  orgActive?: boolean;
  assetBlob?: AssetBlob[];
} & PropsWithChildren;

const classNamesRichText = [
  '[&_table]:border-0',
  '[&_table]:border-t-1',
  '[&_table>tbody>tr>td]:border-r-0',
  '[&_table>tbody>tr>th]:text-gray-800',
  '[&_table>tbody>tr>th]:font-normal',
  '[&_table>tbody>tr:nth-child(even)]:bg-gray-150',
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
  orgActive = false,
  assetBlob,
  children,
}: Props) => {
  const [jsEnabled, setJsEnabled] = useState(false);
  const hasSideNav = page?.navigationGroup?.length > 0;

  useEffect(() => {
    setJsEnabled(true);
  }, []);

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

          {auth && !orgActive && <CalloutNotApproved />}

          {auth && orgActive && (
            <div className="mt-6 lg:mt-10">
              {page.introText?.json && (
                <div className="mb-6">
                  <RichTextWrapper className="-mb-6 text-xl lg:text-2xl">
                    {mapJsonRichText(page.introText.json)}
                  </RichTextWrapper>
                </div>
              )}
              <RichTextWrapper className={twMerge(classNamesRichText)}>
                {page.content.map((p) => mapJsonRichText(p.json))}
              </RichTextWrapper>
            </div>
          )}

          {!auth && jsEnabled && page?.loginMessage?.loginIntro?.json && (
            <div className="mt-8">
              <RichTextWrapper>
                {mapJsonRichText(page?.loginMessage?.loginIntro.json)}
              </RichTextWrapper>
            </div>
          )}

          {!auth && !jsEnabled && <CalloutNoJs />}

          {children}

          {auth && orgActive && assetBlob && (
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

const CalloutNotApproved = () => {
  const { z } = useTranslation();

  return (
    <CalloutMessage>
      <H2 className="mb-4 md:text-4xl">
        {z({
          en: 'Your application is pending approval',
          cy: 'Mae eich cais yn aros am gymeradwyaeth',
        })}
      </H2>

      <Paragraph>
        {z({
          en: 'Your application is currently under review and is pending approval. This process typically takes around 10 working days. Once your application is approved, you will be able to log in and view this content. We appreciate your patience and understanding during this time.',
          cy: `Ar hyn o bryd mae eich cais yn cael ei adolygu ac yn aros am gymeradwyaeth. Mae'r broses hon fel arfer yn cymryd tua 10 diwrnod gwaith. Unwaith y bydd eich cais wedi'i gymeradwyo, byddwch yn gallu mewngofnodi a gweld y cynnwys hwn. Rydym yn gwerthfawrogi eich amynedd a'ch dealltwriaeth yn ystod yr amser hwn.`,
        })}
      </Paragraph>

      {z({
        en: (
          <Paragraph>
            If you have any questions or need further assistance, please contact
            our support team at{' '}
            <Link href="mailto:sfs.support@maps.org.uk">
              sfs.support@maps.org.uk
            </Link>
            .
          </Paragraph>
        ),
        cy: (
          <Paragraph>
            Os oes gennych unrhyw gwestiynau neu os oes angen cymorth pellach
            arnoch, cysylltwch â&apos;n tîm cymorth ar{' '}
            <Link href="mailto:sfs.support@maps.org.uk">
              sfs.support@maps.org.uk
            </Link>
            .
          </Paragraph>
        ),
      })}
    </CalloutMessage>
  );
};
