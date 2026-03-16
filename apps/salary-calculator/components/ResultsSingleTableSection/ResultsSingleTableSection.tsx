import { BenefitsCallout } from 'components/BenefitsCallout';
import { FrequencySelector } from 'components/FrequencySelector';
import { ResultsHelpText } from 'components/ResultsHelpText';
import {
  FrequencyType,
  ResultsTable,
  ResultsTableColumn,
  ResultsTableRow,
} from 'components/ResultsTable';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H2, H3 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import PieChart from '@maps-react/common/components/PieChart';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface ResultsSingleTableSectionProps {
  resultsFrequency: FrequencyType;
  setResultsFrequency: (f: FrequencyType) => void;
  queryParamsObj: Record<string, string>;
  rows: ResultsTableRow[];
  columns: ResultsTableColumn[];
  netAmount: string;
  frequencyText: string;
  pieData: {
    name: string;
    percentage: number;
    colour: string;
  }[];
  showBenefitsCallout: boolean;
}

export const ResultsSingleTableSection = ({
  resultsFrequency,
  setResultsFrequency,
  queryParamsObj,
  rows,
  columns,
  netAmount,
  frequencyText,
  pieData,
  showBenefitsCallout,
}: ResultsSingleTableSectionProps) => {
  const { z } = useTranslation();

  return (
    <>
      <H2>
        {z({
          en: 'Your estimated take home pay',
          cy: 'Eich cyflog mynd adref amcangyfrifedig',
        })}
      </H2>

      <FrequencySelector
        currentFrequency={resultsFrequency}
        onFrequencyChange={setResultsFrequency}
        formData={queryParamsObj}
      />

      <div className="flex flex-col items-center justify-center p-2 my-6 bg-gray-100 rounded-[5px]">
        <H3 variant="primary">£{netAmount}</H3>
        <H3 variant="primary">{frequencyText}</H3>
      </div>

      <ResultsHelpText />

      <ResultsTable
        rows={rows}
        columns={columns}
        frequency={resultsFrequency}
      />

      <div className="grid grid-cols-12 gap-6 pb-4 mt-4 border-2 border-gray-200 rounded-md lg:pb-0 lg:px-4">
        {/* PieChart */}
        <div className="flex justify-center col-span-12 lg:col-span-6">
          <div className="w-full max-w-xs px-4 mx-auto lg:p-0 lg:max-w-none">
            <PieChart items={pieData} />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col items-center justify-center col-span-12 lg:col-span-6 lg:items-start">
          <ul className="space-y-4 text-center lg:ml-2 lg:text-left">
            {pieData.map((item, idx) => (
              <li key={idx} className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full"
                    style={{ backgroundColor: item.colour }}
                    aria-hidden="true"
                  />
                  <span className="text-gray-800">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {item.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ExpandableSection
        title={
          <span className="text-[18px] font-normal">
            {z({
              en: 'How we calculated your result',
              cy: "Sut wnaethon ni gyfrifo'ch canlynia",
            })}
          </span>
        }
        variant="hyperlink"
        className="mt-4"
      >
        <Paragraph>
          {z({
            en: 'Unless you have told us otherwise, we have assumed:',
            cy: 'Oni bai eich bod wedi dweud wrthym fel arall, tybiwn:',
          })}
        </Paragraph>
        <ListElement
          variant="unordered"
          color="dark"
          className="pl-6 pr-8 list-inside "
          items={[
            z({
              en: 'a year is: 12 months; 52 weeks; 260 working days.',
              cy: 'blwyddyn yw: 12 mis; 52 wythnos; 260 diwrnod gwaith.',
            }),
            z({
              en: 'a week is: a five-day working week.',
              cy: 'wythnos yw: wythnos waith pum diwrnod.',
            }),
          ]}
        />
      </ExpandableSection>

      {showBenefitsCallout && (
        <BenefitsCallout className="px-10 pt-6 pb-8 mt-4" />
      )}
    </>
  );
};
