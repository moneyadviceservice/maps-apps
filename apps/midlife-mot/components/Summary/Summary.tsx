import Link from 'next/link';

import {
  groups,
  resultsPageContent,
} from 'data/form-content/results/mid-life-mot';
import resultsFilter from 'utils/resultsFilter';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { H2, H5 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { StepContainer } from '@maps-react/form/components/StepContainer';
import { Question } from '@maps-react/form/types';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type Props = {
  storedData: DataFromQuery;
  questions: Question[];
  backLink: string;
  nextLink: string;
  isEmbed: boolean;
};

type GroupLink = {
  title: string;
};

type GroupLinks = {
  [key: string]: GroupLink | undefined;
};

export const Summary = ({
  storedData,
  questions,
  backLink,
  nextLink,
  isEmbed,
}: Props) => {
  const { z } = useTranslation();
  const qs = questions;
  const gs = groups(z);
  const content = resultsPageContent(z);
  const groupWithScores = resultsFilter(qs, storedData).filterGroupData();
  const { addPage } = useAnalytics();

  addPage([
    {
      page: {
        pageName: 'midlife-mot--summary',
        pageTitle: z({
          en: 'Summary',
          cy: 'Crynodeb',
        }),
      },
      tool: {
        toolName: 'Midlife MOT',
        toolStep: 20,
        stepName: 'Summary of your results',
      },
      event: 'pageLoadReact',
    },
  ]);

  const groupInformationList = (
    title: string,
    groupLinks: GroupLinks,
    variant: CalloutVariant | undefined,
  ) => {
    const filtered = gs.filter((i) => !!groupLinks[i.group]);
    const color =
      variant === CalloutVariant.INFORMATION_MAGENTA
        ? 'pink'
        : variant === CalloutVariant.DEFAULT
        ? 'dark'
        : 'teal';

    return (
      <Callout variant={variant} className="bg-gray-100 pl-7 t-teaser">
        <div className="pl-1">
          <H5>{title}</H5>
          <div className="pl-4 mt-[21px]">
            <ListElement
              color={color}
              variant="unordered"
              className="space-y-2 text-gray-800"
              items={filtered.map((i) => (
                <>{groupLinks[i.group] && i.title}</>
              ))}
            ></ListElement>
          </div>
        </div>
      </Callout>
    );
  };

  return (
    <StepContainer backLink={backLink} isEmbed={isEmbed}>
      <div className="space-y-10 lg:max-w-[840px] mt-10">
        <H2>
          {z({
            en: 'Summary of your results',
            cy: 'Crynodeb o’ch canlyniadau',
          })}
        </H2>
        <Paragraph>
          {z({
            en: 'Congratulations on completing this tool. Here’s a summary of what to focus on, what to build on and what to keep doing for your financial wellbeing.',
            cy: 'Llongyfarchiadau am gwblhau’r teclyn hwn. Dyma grynodeb o beth i ganolbwyntio arno, beth i adeiladu arno a beth i barhau i’w wneud ar gyfer eich lles ariannol.',
          })}
        </Paragraph>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* what to focus on section */}
            {Object.keys(groupWithScores.highRiskGroup).length > 0 && (
              <>
                {groupInformationList(
                  content.focusOnTitle,
                  groupWithScores.highRiskGroup,
                  CalloutVariant.INFORMATION_MAGENTA,
                )}
              </>
            )}

            {/* what to build on section */}
            {Object.keys(groupWithScores.mediumRiskGroup).length > 0 && (
              <>
                {groupInformationList(
                  content.buildOnTitle,
                  groupWithScores.mediumRiskGroup,
                  CalloutVariant.INFORMATION_TEAL,
                )}
              </>
            )}

            {/* what to keep doing section */}
            {Object.keys(groupWithScores.lowRiskGroup).length > 0 && (
              <>
                {groupInformationList(
                  content.keepGoingTitle,
                  groupWithScores.lowRiskGroup,
                  CalloutVariant.INFORMATION,
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <Link
            href={nextLink}
            data-testid="get-your-personalised-report"
            className="w-full text-center block md:w-auto md:inline-flex  justify-between  border-0 text-white bg-magenta-500 hover:bg-pink-800 hover:shadow-none hover:text-white active:bg-pink-900 active:outline-yellow-400 active:text-white t-button px-3 py-2 font-semibold rounded outline-none shadow-bottom-gray gap-2 cursor-pointer focus:bg-yellow-400 focus:outline-purple-700 focus:outline-[3px] focus:outline-offset-0 focus:text-gray-800 focus:shadow-none active:shadow-none active:outline-[3px] active:outline-offset-0 t-primary-button"
          >
            {z({
              en: 'Get Your Personalised Report',
              cy: 'Cael eich adroddiad personol',
            })}
          </Link>
        </div>
      </div>
    </StepContainer>
  );
};
