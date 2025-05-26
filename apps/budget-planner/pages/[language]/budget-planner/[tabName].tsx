import { ChangeEvent, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import RealTimeSummary from 'components/RealTimeSummary';
import { useBudgetPlannerProvider } from 'context/BudgetPlannerDataProvider';
import tabs, { API_ENDPOINT, groups, select } from 'data/budget-planner';
import groupBy from 'utils/groupBy';

import Bookmark from '@maps-react/common/assets/images/bookmark.svg';
import { Button } from '@maps-react/common/components/Button';
import { Callout } from '@maps-react/common/components/Callout';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H4 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import BudgetPlanner, { getServerSidePropsDefault, Props } from '.';

type Fields = (typeof tabs)[number]['fields'];

export default function Tab({ data, tabName, ...props }: Readonly<Props>) {
  const { z, locale } = useTranslation();
  const { addEvent } = useAnalytics();

  const { dataInContext, setDataInContext } = useBudgetPlannerProvider();
  const router = useRouter();

  const [moreInfoExpanded, setMoreInfoExpanded] = useState<
    Record<string, boolean>
  >({});
  const { returning } = props.query;
  const userData = Object.keys(dataInContext).length > 0 ? dataInContext : data;

  const tab = useMemo(
    () => tabs.find(({ name }) => name === tabName),
    [tabName],
  );

  function handleChange({
    target,
  }: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setDataInContext({
      ...dataInContext,
      [tabName as keyof typeof dataInContext]: {
        ...dataInContext[tabName as keyof typeof dataInContext],
        [target.name]: target.value,
      },
    });
  }

  const groupedFields = useMemo(
    () => tab?.fields?.reduce(groupBy('group'), {}),
    [tab],
  ) as Record<string, Fields>;

  const toggleMoreInfo = (key: string) => {
    setMoreInfoExpanded((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <BudgetPlanner
      data={userData}
      tabName={tabName}
      sectionTestClassName="t-forms-section"
      {...props}
    >
      <div className="space-y-8">
        {returning === 'true' && (
          <Callout>
            <>
              <H4 className="pl-8">
                {z({
                  en: 'Welcome back to your budget',
                  cy: "Croeso yn ôl i'ch cyllideb",
                })}
              </H4>
              <ListElement
                variant="unordered"
                color="dark"
                className="pt-6 pb-8 pl-10 pr-8 text-sm list-inside"
                items={[
                  z({
                    en: 'Continue to fill out all the categories that apply to you',
                    cy: "Parhewch i lenwi'r holl gategorïau sy'n berthnasol i chi.",
                  }),
                  z({
                    en: 'Use ‘save and return’ again if you need to pause and come back',
                    cy: 'Defnyddiwch "arbed a dychwelyd" eto os oes angen i chi oedi a dod yn ôl',
                  }),
                ]}
              />
            </>
          </Callout>
        )}
        <div className="flex flex-row flex-wrap">
          <div className="w-full pb-4 md:w-2/3">
            {(
              Object.entries(groupedFields) as unknown as [
                keyof typeof groups,
                Fields,
              ][]
            ).map(([group, fields], index) => (
              <ExpandableSection
                key={group}
                title={z(groups[group])}
                open={
                  !index ||
                  fields?.some((field) => {
                    const inputsData =
                      userData[tabName as keyof typeof dataInContext];
                    return inputsData?.[field.name];
                  })
                }
                testClassName="t-forms-section__heading"
                contentTestClassName="t-forms-section__content"
                variant="mainLeftIcon"
              >
                <div className="flex flex-col gap-4">
                  {fields?.map(
                    ({ name, title, information, defaultFactorValue }) => {
                      const inputsData: Record<string, string> =
                        userData[tabName as keyof typeof dataInContext];
                      return (
                        <div key={`${name}-key`} className="flex flex-col">
                          {group !== 'additional' ? (
                            <div className="flex pr-2 sm:relative">
                              <Paragraph className="flex flex-wrap content-center mb-2 mr-3 text-lg">
                                {title ? z(title) : ''}
                              </Paragraph>
                            </div>
                          ) : (
                            <div className="-ml-[1px] flex lg:w-[393px]">
                              <TextInput
                                name={`${name}-title`}
                                defaultValue={
                                  inputsData ? inputsData[`${name}-title`] : ''
                                }
                                placeholder={title && (z(title) as string)}
                                onChange={handleChange}
                              />
                            </div>
                          )}
                          <div className="flex items-center w-full h-full">
                            <MoneyInput
                              name={name}
                              defaultValue={inputsData ? inputsData[name] : ''}
                              aria-label={`${
                                title ? z(title) + ' in pounds' : ''
                              }`}
                              inputClassName="w-[43%] lg:w-48 mr-2"
                              onChange={handleChange}
                              placeholder=""
                              thousandSeparator={false}
                            />
                            <div className="w-[57%] lg:w-48">
                              <Select
                                name={`${name}-factor`}
                                options={select.map(({ title, value }) => ({
                                  text: z(title),
                                  value: String(value),
                                }))}
                                onChange={handleChange}
                                defaultValue={
                                  inputsData?.[`${name}-factor`] ??
                                  defaultFactorValue
                                }
                                hideEmptyItem={true}
                                selectClassName="h-12"
                                aria-description={name}
                              />
                            </div>
                          </div>

                          {group !== 'additional' && (
                            <ExpandableSection
                              title={z({
                                en: `${
                                  moreInfoExpanded[name]
                                    ? 'Less info'
                                    : 'More info'
                                }`,
                                cy: `${
                                  moreInfoExpanded[name]
                                    ? 'Llai o wybodaeth'
                                    : 'Mwy o wybodaeth'
                                }`,
                              })}
                              variant="hyperlink"
                              onClick={() => toggleMoreInfo(name)}
                              open={moreInfoExpanded['name']}
                              type="nested"
                              testClassName="test-class"
                              contentTestClassName="content-test-class"
                            >
                              <>{information && z(information)}</>
                            </ExpandableSection>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </ExpandableSection>
            ))}
          </div>
          <div
            className="w-full h-full md:w-1/3 md:pl-5 sm:px-2 focus:outline-none focus:ring-0"
            // tabIndex={0}
          >
            <RealTimeSummary data={userData} ariaLive="polite" />
          </div>
        </div>

        <div className="flex flex-col justify-start gap-4 mt-4 md:flex-row">
          {tab?.nextTab && tab.submit && (
            <>
              <Button
                variant="primary"
                width="w-full md:w-auto"
                analyticsClassName="tool-nav-submit"
                formAction={`${API_ENDPOINT}/${tab?.nextTab}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push({
                    pathname: `/${locale}/budget-planner/${tab?.nextTab}`,
                    query: {
                      isEmbedded: router.query.isEmbedded,
                    },
                  });
                }}
              >
                {z({ en: 'Continue', cy: 'Parhau' })}
              </Button>
              <Button
                className="items-center t-save-and-return"
                variant="link"
                formAction={`${API_ENDPOINT}/${tab?.nextTab}?save=true&tabName=${tabName}`}
                onClick={(e) => {
                  addEvent({
                    event: 'toolSaved',
                    page: {
                      pageName: 'Budget Planner',
                    },
                    tool: {
                      toolName: 'Budget Planner',
                      toolStep: (
                        tabs.findIndex(({ name }) => name === tabName) + 1
                      ).toString(),
                      stepName: tabName ?? '',
                    },
                    eventInfo: {
                      toolName: 'Budget Planner',
                      toolStep: (
                        tabs.findIndex(({ name }) => name === tabName) + 1
                      ).toString(),
                      stepName: tabName ?? '',
                    },
                  });

                  e.preventDefault();
                  router.push({
                    pathname: `/${locale}/budget-planner/save`,
                    query: {
                      save: 'true',
                      tabName: tabName,
                      isEmbedded:
                        router.query?.isEmbedded === 'true' ? 'true' : 'false',
                    },
                  });
                }}
              >
                <Bookmark />
                {z({
                  en: 'Save and come back later',
                  cy: 'Arbedwch a dewch yn ôl yn nes ymlaen',
                })}
              </Button>
            </>
          )}
        </div>
      </div>
    </BudgetPlanner>
  );
}

export const getServerSideProps = getServerSidePropsDefault;
