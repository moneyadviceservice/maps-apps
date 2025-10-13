import { MouseEvent, useState } from 'react';

import data from 'data/results';
import bubbles from 'public/teaser-card-images/bubbles.jpg';
import child from 'public/teaser-card-images/child.jpg';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Results } from '@maps-react/form/components/Results';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { checkCondition } from '@maps-react/utils/checkCondition';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { CreditRejection, getServerSidePropsDefault } from '.';

type Props = {
  storedData: DataFromQuery;
  lang: string;
  links: ToolLinks;
  isEmbed: boolean;
};

export const MainContent = ({ storedData }: DataFromQuery) => {
  const { z } = useTranslation();

  const [openID, setOpenID] = useState('');
  const { addEvent } = useAnalytics();

  const handleOnClick = (id: string, event: MouseEvent, title: string) => {
    event.preventDefault();
    const isOpening = id !== openID;
    setOpenID(isOpening ? id : '');

    if (isOpening) {
      addEvent({
        event: 'actionPlanClicks',
        eventInfo: {
          actionPlan: title,
        },
      });
    }
  };

  return (
    <div>
      {data.tiles.map(({ id, title, content, conditions }) => {
        if (!conditions || checkCondition(conditions, storedData)) {
          return (
            <div key={title.en}>
              <ExpandableSection
                title={z(title)}
                variant="mainLeftIcon"
                open={openID === id}
                onClick={(event: MouseEvent) =>
                  handleOnClick(id, event, title.en)
                }
                contentTestClassName="text-gray-800"
              >
                <div className="mb-8">{z(content)}</div>
              </ExpandableSection>
            </div>
          );
        }
      })}
    </div>
  );
};

type ExtraContentProps = {
  hrefTarget: string;
  lang: string;
};

export const ExtraContent = ({ hrefTarget, lang }: ExtraContentProps) => {
  const { z } = useTranslation();

  const linkToLandingPage = `https://www.moneyhelper.org.uk/${lang}/everyday-money/credit/when-youve-been-refused-credit`;

  return (
    <div className="max-w-[840px]">
      <div className="t-have-you-tried">
        <H2 color="text-blue-700 pb-4">
          {z({ en: 'Useful tools', cy: 'Teclynnau defnyddiol' })}
        </H2>
        <Paragraph className="pb-8">
          {z({
            en: "After you've completed your action plan, these tools can help you boost your income and cut back on costs.",
            cy: "Ar ôl i chi gwblhau eich cynllun gweithredu, gall y teclynnau hyn eich helpu i roi hwb i'ch incwm a thorri'n ôl ar gostau.",
          })}
        </Paragraph>
      </div>
      <TeaserCardContainer gridCols={2}>
        <TeaserCard
          title={z({
            en: 'Benefits calculator',
            cy: 'Cyfrifiannell budd-daliadau',
          })}
          href={`https://www.moneyhelper.org.uk/${lang}/benefits/use-our-benefits-calculator`}
          hrefTarget={hrefTarget}
          image={bubbles}
          description={z({
            en: 'Use our Benefits calculator to quickly find out what you could be entitled to.',
            cy: 'Defnyddiwch ein Cyfrifiannell Budd-daliadau i ddarganfod yn gyflym beth y gallech fod â hawl iddo.',
          })}
        />
        <TeaserCard
          title={z({
            en: 'Budget planner',
            cy: 'Cynlluniwr Cyllideb',
          })}
          href={`https://www.moneyhelper.org.uk/${lang}/everyday-money/budgeting/budget-planner`}
          hrefTarget={hrefTarget}
          image={child}
          description={z({
            en: "Get in control of your household spending to help you see where your money's going.",
            cy: "Dechreuwch reoli eich gwariant cartref i'ch helpu i weld i ble mae'ch arian yn mynd.",
          })}
        />
      </TeaserCardContainer>
      <ToolFeedback />
      <div className="flex flex-col justify-between py-6 mt-8 border-t container-auto print:hidden t-social-sharing sm:flex-row border-slate-400">
        <SocialShareTool
          url={linkToLandingPage}
          title={z({
            en: 'Share this tool',
            cy: 'Rhannwch yr offeryn hwn',
          })}
          subject={z({
            en: 'What to do when you’ve been refused credit',
            cy: 'Beth i’w wneud pan fydd credyd yn cael ei wrthod i chi',
          })}
          xTitle={z({
            en: 'What to do when you’ve been refused credit',
            cy: 'Beth i’w wneud pan fydd credyd yn cael ei wrthod i chi',
          })}
        />
      </div>
    </div>
  );
};

const CreditRejectionResult = ({ storedData, isEmbed, lang, links }: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();

  const resultsAnalyticsData = (event: string) => {
    return {
      page: {
        pageName: 'credit-rejection--results',
        pageTitle: z({
          en: 'Personalised action plan',
          cy: 'Cynllun gweithredu personol',
        }),
        categoryLevels: ['Everyday money', 'Credit'],
      },
      tool: {
        toolName: 'Credit Rejection',
        toolStep: 10,
        stepName: 'Your action plan',
      },
      event: event,
    };
  };

  addPage([
    resultsAnalyticsData('pageLoadReact'),
    resultsAnalyticsData('toolCompletion'),
  ]);
  const heading = z(data.title);
  const intro = z(data.intro);

  return (
    <CreditRejection step="result" isEmbed={isEmbed}>
      <Results
        heading={heading}
        intro={intro}
        mainContent={<MainContent storedData={storedData} />}
        extraContent={<ExtraContent hrefTarget="_top" lang={lang} />}
        backLink={links.result.backLink}
        firstStep={links.result.firstStep}
        copyUrlText={{
          en: 'Copy your custom action plan link',
          cy: 'Copiwch ddolen eich cynllun gweithredu personol',
        }}
      />
    </CreditRejection>
  );
};

export default CreditRejectionResult;

export const getServerSideProps = getServerSidePropsDefault;
