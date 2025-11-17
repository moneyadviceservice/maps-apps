import { DocumentMetaGrid } from 'components/DocumentMetaGrid/DocumentMetaGrid';
import { DocumentTemplate } from 'types/@adobe/page';
import { v4 } from 'uuid';

import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/index';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

type Props = {
  doc: DocumentTemplate;
  lang: string;
};

export const DocumentSummary = ({ doc, lang }: Props) => {
  const overview = doc.overview?.json?.map((s) => mapJsonRichText([s]));

  return (
    <InformationCallout key={v4()} className="p-6 pb-8 border-gray-95 border-3">
      <Heading level={'h3'} component={'h2'} className="mb-4 text-blue-700">
        {doc.title}
      </Heading>

      <div className="block mb-6 text-gray-600 sm:hidden">{overview}</div>

      <div className="justify-between block pb-4 border-b-2 sm:flex md:mb-6">
        <Link
          href={{
            pathname: `/${lang}/evidence-library/${doc.pageType?.key}/${doc.slug}`,
          }}
          className="mb-3 text-pink-600 sm:mb-0"
        >
          <span className="sm:hidden">View full summary</span>
          <span className="hidden sm:inline">View evidence summary</span>
        </Link>

        {doc.publishDate && (
          <Paragraph className="mb-0">
            <span className="font-bold">Year of publication</span>{' '}
            {new Date(doc.publishDate).getFullYear().toString()}
          </Paragraph>
        )}
      </div>

      <div className="hidden mb-6 text-gray-600 sm:block">{overview}</div>

      <DocumentMetaGrid doc={doc} />
    </InformationCallout>
  );
};
