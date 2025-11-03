import Image from 'next/image';

import { Button, Heading, InformationCallout } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';
import { SectionsRenderer } from '../SectionsRenderer';
import { SubTitleRenderer } from '../SubTitleRenderer';

export const AboutDebt: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const sections = tList('components.about-debt.sections');

  return (
    <>
      <div className="flex flex-col gap-4">
        <SubTitleRenderer
          content={t('components.about-debt.sub-title')}
          testId="about-debt-sub-title"
        />
        <SectionsRenderer sections={sections} testIdPrefix="about-debt" />
        <InformationCallout className="flex flex-col justify-between gap-8 p-8 my-4 bg-teal-100 border-none md:flex-row">
          <div className="md:w-3/5">
            <Heading
              component="p"
              level="h4"
              className="mb-4"
              data-testid="about-debt-callout-title"
            >
              {t('components.about-debt.callout.title')}
            </Heading>
            <Button
              as="a"
              className="w-full my-4 md:w-auto "
              variant="secondary"
              href={t('components.about-debt.callout.button.url')}
              data-testid="about-debt-callout-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('components.about-debt.callout.button.text')}
            </Button>
          </div>
          <div>
            <Image
              src="/images/tool-Illustration-holder.png"
              className="mx-auto"
              alt="tool-Illustration-holder"
              data-testid="about-debt-callout-image"
              width={264}
              height={226}
            />
          </div>
        </InformationCallout>
        <Markdown
          className="mb-2"
          data-testid="about-debt-footer-content"
          content={t('components.about-debt.footer.content')}
        />
      </div>
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
