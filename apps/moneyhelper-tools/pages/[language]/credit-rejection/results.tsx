import { useState, MouseEvent } from 'react';
import { CreditRejection, getServerSidePropsDefault } from '.';
import { Results } from 'components/Results';
import data from 'data/form-content/results/credit-rejection';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { TeaserCard } from 'components/TeaserCard';
import { TeaserCardContainer } from 'components/TeaserCardContainer';
import { H2, Paragraph, ExpandableSection } from '@maps-digital/shared/ui';
import bubbles from 'public/images/bubbles.jpg';
import child from 'public/images/child.jpg';
import { checkCondition } from 'utils/ResultCheckCondition';
import { useAnalytics } from 'hooks/useAnalytics';
import { DataFromQuery } from 'utils/pageFilter';
import { ToolLinks } from 'utils/getToolLinks';

type Props = {
  storedData: DataFromQuery;
  lang: string;
  links: ToolLinks;
  isEmbed: boolean;
};

export const MainContent = ({ storedData }: DataFromQuery) => {
  const { z } = useTranslation();

  const [openID, setOpenID] = useState('');

  const handleOnClick = (id: string, event: MouseEvent) => {
    event.preventDefault();
    setOpenID(id === openID ? '' : id);
  };

  return (
    <>
      {data.tiles.map(({ id, title, content, conditions }) => {
        if (!conditions || checkCondition(conditions, storedData)) {
          return (
            <div key={title.en}>
              <ExpandableSection
                title={z(title)}
                variant="mainLeftIcon"
                open={openID === id}
                onClick={(event: MouseEvent<HTMLButtonElement>) =>
                  handleOnClick(id, event)
                }
                contentTestClassName="text-gray-800"
              >
                <div className="mb-8">{z(content)}</div>
              </ExpandableSection>
            </div>
          );
        }
      })}
    </>
  );
};

type ExtraContentProps = {
  hrefTarget: string;
  lang: string;
};

export const ExtraContent = ({ hrefTarget, lang }: ExtraContentProps) => {
  const { z } = useTranslation();

  return (
    <>
      <div className="t-have-you-tried">
        <H2 color="text-blue-800 pb-4">
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
    </>
  );
};

const CreditRejectionResult = ({ storedData, isEmbed, lang, links }: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();

  addPage([
    {
      page: {
        pageName: 'Credit Rejection',
        pageTitle: "What to do when you've been refused credit",
      },
      tool: {
        toolName: 'Credit Rejection',
        toolStep: 'result',
        stepName: 'Your action plan',
      },
      event: 'pageLoadReact',
    },
    {
      page: {
        pageName: 'Credit Rejection',
        pageTitle: "What to do when you've been refused credit",
      },
      tool: {
        toolName: 'Credit Rejection',
        toolStep: 'result',
        stepName: 'Your action plan',
      },
      event: 'toolCompletion',
    },
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
      />
    </CreditRejection>
  );
};

export default CreditRejectionResult;

export const getServerSideProps = getServerSidePropsDefault;
