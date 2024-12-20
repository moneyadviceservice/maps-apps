import { useEffect, useMemo } from 'react';

import { savingsCalculatorLandingAnalytics } from 'data/form-content/analytics/savings-calculator';
import { landingContent, pageData } from 'data/savings-calculator/landing';
import { useAnalytics } from 'hooks/useAnalytics';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

type Props = {
  lang: string;
  isEmbed: boolean;
};

const SavingsCalculatorLanding = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();
  const { addEvent } = useAnalytics();
  const { title, intro, action } = landingContent(z);
  const page = pageData(z);

  const analyticsData = useMemo(() => {
    return {
      event: 'pageLoadReact',
      page: {
        pageName: savingsCalculatorLandingAnalytics?.pageName,
        pageTitle: page.title,
        lang: lang,
        categoryLevels: savingsCalculatorLandingAnalytics?.categoryLevels,
        pageType: 'tool page',
      },
      tool: {
        toolName: savingsCalculatorLandingAnalytics?.toolName,
        toolStep: '',
        stepName: '',
      },
    };
  }, [lang, page]);

  useEffect(() => {
    addEvent(analyticsData);
  }, [addEvent, analyticsData]);

  return (
    <Container className="lg:container-auto lg:max-w-[865px]">
      <H1 className="text-blue-800 mt-6 md:mt-0">{title}</H1>

      <ToolIntro className="my-8 py-4 md:text-2xl leading-normal">
        {intro}
      </ToolIntro>
      <div className="grid grid-rows-1 mt-8">
        {action.map(({ actionLink, actionText, actionButton }, index) => (
          <div key={index}>
            <Paragraph className="text-2xl md:text-4xl leading-normal font-bold text-gray-800 inline-flex mb-8">
              {actionText}
            </Paragraph>

            <Button
              className="sm:max-w-fit mb-8"
              as="a"
              href={`/${lang}${actionLink}${addEmbedQuery(!!isEmbed, '?')}`}
            >
              {actionButton}
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default SavingsCalculatorLanding;
