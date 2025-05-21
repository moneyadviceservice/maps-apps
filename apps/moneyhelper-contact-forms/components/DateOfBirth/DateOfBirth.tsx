import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { getFieldError, hasFieldError } from '../../lib/utils';

export const DateOfBirth: StepComponent = ({ errors, entry }) => {
  const { t, locale } = useTranslation();

  return (
    <>
      <H1 className="mb-4 text-blue-800" data-testid="date-of-birth-title">
        {t('components.date-of-birth.title')}
      </H1>
      <form action="/api/form-handler" method="POST" noValidate>
        <input type="hidden" name="lang" value={locale} />
        <Errors errors={hasFieldError(errors, 'dates')}>
          <Paragraph className="text-gray-400">
            {t('components.date-of-birth.intro')}
          </Paragraph>
          <TextInput
            type="hidden"
            error={
              getFieldError(errors, 'dates')
                ? t('components.date-of-birth.form.generic.error')
                : undefined
            }
          />
        </Errors>
        <div className="flex gap-5 mb-9">
          <div className=" max-w-16">
            <TextInput
              id="day"
              name="day"
              type="number"
              data-testid="input-day"
              label={t('components.date-of-birth.form.day.label')}
              defaultValue={entry?.data?.day ?? ''}
            />
          </div>
          <div className="max-w-16">
            <TextInput
              id="month"
              name="month"
              type="number"
              data-testid="input-month"
              label={t('components.date-of-birth.form.month.label')}
              defaultValue={entry?.data?.month ?? ''}
            />
          </div>
          <div className="max-w-24">
            <TextInput
              id="year"
              name="year"
              type="number"
              data-testid="input-year"
              label={t('components.date-of-birth.form.year.label')}
              defaultValue={entry?.data?.year ?? ''}
            />
          </div>
        </div>
        <ExpandableSection
          title={t('components.date-of-birth.expandable-section.title')}
        >
          <Paragraph>
            {t('components.date-of-birth.expandable-section.content')}{' '}
          </Paragraph>
        </ExpandableSection>
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </>
  );
};
