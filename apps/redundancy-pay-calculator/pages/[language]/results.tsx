import { differenceInYears } from 'date-fns';

import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { H2, InformationCallout } from '@maps-react/common/index';
import { Analytics } from '@maps-react/core/components/Analytics';
import { Results } from '@maps-react/form/components/Results';
import useLanguage from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { RedundancyPayCalculator } from '.';
import {
  AdditionalInfo,
  RedundancyForecast,
  ResultsBox,
  UsefulContacts,
} from '../../components/Results';
import { WhatToDo } from '../../components/Results/WhatToDo/WhatToDo';
import { redundancyPayCalculatorAnalytics } from '../../data/form-content/analytics';
import copy from '../../data/form-content/text/results';
import {
  calculateStatutoryRedundancyPay,
  getDateFromMY,
} from '../../utils/calculateStatutoryRedundancyPay';
import {
  ContractualRedundancyProvided,
  ParsedData,
  parseStoredData,
} from '../../utils/parseStoredData';

type Props = {
  storedData: DataFromQuery;
  links: ToolLinks;
  isEmbed: boolean;
};

type MainContentProps = {
  parsedData: ParsedData;
};

export const MainContent = ({ parsedData }: MainContentProps) => {
  if (
    undefined === parsedData.jobStart ||
    undefined === parsedData.jobEnd ||
    undefined === parsedData.dateOfBirth ||
    undefined === parsedData.salary ||
    undefined === parsedData.country ||
    undefined === parsedData.contractualRedundancy
  ) {
    return;
  }

  const jobStartDate = getDateFromMY(parsedData.jobStart);
  const jobEndDate = getDateFromMY(parsedData.jobEnd);

  const statutoryRedundancyPay = calculateStatutoryRedundancyPay({
    dateOfBirth: parsedData.dateOfBirth,
    salary: parsedData.salary,
    jobStart: parsedData.jobStart,
    jobEnd: parsedData.jobEnd,
    country: parsedData.country,
  });

  const yearsWorked = differenceInYears(jobEndDate, jobStartDate);
  const contractualRedundancyPay = parsedData.contractualRedundancy.amount;

  const redundancyPay = Math.max(
    contractualRedundancyPay,
    statutoryRedundancyPay.amount,
  );

  return (
    <div className="col-span-12">
      <AdditionalInfo
        parsedData={parsedData}
        statutoryRedundancyPay={statutoryRedundancyPay}
        yearsWorked={yearsWorked}
      />

      <div className="grid grid-cols-1 mt-8 lg:grid-cols-10 lg:gap-x-6 xl:grid-cols-8 lg:items-stretch">
        <div className="h-full lg:col-span-6 xl:col-span-5">
          <ResultsBox
            parsedData={parsedData}
            statutoryRedundancyPay={statutoryRedundancyPay}
            yearsWorked={yearsWorked}
          />
        </div>
        <div className="h-full lg:col-span-4 xl:col-span-3">
          <RedundancyForecast
            salary={parsedData.salary}
            redundancyPay={redundancyPay}
            country={parsedData.country}
          />
        </div>
      </div>
    </div>
  );
};

type ExtraContentProps = {
  parsedData: ParsedData;
};

export const ExtraContent = ({ parsedData }: ExtraContentProps) => {
  const { z } = useTranslation();
  const lang = useLanguage();

  if (
    undefined === parsedData.country ||
    undefined === parsedData.contractualRedundancy ||
    undefined === parsedData.jobEnd
  )
    return;

  const showAdditionalItem: boolean =
    (parsedData.contractualRedundancy.provided ===
      ContractualRedundancyProvided.Unknown &&
      parsedData.contractualRedundancy.amount === 0) ||
    parsedData.contractualRedundancy.amount > 30000;

  return (
    <div className="">
      <div className="mt-8">
        <hr className="border-slate-400" />
      </div>

      {/* Preparing for redundancy section */}
      <div className="mt-8">{z(copy.preparingForRedundancy)}</div>

      <div className="mt-8">
        <hr className="border-slate-400" />
      </div>

      {/* What to do section */}
      <div className="mt-8">
        <WhatToDo showAdditionalItem={showAdditionalItem} />
      </div>

      <div className="mt-8">
        <hr className="border-slate-400" />
      </div>

      <div className="mt-8">
        <UsefulContacts country={parsedData.country} />
      </div>

      {/* Last day checklist section */}
      <div className="mt-8">
        <H2 className="mb-8 md:text-5xl" color="text-blue-700">
          {z({ en: 'Last day checklist', cy: 'Rhestr wirio diwrnod olaf' })}
        </H2>
        <InformationCallout
          variant="default"
          testId=""
          className="flex flex-col h-full p-[24px]"
        >
          {z(copy.lastDayChecklist)}
        </InformationCallout>
      </div>

      <div className="mt-8">
        <hr className="border-slate-400" />
      </div>

      {/* Printed guide */}
      <div className="mt-8">{z(copy.printedGuide)}</div>

      {/* Tool Feedback Widget */}
      <ToolFeedback />
      <div className="mt-8">
        <hr className="border-slate-400" />
      </div>

      {/* Social Share Tool */}
      <div className="flex flex-col justify-between pt-8 print:hidden t-social-sharing md:flex-row">
        <SocialShareTool
          url={`https://www.moneyhelper.org.uk/${lang}/work/losing-your-job/redundancy-pay-calculator`}
          title={z({
            en: 'Share this tool',
            cy: 'Rhannwch yr offeryn hwn',
          })}
          subject={z({
            en: 'Redundancy pay calculator - Work out what you’re owed and the tax you’ll pay',
            cy: 'Cyfrifiannell tâl diswyddo – cyfrifwch faint sy’n ddyledus i chi a faint o dreth y byddwch yn ei thalu',
          })}
          withDivider={true}
          xTitle={z({
            en: 'Redundancy pay calculator - Work out what you’re owed and the tax you’ll pay',
            cy: 'Cyfrifiannell tâl diswyddo – cyfrifwch faint sy’n ddyledus i chi a faint o dreth y byddwch yn ei thalu',
          })}
        />
      </div>
    </div>
  );
};

const RedundancyPayCalculatorResult = ({
  storedData,
  isEmbed,
  links,
}: Props) => {
  const { z } = useTranslation();

  const heading = z(copy.title);

  const currentStep = 'results';
  const parsedData = parseStoredData(storedData);
  const analyticsData = redundancyPayCalculatorAnalytics(
    z,
    currentStep,
    parsedData,
  );

  return (
    <RedundancyPayCalculator step={currentStep} isEmbed={isEmbed}>
      <Analytics
        analyticsData={analyticsData}
        currentStep={currentStep}
        formData={parsedData}
        lastStep={'results'}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: false,
          toolCompletion: true,
          errorMessage: false,
          emptyToolCompletion: false,
        }}
      >
        <Results
          heading={heading}
          intro={undefined}
          mainContentClass="pt-0 pb-0"
          mainContentContainerClass="mb-0"
          mainContent={<MainContent parsedData={parsedData} />}
          extraContent={<ExtraContent parsedData={parsedData} />}
          backLink={links.result.backLink}
          firstStep={links.result.firstStep}
          copyUrlText={{
            en: 'Copy your results link',
            cy: 'Dolen i gopïo eich canlyniadau',
          }}
          layout="grid"
        />
      </Analytics>
    </RedundancyPayCalculator>
  );
};

export default RedundancyPayCalculatorResult;

export { getServerSidePropsDefault as getServerSideProps } from '.';
