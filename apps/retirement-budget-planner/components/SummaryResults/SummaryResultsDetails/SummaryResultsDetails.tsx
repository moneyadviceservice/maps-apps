import { Button } from '@maps-react/common/components/Button';
import { H4, Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { SummaryResultsCalloutNotice } from '../SummaryResultsCalloutNotice';

export const SummaryResultsDetails = () => {
  const { t, tList } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Heading overview */}
      <Heading component="h2" level="h3" fontWeight="font-normal">
        <Markdown content={t('summaryPage.heading')} disableParagraphs />
      </Heading>

      {/* Tax rates disclaimer */}
      <Markdown
        content={t('summaryPage.disclaimer.taxRates')}
        className="text-2xl"
      />

      {/* Already retired disclaimer */}
      <Markdown
        content={t('summaryPage.disclaimer.alreadyRetired')}
        className="text-base"
      />

      {/* Income vs costs callout */}
      <SummaryResultsCalloutNotice
        title={t('summaryPage.incomeCallout.costsLowerThanIncome.title')}
        content={t('summaryPage.incomeCallout.costsLowerThanIncome.content')}
      />
      <SummaryResultsCalloutNotice
        title={t('summaryPage.incomeCallout.costsHigherThanIncome.title')}
        content={t('summaryPage.incomeCallout.costsHigherThanIncome.content')}
      />

      {/* Chart and total estimate */}
      <InformationCallout
        variant="withDominantBorder"
        className="p-4 space-y-5 border-teal-400"
      >
        <Heading component="h2" level="h2" className="text-blue-700">
          {t('summaryPage.chart.title')}
        </Heading>
        <Markdown
          content={t('summaryPage.chart.description')}
          className="text-base"
        />

        <div className="grid w-full aspect-square bg-gray-95 place-items-center">
          [CHART PLACEHOLDER]
        </div>
      </InformationCallout>

      {/* Extra callouts */}
      <div>
        <H4 className="mb-8">
          <Markdown
            content={t('summaryPage.retirementCallout.lifeExpectancy.title')}
            disableParagraphs
          />
        </H4>
        <Markdown
          content={t('summaryPage.retirementCallout.lifeExpectancy.content')}
          className="text-base"
        />
      </div>
      <div>
        <H4 className="mb-8">
          {t('summaryPage.retirementCallout.statePensionAge.title')}
        </H4>
        <Markdown
          content={t('summaryPage.retirementCallout.statePensionAge.content')}
          className="text-base"
        />
        <ListElement
          variant="unordered"
          color="dark"
          items={tList(
            'summaryPage.retirementCallout.statePensionAge.listItems',
          ).map((listItem: string) => listItem)}
          className="pl-8 mt-2 space-y-4 text-base"
        />
      </div>

      {/* Next steps */}
      <SummaryResultsCalloutNotice
        title={t('summaryPage.nextStepsCallout.genderGap.title')}
        content={t('summaryPage.nextStepsCallout.genderGap.content')}
      />

      {/* Buttons */}
      <div className="flex flex-col justify-start gap-12 pt-8 md:flex-row">
        <Button
          variant="primary"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          {t('summaryPage.cta.save')}
        </Button>
        <Button
          variant="secondary"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          {t('summaryPage.cta.restart')}
        </Button>
      </div>
    </div>
  );
};
