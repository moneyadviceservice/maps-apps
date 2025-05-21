import { ReactNode, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { BabyCostsAnalytics } from 'components/Analytics/BabyCostsAnalytics';
import { babyCostAdditionalData } from 'data/baby-costs-calculator/additional-content';
import { babyCostData } from 'data/baby-costs-calculator/content';
import { errorMessages } from 'data/baby-costs-calculator/errors';
import { ParsedUrlQuery } from 'querystring';
import { getCanonicalUrl } from 'utils/getCanonicalUrl/getCanonicalUrl';

import { Button } from '@maps-react/common/components/Button';
import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { SummarySpendBreakdown } from '@maps-react/common/components/SummarySpendBreakdown';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DynamicFields } from '@maps-react/pension-tools/components/DynamicFields';
import { ExpandableContainer } from '@maps-react/pension-tools/components/ExpandableContainer';
import {
  SummaryItem,
  TabSummaryWidget,
} from '@maps-react/pension-tools/components/TabSummaryWidget';
import { TeaserCardParent } from '@maps-react/pension-tools/components/TeaserCardParent';
import { TabLayout } from '@maps-react/pension-tools/layouts/TabLayout';
import {
  DefaultValues,
  FormData as FormDataType,
  FormField,
  GroupedFieldItem,
  TabData,
  TabResultContent,
} from '@maps-react/pension-tools/types/forms';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';
import { replacePlaceholder } from '@maps-react/pension-tools/utils/replacePlaceholder';
import {
  calculateTotal,
  generatePieChartData,
  tabDataTransformer,
  updateSummaryItems,
} from '@maps-react/pension-tools/utils/TabToolUtils';
import { getErrors } from '@maps-react/pension-tools/utils/TabToolUtils/getErrors';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import {
  BabyCostCalculator,
  Errors,
  getServerSidePropsDefault,
  HiddenFields,
} from '.';

export type BabyCostTabIndex = 1 | 2 | 3 | 4 | 5;

type FormContentProps = {
  tabFields: FormField[];
  tabData: string | ReactNode;
  errors: Errors;
  formData: FormDataType;
  hiddenFields: ReactNode;
  isLastTab: boolean;
  summaryHeading: string;
  summaryItems: SummaryItem[];
  tabs: TabData[];
  defaultValues: DefaultValues;
  currentStep: number;
};

const FormContent = ({
  tabData,
  tabFields,
  errors,
  formData,
  hiddenFields,
  isLastTab,
  summaryHeading,
  summaryItems,
  tabs,
  defaultValues,
  currentStep,
}: FormContentProps) => {
  const { z } = useTranslation();

  const [updatedFormData, setUpdatedFormData] =
    useState<FormDataType>(formData);
  const updateSummaryData = (formFieldKey: string, formFieldValue: string) => {
    setUpdatedFormData({
      ...updatedFormData,
      [formFieldKey]: formFieldValue,
    });
  };

  const updatedSummaryItems = useMemo(
    () =>
      updatedFormData &&
      updateSummaryItems(updatedFormData, tabs, defaultValues, currentStep),
    [updatedFormData, tabs, defaultValues, currentStep],
  );

  const expandableInfoSection = (content: string | ReactNode): ReactNode => {
    if (typeof content === 'string') {
      return <Paragraph className="mb-8 text-2xl">{content}</Paragraph>;
    } else {
      return content;
    }
  };

  const buttonFormId = 'baby-cost-calculator';

  return (
    <>
      {expandableInfoSection(tabData)}
      <div className="grid w-full grid-cols-12 gap-4">
        <div className="w-full col-span-12 md:col-span-7 lg:col-span-8">
          <form
            action={'/api/baby-costs-calculator/submit-answer'}
            method="POST"
            id={'baby-cost-calculator'}
          >
            <DynamicFields
              formFields={tabFields}
              formErrors={errors}
              savedData={formData}
              hiddenFields={hiddenFields}
              updateSavedValues={updateSummaryData}
            />
            <div className="flex flex-col justify-start my-8 lg:gap-4 md:flex-row">
              {!isLastTab && (
                <Button
                  className={'md:my-8'}
                  variant="primary"
                  id={'continue'}
                  type="submit"
                  form="baby-cost-calculator"
                >
                  {z({ en: 'Continue', cy: 'Parhau' })}
                </Button>
              )}
              <Button
                className="items-center my-8"
                variant="link"
                type="submit"
                form={buttonFormId}
                name="action"
                value="save"
              >
                <Icon type={IconType.BOOKMARK} />
                {z({
                  en: 'Save and come back later',
                  cy: 'Ailosod y gyfrifiannell',
                })}
              </Button>
            </div>
          </form>
        </div>
        <div className="w-full col-span-12 md:col-span-5 lg:col-span-4">
          {!!summaryItems.length && (
            <TabSummaryWidget
              title={summaryHeading}
              headingComponent={'h2'}
              items={
                updatedSummaryItems?.length ? updatedSummaryItems : summaryItems
              }
              buttonFormId={buttonFormId}
            />
          )}
        </div>
      </div>
    </>
  );
};

