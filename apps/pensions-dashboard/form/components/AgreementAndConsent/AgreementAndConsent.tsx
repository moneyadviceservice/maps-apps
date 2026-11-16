import { useTranslation } from '@maps-digital/shared/hooks';
import { ListElement } from '@maps-digital/shared/ui';

import { Link } from '@maps-react/common/components/Link/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph/Paragraph';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { FORM_BASE_PATH, FormFieldName, StepName } from '../../constants';

export const AgreementAndConsent: StepComponent = ({ step }) => {
  const { t, tList, locale } = useTranslation();
  const contentKey = `${FORM_BASE_PATH}/components.${step}`;
  const listItems = tList(`${contentKey}.listItems`);

  return (
    <>
      <section className="flex flex-col gap-4" data-testid={`${step}-section`}>
        <Paragraph
          className="mb-2 md:mb-8"
          data-testid={`${step}-intro-paragraph`}
        >
          {t(`${contentKey}.intro-paragraph`)}
        </Paragraph>

        <ListElement
          items={listItems.map((item: string, itemIdx: number) => (
            <Markdown
              key={itemIdx}
              content={item}
              testId={`${step}-item-${itemIdx}`}
            />
          ))}
          variant="unordered"
          color="blue"
          className="mb-2 ml-10"
          dataTestId={`${step}-list`}
        />
      </section>

      <div className="mt-4 md:flex md:flex-row md:items-center md:gap-4">
        <FormWrapper
          step={step}
          nextStep={StepName.ABOUT_YOU}
          className="pt-0 md:pt-0"
        >
          {/* Pass so we know the user has accepted the terms and conditions - enters the form flow */}
          <input
            type="hidden"
            name={FormFieldName.TERMS_AND_CONDITIONS}
            value="true"
          />
        </FormWrapper>
        <Link
          asButtonVariant="secondary"
          href={`/${locale}/${FORM_BASE_PATH}/decline`}
          className="inline-block max-md:w-full max-md:text-center md:mt-8 max-md:mb-8"
        >
          {t(`${contentKey}.exit-link.text`)}
        </Link>
      </div>
    </>
  );
};
