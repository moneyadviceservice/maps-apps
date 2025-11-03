import { parse } from 'date-fns';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Table } from '@maps-react/common/components/Table';
import useTranslation from '@maps-react/hooks/useTranslation';

import { LBTT } from '../../data/lbtt/howIsItCalculated';
import { LTT } from '../../data/ltt/howIsItCalculated';
import { SDLT } from '../../data/sdlt/howIsItCalculated';
import { type ContentBlock } from '../../data/types';
import { getRatePeriod } from '../../utils/rates/rateUtils';
import { List } from '../List';

const CONTENT_MAP = {
  SDLT,
  LTT,
  LBTT,
} as const;

function ContentBlockRenderer({ block }: { readonly block: ContentBlock }) {
  const { z } = useTranslation();

  switch (block.type) {
    case 'paragraph':
      return <Paragraph>{z(block.content)}</Paragraph>;
    case 'list':
      return (
        <List
          type="unordered"
          preamble={block.preamble ? (z(block.preamble) as string) : ''}
          items={block.items.map((item) => ({
            text: z(item) as string,
          }))}
        />
      );
    case 'table':
      return (
        <div>
          {block.heading && (
            <Paragraph className="mb-0">{z(block.heading)}</Paragraph>
          )}
          <Table
            columnHeadings={z(block.columns) as string[]}
            data={block.data}
          />
        </div>
      );
    default:
      return null;
  }
}

interface TaxExplainerProps {
  readonly buyerType: string;
  readonly purchaseDate: string;
  readonly taxType: 'SDLT' | 'LTT' | 'LBTT';
}

export function TaxExplainer({
  buyerType,
  purchaseDate,
  taxType,
}: Readonly<TaxExplainerProps>) {
  const parsedDate = purchaseDate
    ? parse(purchaseDate, 'd-M-yyyy', new Date())
    : new Date();

  const contentConfig = CONTENT_MAP[taxType];
  const buyerContent = contentConfig.find((c) => c.buyerType === buyerType);

  if (!buyerContent) return null;

  const contentPeriod = getRatePeriod(buyerContent.periods, parsedDate);

  if (!contentPeriod?.contentBlocks) return null;

  return (
    <>
      {contentPeriod.contentBlocks.map((block, index) => (
        <ContentBlockRenderer
          key={`${buyerType}-block-${index}`}
          block={block}
        />
      ))}
    </>
  );
}
