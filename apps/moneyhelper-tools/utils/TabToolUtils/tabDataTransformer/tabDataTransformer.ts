import { SummaryItem } from 'components/TabSummaryWidget';
import {
  ConditionalFields,
  DefaultValues,
  FormData,
  FormValidationObj,
  GroupedFieldItem,
  TabData,
} from 'data/types';
import { Errors } from 'pages/[language]/baby-cost-calculator';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import { generateFieldData } from '../generateFieldData';
import { AcdlFieldError } from '../generateFieldData/generateFieldData';
import { generateUrlParams } from '../generateUrlParams';
import { accumulateSummaryItems } from '../Summary/accumulateSummaryItems';

export interface TransformedFieldDataType {
  acdlErrors: AcdlFieldError;
  validation: FormValidationObj[];
  defaultValues: DefaultValues;
  summaryItems: SummaryItem[];
  groupedFieldItems: GroupedFieldItem[];
  conditionalFields: ConditionalFields;
}

interface AccumulatorType {
  tabLinks: string[];
  tabContentHeadings: string[];
  fieldData: TransformedFieldDataType;
}

export const tabDataTransformer = (
  formData: FormData,
  tabs: TabData[],
  toolBaseUrl: string,
  acdlErrors?: Errors,
  isEmbed = false,
): AccumulatorType => {
  return tabs.reduce<AccumulatorType>(
    (acc, tabData, i) => {
      const { linkText, heading, summary, fields } = tabData;
      const tab = i + 1;
      const urlPath = `${toolBaseUrl}${tab}?${generateUrlParams(
        formData,
      )}${addEmbedQuery(isEmbed, '&')}`;

      const tabFieldData =
        fields &&
        generateFieldData(
          fields,
          formData,
          urlPath,
          summary,
          linkText,
          isEmbed,
          acdlErrors,
        );

      return {
        tabLinks: [...acc.tabLinks, linkText ?? ''],
        tabContentHeadings: [...acc.tabContentHeadings, heading],
        fieldData:
          !fields || !tabFieldData
            ? acc.fieldData
            : {
                acdlErrors: {
                  ...acc.fieldData.acdlErrors,
                  ...tabFieldData.acdlErrors,
                },
                validation: [
                  ...acc.fieldData.validation,
                  tabFieldData.validation,
                ],
                defaultValues: {
                  ...acc.fieldData.defaultValues,
                  ...tabFieldData.defaultValues,
                },
                summaryItems: [
                  ...acc.fieldData.summaryItems,
                  tabFieldData.summaryItem,
                ],
                groupedFieldItems: [
                  ...acc.fieldData.groupedFieldItems,
                  ...tabFieldData.groupedFieldSum,
                ],
                conditionalFields: new Set([
                  ...acc.fieldData.conditionalFields,
                  ...(tabFieldData.conditionalFields || []),
                ]),
              },
      };
    },
    {
      tabLinks: [],
      tabContentHeadings: [],
      fieldData: {
        acdlErrors: {},
        validation: [],
        defaultValues: {},
        summaryItems: [],
        groupedFieldItems: [],
        conditionalFields: new Set<string>(),
      },
    },
  );
};

export const updateSummaryItems = (
  formData: FormData,
  tabs: TabData[],
  defaultValues: DefaultValues,
  currentStep: number,
): SummaryItem[] => {
  return tabs.reduce<SummaryItem[]>((acc, { summary, fields }, index) => {
    const displayEmptyStep = index < currentStep;
    return fields && summary
      ? accumulateSummaryItems(
          acc,
          summary,
          fields,
          formData,
          defaultValues,
          displayEmptyStep,
        )
      : acc;
  }, []);
};