type ResultProps = {
  result: TabResultContent;
  summaryItems: SummaryItem[];
  summaryHeading: string;
  groupedFieldItems: GroupedFieldItem[];
  toolBaseUrl: string;
  lang: string;
  isEmbed: boolean;
  saveQuery?: ParsedUrlQuery;
};

const ResultContent = ({
  result,
  summaryItems,
  summaryHeading,
  groupedFieldItems,
  toolBaseUrl,
  lang,
  isEmbed,
  saveQuery,
}: ResultProps) => {
  const { z } = useTranslation();

  const { asPath } = useRouter();
  const canonicalUrl = getCanonicalUrl(asPath, lang);

  const { success, error, subHeading } = result;
  const total = calculateTotal(summaryItems);
  const successBool = total >= 0;

  const summaryItemsWithTotal = [
    ...summaryItems,
    {
      label: z({
        en: 'Result',
        cy: 'Canlyniadau',
      }),
      value: total,
      unit: 'pounds',
      calc: 'result',
    } as SummaryItem,
  ];

  const pieData = generatePieChartData(groupedFieldItems);

  const intro = replacePlaceholder(
    'amount',
    formatCurrency(total, 0),
    successBool ? success?.content : error?.content,
  );

  const { recommendedReading, otherTools, shareToolContent } = useMemo(
    () => babyCostAdditionalData(z, isEmbed),
    [z, isEmbed],
  );

  return (
    <>
      <div className="max-w-full mb-6 space-y-6 t-summary-intro">
        <Callout
          className={
            successBool
              ? 'bg-green-200 before:bg-green-700'
              : 'bg-red-100 before:bg-red-700'
          }
        >
          <div className="pb-[18px] px-[18px]">
            <Paragraph className="mb-4 text-2xl font-bold">
              {successBool ? success?.title : error?.title}
            </Paragraph>
            <Paragraph
              className={`text-5xl font-bold mb-4 ${
                successBool ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {formatCurrency(total, 0)}
            </Paragraph>
            <Paragraph className="text-2xl">{intro}</Paragraph>
          </div>
        </Callout>
      </div>
      <form method="POST">
        <div className="flex flex-row flex-wrap">
          <Heading level="h2" className="text-[38px] mb-8 mt-2">
            {subHeading}
          </Heading>
          <div className="grid w-full grid-cols-3 gap-4">
            <div className="flex items-center justify-center order-2 col-span-3 border border-blue-800 rounded lg:col-span-2 lg:px-4 lg:order-1">
              <div className="w-full">
                <SummarySpendBreakdown data={pieData} babyCostStyle={true} />
              </div>
            </div>
            <div className="flex items-center justify-center order-1 col-span-3 lg:col-span-1 lg:order-2">
              {!!summaryItems.length && (
                <div className="w-full">
                  <TabSummaryWidget
                    title={summaryHeading}
                    items={summaryItemsWithTotal}
                    headingLevel={'h2'}
                    restartUrl={`${toolBaseUrl}1?restart=true${addEmbedQuery(
                      !!isEmbed,
                      '&',
                    )}`}
                    displayDefaults={true}
                    containerClass={'h-full'}
                    saveUrl={`${toolBaseUrl}save`}
                    saveQuery={saveQuery}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className="pt-2">
        <ExpandableContainer
          heading={recommendedReading.heading}
          items={recommendedReading.items}
        />
      </div>
      <TeaserCardParent
        heading={otherTools.heading}
        items={otherTools.items}
        target={otherTools.target}
        teaserHeadingLevel={'h3'}
      />

      <ToolFeedback />
      <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
        <SocialShareTool
          url={canonicalUrl}
          title={shareToolContent.title}
          subject={z({
            en: 'Baby cost calculator - Work out your baby budget',
            cy: 'Cyfrifiannell costau babi - Gweithio allan eich cyllideb babi',
          })}
        />
      </div>
    </>
  );
};

type Props = {
  lang: string;
  urlPath: string;
  isEmbed: boolean;
  currentTab: BabyCostTabIndex;
  formData: FormDataType;
  errors: Record<string, string>;
  query: ParsedUrlQuery;
  backLinkQuery: ParsedUrlQuery;
};

const Tab = ({
  lang,
  urlPath,
  isEmbed,
  currentTab,
  formData,
  errors,
  query,
  backLinkQuery,
}: Props) => {
  const { z } = useTranslation();

  const { tabs, summaryHeading } = useMemo(
    () => babyCostData(z, isEmbed),
    [lang],
  );
  const toolBaseUrl = `/${lang}${urlPath}`;
  const currentStep = currentTab - 1;
  const { content, fields, result } = tabs[currentStep];
  const errorObj = useMemo(() => getErrors(errors, z, errorMessages), [errors]);
  const { tabLinks, tabContentHeadings, fieldData } = useMemo(
    () =>
      tabDataTransformer(
        formData,
        tabs,
        toolBaseUrl,
        errorObj.acdlErrors,
        isEmbed,
      ),
    [formData, tabs, toolBaseUrl, errorObj.acdlErrors, isEmbed],
  );
  const { summaryItems, validation, groupedFieldItems, defaultValues } =
    fieldData;
  const isLastTab = tabLinks.length === currentTab;

  const resultsTotal = calculateTotal(summaryItems);

  return (
    <BabyCostCalculator
      step={currentTab}
      isEmbed={isEmbed}
      errors={errorObj.pageErrors}
    >
      <BabyCostsAnalytics
        currentTab={currentTab}
        formData={formData}
        resultsTotal={resultsTotal}
      >
        {(!isEmbed || currentTab !== 1) && (
          <Container className="pt-8">
            <Link
              href={{
                pathname:
                  currentTab > 1
                    ? `${toolBaseUrl}${currentTab - 1}`
                    : `https://www.moneyhelper.org.uk/${lang}/family-and-care/becoming-a-parent/baby-costs-calculator`,
                query: backLinkQuery,
              }}
            >
              <Icon type={IconType.CHEVRON_LEFT} />
              {z({ en: 'Back', cy: 'Yn ôl' })}
            </Link>
          </Container>
        )}

        <TabLayout
          tabLinks={tabLinks}
          currentTab={currentTab}
          tabHeadings={tabContentHeadings}
          tabContent={
            content && fields ? (
              <FormContent
                tabData={content}
                tabFields={fields}
                errors={errorObj.fieldErrors}
                formData={formData}
                hiddenFields={
                  <HiddenFields
                    isEmbed={isEmbed}
                    lang={lang}
                    toolBaseUrl={toolBaseUrl}
                    currentTab={currentTab}
                    formData={formData}
                    validation={validation}
                    lastTab={tabLinks.length.toString()}
                  />
                }
                isLastTab={isLastTab}
                summaryHeading={summaryHeading}
                summaryItems={summaryItems}
                tabs={tabs}
                defaultValues={defaultValues}
                currentStep={currentStep}
              />
            ) : (
              result && (
                <ResultContent
                  result={result}
                  summaryItems={summaryItems}
                  summaryHeading={z({
                    en: 'Summary total',
                    cy: "Crynodeb o'r cyfanswm",
                  })}
                  groupedFieldItems={groupedFieldItems}
                  toolBaseUrl={toolBaseUrl}
                  lang={lang}
                  isEmbed={isEmbed}
                  saveQuery={query}
                />
              )
            )
          }
          toolBaseUrl={toolBaseUrl}
          hasErrors={!!errors}
          buttonFormId={result ? 'baby-cost-results' : 'baby-cost-calculator'}
          formData={formData}
        />
        <form
          action={'/api/baby-costs-calculator/submit-answer'}
          method="POST"
          id={'baby-cost-results'}
        >
          {
            <HiddenFields
              isEmbed={isEmbed}
              lang={lang}
              toolBaseUrl={toolBaseUrl}
              currentTab={currentTab}
              formData={formData}
              validation={validation}
              lastTab={tabLinks.length.toString()}
            />
          }
        </form>
      </BabyCostsAnalytics>
    </BabyCostCalculator>
  );
};

export default Tab;

export const getServerSideProps = getServerSidePropsDefault;
