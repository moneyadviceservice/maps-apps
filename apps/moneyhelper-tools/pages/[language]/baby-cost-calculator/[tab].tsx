import { ReactNode, useMemo, useState } from 'react';
import {
  BabyCostCalculator,
  getServerSidePropsDefault,
  Errors,
  HiddenFields,
} from '.';
import { TabLayout } from 'layouts/TabLayout';
import { babyCostData } from 'data/baby-costs-calculator/content';
import { babyCostAdditionalData } from 'data/baby-costs-calculator/additional-content';
import { DynamicFields } from 'components/DynamicFields';
import { TabSummaryWidget, SummaryItem } from 'components/TabSummaryWidget';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Button } from '@maps-react/common/components/Button';
import { Callout } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { SummarySpendBreakdown } from 'components/SummarySpendBreakdown';
import { ExpandableContainer } from 'components/ExpandableContainer';
import { TeaserCardParent } from 'components/TeaserCardParent';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import {
  tabDataTransformer,
  updateSummaryItems,
  calculateTotal,
  generatePieChartData,
} from 'utils/TabToolUtils';
import { replacePlaceholder } from 'utils/replacePlaceholder';
import { formatCurrency } from 'utils/formatCurrency';
import {
  FormField,
  FormData as FormDataType,
  TabData,
  TabResultContent,
  DefaultValues,
  GroupedFieldItem,
} from 'data/types';
import { ParsedUrlQuery } from 'querystring';
import { addEmbedQuery } from 'utils/addEmbedQuery';
import { BabyCostsAnalytics } from 'components/Analytics/BabyCostsAnalytics';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';
import { getErrors } from 'utils/TabToolUtils/getErrors';
import { errorMessages } from 'data/baby-costs-calculator/errors';
import { SocialShareTool } from 'components/SocialShareTool';

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
      return <Paragraph className="text-2xl mb-8">{content}</Paragraph>;
    } else {
      return content;
    }
  };

  const buttonFormId = 'baby-cost-calculator';

  return (
    <>
      {expandableInfoSection(tabData)}
      <div className="grid grid-cols-12 gap-4 w-full">
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
            <div className="flex justify-start flex-col lg:gap-4 md:flex-row my-8">
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

  const { toolHeading } = useMemo(() => babyCostData(z, isEmbed), [z, isEmbed]);

  return (
    <>
      <div className="max-w-full space-y-6 mb-6 t-summary-intro">
        <Callout
          className={
            successBool
              ? 'bg-green-200 before:bg-green-700'
              : 'bg-red-100 before:bg-red-700'
          }
        >
          <div className="pb-[18px] px-[18px]">
            <Paragraph className="text-2xl font-bold mb-4">
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
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex items-center justify-center col-span-3 lg:col-span-2 lg:px-4 border border-blue-800 rounded order-2 lg:order-1">
              <div className="w-full">
                <SummarySpendBreakdown data={pieData} babyCostStyle={true} />
              </div>
            </div>
            <div className="flex items-center justify-center col-span-3 lg:col-span-1 order-1 lg:order-2">
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

      <div className="print:hidden t-social-sharing flex flex-col sm:flex-row justify-between border-t border-slate-400 mt-8 py-6">
        <SocialShareTool
          url={`https://www.moneyhelper.org.uk/${lang}/family-and-care/becoming-a-parent/baby-costs-calculator`}
          title={shareToolContent.title}
          toolName={toolHeading}
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
                pathname: `${toolBaseUrl}${
                  currentTab > 1 ? currentTab - 1 : ''
                }`,
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
