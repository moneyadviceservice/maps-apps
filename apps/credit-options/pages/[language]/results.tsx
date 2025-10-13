import { ReactNode } from 'react';

import data, { ExpandableSectionData, Section } from 'data/results';
import child from 'public/teaser-card-images/child.jpg';
import coffee from 'public/teaser-card-images/coffee.jpg';
import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H2, Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { Results } from '@maps-react/form/components/Results';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { checkCondition } from '@maps-react/utils/checkCondition';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { CreditOptions, getServerSidePropsDefault } from '.';
import { getComponent } from '../../utils/GetComponent';
import { translateObject } from '../../utils/TranslateObject';

type Props = {
  storedData: DataFromQuery;
  isEmbed: boolean;
  links: ToolLinks;
};

type ExpandableContentSectionProps = {
  expandableData: ExpandableSectionData;
};

const ExpandableContentSection = ({
  expandableData,
}: ExpandableContentSectionProps) => {
  const { z } = useTranslation();
  const { intro, sections, bottomParagraph } = expandableData;

  return (
    <div className="space-y-4 md:space-y-8">
      <div>{z(intro)}</div>
      {sections?.map(({ props, component }, j) => {
        if (component) {
          try {
            const translatedProps = translateObject(props, z);
            const { Component, className, headingClassName } =
              getComponent(component);

            return (
              <Component
                {...translatedProps}
                className={className}
                headingClassName={headingClassName}
                key={j}
              />
            );
          } catch (error) {
            console.error(error);
          }
        }
      })}
      {z(bottomParagraph)}
    </div>
  );
};

type MainContentProps = {
  validatedData: Section[];
  noResults?: boolean;
};

export const MainContent = ({
  validatedData,
  noResults = false,
}: MainContentProps) => {
  const { z } = useTranslation();

  return (
    <>
      {validatedData.map(({ id, title, intro, content }) => {
        if (content.length > 0) {
          return (
            <div
              key={`${id}-results-section`}
              className={twMerge(
                !noResults &&
                  !id.includes('0') &&
                  !id.includes('1') && [
                    'border-t-1',
                    'border-slate-400',
                    'pt-6',
                    'md:pt-8',
                  ],
              )}
            >
              {title && (
                <Heading level={title.level} className="pb-4">
                  {z(title.text)}
                </Heading>
              )}
              {intro && (
                <Paragraph className="pb-4 md:pb-8">{z(intro)}</Paragraph>
              )}
              {content.map(
                ({ contentTitle, component, contentNode, expandable }, j) => {
                  if (component) {
                    try {
                      const {
                        Component,
                        variant,
                        className,
                        headingClassName,
                      } = getComponent(component);
                      return (
                        <Component
                          key={`${id}-${j}-content-card`}
                          title={z(contentTitle)}
                          headingColor={expandable ? 'text-blue-700' : null}
                          variant={variant}
                          className={className}
                          headingClassName={headingClassName}
                        >
                          {contentNode && z(contentNode)}

                          {expandable && (
                            <ExpandableSection
                              title={z(data.sections.labelClosed)}
                              closedTitle={z(data.sections.labelOpen)}
                              contentTestClassName="pt-4"
                            >
                              <ExpandableContentSection
                                expandableData={expandable}
                              />
                            </ExpandableSection>
                          )}
                        </Component>
                      );
                    } catch (error) {
                      console.error(error);
                    }
                  }
                  return <>{content}</>;
                },
              )}
            </div>
          );
        }
      })}
    </>
  );
};

type ExtraContentProps = {
  hrefTarget: string;
};

