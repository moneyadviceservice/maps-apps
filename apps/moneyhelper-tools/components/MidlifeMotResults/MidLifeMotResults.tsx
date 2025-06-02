import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import copy from 'copy-to-clipboard';
import { midLifeMotQuestions } from 'data/form-content/questions/mid-life-mot';
import {
  groups,
  resultsPageContent,
} from 'data/form-content/results/mid-life-mot';
import { Group, Links } from 'types';
import resultsFilter from 'utils/resultsFilter';

import BudgetingIcon from '@maps-react/common/assets/images/budgeting.svg';
import UnexpectedCostsIcon from '@maps-react/common/assets/images/costs.svg';
import EmergencySavingsIcon from '@maps-react/common/assets/images/emergency_savings.svg';
import EstatePlanningIcon from '@maps-react/common/assets/images/estate_planning.svg';
import RetirementAccommodationIcon from '@maps-react/common/assets/images/home.svg';
import IncomeProtectionIcon from '@maps-react/common/assets/images/income_protection.svg';
import LinkArrow from '@maps-react/common/assets/images/link-arrow.svg';
import RetirementPlanningIcon from '@maps-react/common/assets/images/planning.svg';
import PreventingDebtsIcon from '@maps-react/common/assets/images/preventing_debt.svg';
import NonEmergencySavingsIcon from '@maps-react/common/assets/images/savings.svg';
import { Button } from '@maps-react/common/components/Button';
import { H1, H4, H5, Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { StepContainer } from '@maps-react/form/components/StepContainer';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type Props = {
  storedData: DataFromQuery;
  backLink: string;
  firstStep: string;
};

export const MidLifeMotResults = ({
  storedData,
  backLink,
  firstStep,
}: Props) => {
  const [showCopyUrl, setShowCopyUrl] = useState(false);
  const router = useRouter();
  const { z } = useTranslation();
  const initialCopyButtonText = z({
    en: 'Copy your custom report link',
    cy: 'Copïwch eich dolen adroddiad personol',
  });
  const [copyButtonText, setCopyButtonText] = useState(initialCopyButtonText);
  const qs = midLifeMotQuestions(z);
  const gs = groups(z);
  const content = resultsPageContent(z);
  const groupWithScores = resultsFilter(qs, storedData).filterGroupData();
  const copyButtonRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setShowCopyUrl(true);
  }, [showCopyUrl]);

  const getListOfNextSteps = (list: any, type: string, question: Group) => {
    const listByType = list[question.group]?.links?.filter(
      (t: { type: string }) => t.type === type.trim(),
    );

    return listByType.map((i: Links, n: number) => {
      return (
        <Paragraph key={n}>
          <Link href={i.link} target="_blank" withIcon={false}>
            {i.title}
          </Link>{' '}
          {i.description}
        </Paragraph>
      );
    });
  };

  const signpostLinks = [
    {
      link: z({
        en: 'https://jobhelp.campaign.gov.uk/midlifemot/your-work/',
        cy: 'https://jobhelp.campaign.gov.uk/cymraeg/midlifemot/your-work/',
      }),
      title: z({
        en: 'Midlife MOT: Your work',
        cy: 'MOT Canol Oes: Eich gwaith',
      }),
    },
    {
      link: z({
        en: 'https://jobhelp.campaign.gov.uk/midlifemot/your-health/',
        cy: 'https://jobhelp.campaign.gov.uk/cymraeg/midlifemot/your-health/',
      }),
      title: z({
        en: 'Midlife MOT: Your health',
        cy: 'MOT Canol Oes: Eich iechyd',
      }),
    },
  ];

  const signpostItems = () => {
    return signpostLinks.map(({ title, link }, i) => {
      return (
        <Paragraph key={`signpost-${i}`} className={'mb-8'}>
          <Link href={link} target="_blank" withIcon={false}>
            {title} <LinkArrow />
          </Link>
        </Paragraph>
      );
    });
  };

  const groupInformationCallout = (groupLinks: any, group: number) => {
    return (
      <>
        {gs.map((item, index) => {
          if (!groupLinks[item.group]) return null;

          const articles = getListOfNextSteps(groupLinks, 'article', item);
          const tools = getListOfNextSteps(groupLinks, 'tool', item);

          return (
            <InformationCallout key={index}>
              <div className="px-6 pt-6 pb-10">
                {renderHeader(item)}
                {renderDescription(item, group)}
                {renderNextSteps(articles, tools)}
              </div>
            </InformationCallout>
          );
        })}
      </>
    );
  };

  const renderHeader = (item: any) => {
    const Icon = getIconByGroup(item.group);
    return (
      <div className="flex items-center mb-4">
        <span className="mr-4">
          <Icon />
        </span>
        <H5>{item.title}</H5>
      </div>
    );
  };

  const getIconByGroup = (group: string) => {
    const iconMap: { [key: string]: React.ComponentType } = {
      'preventing-debts': PreventingDebtsIcon,
      budgeting: BudgetingIcon,
      'estate-planning': EstatePlanningIcon,
      'emergency-savings': EmergencySavingsIcon,
      'unexpected-costs': UnexpectedCostsIcon,
      'income-protection': IncomeProtectionIcon,
      'retirement-planning': RetirementPlanningIcon,
      'retirement-accomodation-planning': RetirementAccommodationIcon,
    };
    return iconMap[group] || NonEmergencySavingsIcon;
  };

  const renderDescription = (item: any, group: number) => {
    const description =
      group === 1
        ? item.descritionScoreOne
        : group === 2
        ? item.descritionScoreTwo
        : item.descritionScoreThree;

    return <Paragraph className="mb-6">{description}</Paragraph>;
  };

  const renderNextSteps = (articles: any[], tools: any[]) => {
    if (articles.length === 0 && tools.length === 0) return null;

    return (
      <div className="space-y-4">
        <Heading level="h6" color="text-blue-800">
          {z({ en: 'Next steps', cy: 'Y camau nesaf' })}
        </Heading>
        {articles.length > 0 && renderList(articles, 'Articles', 'Erthyglau')}
        {tools.length > 0 && renderList(tools, 'Tools', 'Teclynnau')}
      </div>
    );
  };

  const renderList = (items: any[], enTitle: string, cyTitle: string) => {
    return (
      <div>
        <p className="pb-2 text-base font-bold text-gray-800">
          {z({ en: enTitle, cy: cyTitle })}
        </p>
        <ListElement
          items={items}
          variant="unordered"
          className="ml-7"
          color="blue"
        />
      </div>
    );
  };

  const handleCopyButtonText = () => {
    const timeout = window.setTimeout(() => {
      setCopyButtonText(initialCopyButtonText);
    }, 3000);

    setCopyButtonText(
      z({
        en: 'Link copied!',
        cy: `Dolen wedi'i chopïo!`,
      }),
    );
    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    if (copyButtonRef.current) {
      copyButtonRef.current.focus();
    }
  }, [copyButtonText]);
  return (
    <>
      <StepContainer backLink={backLink}>
        <div
          className="mt-8 space-y-8"
          data-testid="midlife-mot-results-page-heading"
        >
          <H1>{content.title}</H1>
          <Paragraph
            className="max-w-[840px]"
            data-testid="midlife-mot-results-page-description"
          >
            {content.description}
          </Paragraph>
          <div className="flex flex-col-reverse sm:flex-col">
            <div className="flex flex-col gap-4 pb-10 sm:flex-row">
              <form method="post">
                <input
                  type="hidden"
                  name="language"
                  value={router.query.language}
                />
                <input
                  type="hidden"
                  name="data"
                  value={JSON.stringify(groupWithScores)}
                />
                <input
                  type="hidden"
                  name="content"
                  value={JSON.stringify(content)}
                />
                <input type="hidden" name="groups" value={JSON.stringify(gs)} />
                <Button
                  formAction="/api/mid-life-mot/create-pdf-report"
                  variant="primary"
                  className="w-full"
                >
                  {z({
                    en: 'Download your report (PDF)',
                    cy: 'Lawrlwythwch eich adroddiad (PDF)',
                  })}
                </Button>
              </form>

              {!showCopyUrl && (
                <div>
                  To print the page press cmd and <br /> P in your keyboard
                </div>
              )}

              {showCopyUrl && (
                <Button
                  variant="primary"
                  onClick={(e) => {
                    copy(window.location.href);
                    handleCopyButtonText();
                  }}
                >
                  {copyButtonText}
                </Button>
              )}

              <Button as="a" variant="secondary" href={firstStep}>
                <span className="block w-full text-center">
                  {z({ en: 'Start again', cy: 'Dechrau eto' })}
                </span>
              </Button>
            </div>

            <div className="border-t border-slate-400">
              {/* what to focus on section */}
              {Object.keys(groupWithScores.highRiskGroup).length > 0 && (
                <div className="pt-8 pb-8 space-y-4 border-b border-slate-400">
                  <ListElement
                    variant="arrow"
                    className="list-outside marker:text-4xl marker:font-bold ml-3.5 mb-2"
                    color="blue"
                    items={[content.focusOnTitle]}
                  ></ListElement>
                  <Paragraph className="mt-5">
                    {content.focusOnDescription}
                  </Paragraph>
                  <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
                    {groupInformationCallout(groupWithScores.highRiskGroup, 1)}
                  </div>
                </div>
              )}

              {/* what to build on section */}
              {Object.keys(groupWithScores.mediumRiskGroup).length > 0 && (
                <div className="py-8 border-b border-slate-400">
                  <ListElement
                    variant="arrow"
                    className="list-outside marker:text-4xl marker:font-bold ml-3.5 mb-1"
                    color="blue"
                    start={2}
                    items={[content.buildOnTitle]}
                  ></ListElement>
                  <Paragraph className="mt-5">
                    {content.buidlOnDescription}
                  </Paragraph>
                  <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
                    {groupInformationCallout(
                      groupWithScores.mediumRiskGroup,
                      2,
                    )}
                  </div>
                </div>
              )}

              {/* what to keep doing section */}
              {Object.keys(groupWithScores.lowRiskGroup).length > 0 && (
                <div className="py-8 border-b border-slate-400">
                  <ListElement
                    variant="arrow"
                    className="list-outside marker:text-4xl marker:font-bold ml-3.5 mb-1"
                    color="blue"
                    start={3}
                    items={[content.keepGoingTitle]}
                  ></ListElement>
                  <Paragraph className="mt-5">
                    {content.keepGoingDescription}
                  </Paragraph>
                  <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
                    {groupInformationCallout(groupWithScores.lowRiskGroup, 3)}
                  </div>
                </div>
              )}

              {/* signposting section */}
              <div className="grid pt-8 lg:w-8/12">
                <H4>
                  {z({
                    en: 'Finished your Money Midlife MOT?',
                    cy: 'Wedi gorffen eich MOT Canol Oes Arian?',
                  })}
                  <br />
                  {z({
                    en: "See how you're doing with your work and health",
                    cy: "Gwelwch sut rydych chi'n dod ymlaen gyda'ch gwaith a'ch iechyd",
                  })}
                </H4>
                <Paragraph className="mt-8">
                  {z({
                    en: 'The government-backed support hub for people aged 45 to 65 has tools and charity resources to help you start thinking about your work and health with future planning in mind.',
                    cy: "Mae gan hwb cefnogaeth a gefnogir gan y llywodraeth ar gyfer pobl 45 i 65 oed declynnau ac adnoddau elusennol i'ch helpu i ddechrau meddwl am eich gwaith a'ch iechyd gyda chynllunio ar gyfer y dyfodol mewn golwg.",
                  })}
                </Paragraph>
                <ListElement
                  items={signpostItems()}
                  variant="unordered"
                  className="mt-8 ml-7"
                  color="blue"
                />
              </div>
            </div>
          </div>
        </div>
      </StepContainer>
      <ToolFeedback className="container-auto" />
    </>
  );
};
