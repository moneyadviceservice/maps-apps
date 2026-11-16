import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import RealTimeSummary from 'components/RealTimeSummary';
import tabs, { API_ENDPOINT, select } from 'data/budget-planner';
import { useBudgetPlannerData } from 'hooks/useBudgetPlannerData';
import groupBy from 'utils/groupBy';

import Bookmark from '@maps-react/common/assets/images/bookmark.svg';
import { Button } from '@maps-react/common/components/Button';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H4 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { NotificationBox } from '@maps-react/common/components/NotificationBox';
import { AffixInput } from '@maps-react/form/components/AffixInput';
import { Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import BudgetPlanner, { getServerSidePropsDefault, Props } from '.';

type Fields = (typeof tabs)[number]['fields'];

export default function Tab({ data, tabName, ...props }: Readonly<Props>) {
  const { t, tList, locale } = useTranslation();
  const { addEvent } = useAnalytics();

  const { budgetData, setBudgetData, hydrated } = useBudgetPlannerData();
  const router = useRouter();

  const [moreInfoExpanded, setMoreInfoExpanded] = useState<
    Record<string, boolean>
  >({});
  const { returning } = props.query;
  const isEmbedded = props.isEmbedded || router.query.isEmbedded === 'true';
  const userData = Object.keys(budgetData).length > 0 ? budgetData : data;

  const tab = useMemo(
    () => tabs.find(({ name }) => name === tabName),
    [tabName],
  );

  const fieldsContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const firstAccordion =
      fieldsContainerRef.current?.querySelector<HTMLElement>('summary');
    firstAccordion?.focus();
  }, [tabName]);

  function handleChange({
    target,
  }: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setBudgetData({
      ...budgetData,
      [tabName as keyof typeof budgetData]: {
        ...budgetData[tabName as keyof typeof budgetData],
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
      {returning === 'true' && (
        <div className="col-span-12 lg:col-span-10">
          <NotificationBox>
            <>
              <H4 className="pl-8">{t('pages.tab.welcome-back.title')}</H4>
              <ListElement
                variant="unordered"
                color="dark"
                className="pt-6 pb-8 pl-10 pr-8 text-sm list-inside"
                items={tList('pages.tab.welcome-back.items')}
              />
            </>
          </NotificationBox>
        </div>
      )}

      <div className="col-span-12 lg:col-span-10">
        <div className="grid grid-cols-12 gap-4">
          <div
            key={hydrated ? 'hydrated' : 'initial'}
            ref={fieldsContainerRef}
            className="col-span-12 md:col-span-8 pb-4"
          >
            {Object.entries(groupedFields).map(([group, fields], index) => (
              <ExpandableSection
                key={group}
                title={t(`common.groups.${group}`)}
                open={
                  !index ||
                  fields?.some((field) => {
                    const inputsData =
                      userData[tabName as keyof typeof budgetData];
                    return inputsData?.[field.name];
                  })
                }
                testClassName="t-forms-section__heading"
                contentTestClassName="t-forms-section__content"
                variant="mainLeftIcon"
              >
                <div className="flex flex-col gap-4">
                  {fields?.map(({ name, defaultFactorValue }) => {
                    const inputsData: Record<string, string> =
                      userData[tabName as keyof typeof budgetData];
                    const title = t(
                      group === 'additional'
                        ? 'pages.tab.additional-item'
                        : `${tabName}/fields.${name}.title`,
                    );
                    return (
                      <div key={`${name}-key`} className="flex flex-col">
                        {group !== 'additional' ? (
                          <div className="flex pr-2 sm:relative">
                            <label
                              htmlFor={`input-${name}`}
                              className="flex flex-wrap content-center mb-2 mr-3 text-lg"
                            >
                              {title}
                            </label>
                          </div>
                        ) : (
                          <div className="-ml-[1px] pb-2 flex lg:w-[393px]">
                            <TextInput
                              name={`${name}-title`}
                              defaultValue={
                                inputsData ? inputsData[`${name}-title`] : ''
                              }
                              placeholder={title}
                              onChange={handleChange}
                            />
                          </div>
                        )}
                        <div className="flex items-center w-full h-full">
                          <AffixInput
                            variant="money"
                            id={`input-${name}`}
                            name={name}
                            defaultValue={inputsData ? inputsData[name] : ''}
                            aria-label={t('pages.tab.in-pounds', {
                              label: title,
                            })}
                            containerClassName="w-[43%] lg:w-48 mr-2"
                            onChange={handleChange}
                            placeholder=""
                            inputMode="decimal"
                            thousandSeparator={true}
                          />
                          <div className="w-[57%] lg:w-48">
                            <Select
                              name={`${name}-factor`}
                              options={select.map(
                                ({ name: frequency, value }) => ({
                                  text: t(`common.frequencies.${frequency}`),
                                  value: String(value),
                                }),
                              )}
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
                            title={t(
                              moreInfoExpanded[name]
                                ? 'pages.tab.less-info'
                                : 'pages.tab.more-info',
                            )}
                            variant="hyperlink"
                            onClick={() => toggleMoreInfo(name)}
                            open={moreInfoExpanded['name']}
                            type="nested"
                            testClassName="test-class"
                            className="pt-3"
                            contentTestClassName="content-test-class"
                          >
                            <Markdown
                              content={t(
                                `${tabName}/fields.${name}.information`,
                              )}
                              className="mb-0"
                              withIcon={false}
                            />
                          </ExpandableSection>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ExpandableSection>
            ))}
          </div>

          <div className="col-span-12 md:col-span-4 focus:outline-none focus:ring-0">
            <RealTimeSummary data={userData} ariaLive="polite" />
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-10">
        <div className="flex flex-col justify-start gap-4 mt-4 md:flex-row">
          {tab?.nextTab && (
            <>
              <Button
                variant="primary"
                width="w-full md:w-auto"
                analyticsClassName="tool-nav-submit"
                formAction={`${API_ENDPOINT}/${tab?.nextTab}`}
                onClick={(e) => {
                  // @note: Embedded falls back to the native form submit
                  // (server flow -> Netlify blob); standalone navigates client
                  // side with sessionStorage carrying the data.
                  if (isEmbedded) return;
                  e.preventDefault();
                  router.push({
                    pathname: `/${locale}/${tab?.nextTab}`,
                    query: {
                      isEmbedded: router.query.isEmbedded,
                    },
                  });
                }}
              >
                {t('pages.tab.continue')}
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

                  if (isEmbedded) return;
                  e.preventDefault();
                  router.push({
                    pathname: `/${locale}/save`,
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
                {t('pages.tab.save-and-come-back')}
              </Button>
            </>
          )}
        </div>
      </div>
    </BudgetPlanner>
  );
}

export const getServerSideProps = getServerSidePropsDefault;