export const ExtraContent = ({ hrefTarget }: ExtraContentProps) => {
  const { z } = useTranslation();

  return (
    <div className="max-w-[950px] border-t-1 border-slate-400 pt-6">
      <div className="t-have-you-tried max-w-[840px]">
        <H2 color="text-blue-700 pb-4">
          {z({
            en: 'Help applying for credit',
            cy: 'Help i wneud cais am gredyd',
          })}
        </H2>
        <Paragraph className="pb-8">
          {z({
            en: "After you've decided which option to go for, the next step is to apply. Here's how to avoid your application being refused, and what to do if it does happen.",
            cy: "Ar ôl i chi benderfynu pa opsiwn i fynd amdano, y cam nesaf yw gwneud cais. Dyma sut i osgoi i’ch cais gael ei wrthod, a beth i'w wneud os bydd hynny’n digwydd.",
          })}
        </Paragraph>
      </div>
      <TeaserCardContainer gridCols={2}>
        <TeaserCard
          title={z({
            en: 'How to apply for credit',
            cy: 'Sut i wneud cais am gredyd',
          })}
          href={z({
            en: 'https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score#applying-for-credit',
            cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/credit/how-to-improve-your-credit-score#applying-for-credit',
          })}
          hrefTarget={hrefTarget}
          image={coffee}
          description={z({
            en: "Before you apply, use an eligibility calculator to see if you're likely to be accepted. This is so it won't show up on your credit file.",
            cy: 'Cyn i chi wneud cais, defnyddiwch gyfrifiannell cymhwysedd i weld a ydych yn debygol o gael eich derbyn. Mae hyn er mwyn iddo beidio ymddangos ar eich ffeil credyd.',
          })}
        />
        <TeaserCard
          title={z({
            en: "What to do when you've been refused credit",
            cy: "Beth i'w wneud os yw credyd wedi cael ei wrthod i chi",
          })}
          href={z({
            en: 'https://www.moneyhelper.org.uk/en/everyday-money/credit/when-youve-been-refused-credit',
            cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/credit/when-youve-been-refused-credit',
          })}
          hrefTarget={hrefTarget}
          image={child}
          description={z({
            en: "If you've been turned down for credit, like a loan, overdraft or credit card, this tool will give you an action plan to improve your chances of being accepted.",
            cy: 'Os ydych wedi cael eich gwrthod am gredyd, fel benthyciad, gorddrafft neu gerdyn credyd, bydd yn rhoi cynllun gweithredu i chi i wella eich siawns o gael eich derbyn.',
          })}
        />
      </TeaserCardContainer>
    </div>
  );
};

const NoResultsMainContent = ({
  content,
  strugglingWithDebt,
}: {
  content: ReactNode;
  strugglingWithDebt: Section[];
}) => {
  return (
    <div className="space-y-8" id="no-results">
      {content}
      <MainContent validatedData={strugglingWithDebt} noResults={true} />
    </div>
  );
};

const CreditOptionsResult = ({ storedData, isEmbed, links }: Props) => {
  const { z } = useTranslation();
  const heading = z(data.title);
  const intro = z(data.intro);
  const noResultsIntro = z(data.noResultsIntro);
  const noResultsMainContent = z(data.noResultMainContent);
  const { addPage } = useAnalytics();

  const resultsAnalyticsData = (event: string) => {
    return {
      page: {
        pageName: 'credit-options--results',
        pageTitle: z({
          en: 'Borrowing options to consider',
          cy: "Opsiynau benthyca i'w hystyried",
        }),
        categoryLevels: ['Everyday money', 'Credit'],
      },
      tool: {
        toolName: 'Credit Options',
        toolStep: 8,
        stepName: 'Borrowing options to consider',
      },
      event: event,
    };
  };

  addPage([
    resultsAnalyticsData('pageLoadReact'),
    resultsAnalyticsData('toolCompletion'),
  ]);

  const validData = data.sections?.section.flatMap((f) => {
    const validateContent = f.content.filter((c) => {
      if (c.conditions) {
        return checkCondition(c.conditions, storedData);
      }
      return false;
    });
    return { ...f, content: validateContent };
  });

  const hasNoResults = validData.slice(2, 5).every((section) => {
    return section.content.length === 0;
  });

  return (
    <CreditOptions step="result" isEmbed={isEmbed}>
      <>
        <Results
          heading={heading}
          intro={hasNoResults ? noResultsIntro : intro}
          mainContent={
            hasNoResults ? (
              <NoResultsMainContent
                content={noResultsMainContent}
                strugglingWithDebt={data?.sections?.section.filter(
                  (v) => v.id === '0',
                )}
              />
            ) : (
              <MainContent validatedData={validData} />
            )
          }
          extraContent={!hasNoResults && <ExtraContent hrefTarget="_top" />}
          backLink={links.result.backLink}
          firstStep={links.result.firstStep}
          mainContentContainerClass={'max-w-[950px]'}
          copyUrlText={
            !hasNoResults
              ? {
                  en: 'Copy your borrowing options link',
                  cy: 'Copïo dolen eich opsiynau benthyg',
                }
              : undefined
          }
          removeEmbedFromUrl={true}
        />
        <Container>
          <ToolFeedback className="max-w-[950px]" />
        </Container>
      </>
    </CreditOptions>
  );
};

export default CreditOptionsResult;

export const getServerSideProps = getServerSidePropsDefault;
