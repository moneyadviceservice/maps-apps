import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { FrequencySelector } from '../FrequencySelector/FrequencySelector';
import { ResultsTable } from '../ResultsTable';
import type {
  FrequencyType,
  ResultsTableColumn,
  ResultsTableRow,
} from '../ResultsTable/ResultsTable';

interface ResultsComparisonTableSectionProps {
  resultsFrequency: FrequencyType;
  setResultsFrequency: (f: FrequencyType) => void;
  queryParamsObj: Record<string, string | number | boolean>;
  rows: ResultsTableRow[];
  columns: ResultsTableColumn[];
  showHeading?: boolean;
}

export const ResultsComparisonTableSection = ({
  resultsFrequency,
  setResultsFrequency,
  queryParamsObj,
  rows,
  columns,
  showHeading = true,
}: ResultsComparisonTableSectionProps) => {
  const { z } = useTranslation();

  return (
    <div>
      <div className="">
        {showHeading && (
          <div className="block lg:hidden">
            <Paragraph
              variant="primary"
              className="text-[28px] my-6 font-semibold"
            >
              {z({
                en: 'Your estimated take home pay for each salary',
                cy: 'Eich cyflog cartref amcangyfrifedig ar gyfer pob cyflog',
              })}
            </Paragraph>
            <FrequencySelector
              currentFrequency={resultsFrequency}
              onFrequencyChange={setResultsFrequency}
              formData={Object.fromEntries(
                Object.entries(queryParamsObj).map(([k, v]) => [k, String(v)]),
              )}
              isComparison={true}
            />
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <ResultsTable
              rows={rows}
              columns={columns}
              frequency={resultsFrequency}
            />
          </div>
        </div>

        <ExpandableSection
          title={
            <span className="text-[18px] font-normal leading-[140%] tracking-[0.12px]">
              {z({
                en: 'How we calculated your result',
                cy: 'Sut wnaethom gyfrifo eich canlyniad',
              })}
            </span>
          }
          variant="hyperlink"
          className="mt-2"
        >
          <div className="pb-4 text-gray-700 font-normal leading-[140%] tracking-[0.12px]">
            <Paragraph>
              {z({
                en: 'Unless you have told us otherwise, we have assumed:',
                cy: 'Oni bai eich bod wedi dweud wrthym fel arall, rydym wedi cymryd yn ganiataol:',
              })}
            </Paragraph>
            <ListElement
              variant="unordered"
              color="dark"
              className="pl-6 pr-8 list-inside"
              items={[
                z({
                  en: 'a year is: 12 months; 52 weeks; 260 working days.',
                  cy: 'mae blwyddyn yn: 12 mis; 52 wythnos; 260 diwrnod gwaith.',
                }),
                z({
                  en: 'a week is: a five-day working week.',
                  cy: 'mae wythnos yn: wythnos waith bum diwrnod.',
                }),
              ]}
            />
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
};
