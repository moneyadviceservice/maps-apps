import { useEffect, useMemo } from 'react';

import { savingsCalculatorLandingAnalytics } from 'data/form-content/analytics/savings-calculator';
import { landingContent, pageData } from 'data/landing';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { Container } from '@maps-react/core/components/Container';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
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
      <H1 className="my-6 text-blue-700 md:mt-0">{title}</H1>

      {!isEmbed && (
        <BackLink
          href={`https://www.moneyhelper.org.uk/${lang}/savings/how-to-save/savings-calculator`}
        >
          {z({
            en: 'Back',
            cy: 'Yn ôl',
          })}
        </BackLink>
      )}

      <ToolIntro className="py-4 mt-4 mb-8 leading-normal md:text-2xl">
        {intro}
      </ToolIntro>
      <div className="grid grid-rows-1 mt-8">
        {action.map(({ actionLink, actionText, actionButton }, index) => (
          <div key={index}>
            <Paragraph className="inline-flex mb-8 text-2xl font-bold leading-normal text-gray-800 md:text-4xl">
              {actionText}
            </Paragraph>

            <Button
              className="mb-8 sm:max-w-fit"
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
