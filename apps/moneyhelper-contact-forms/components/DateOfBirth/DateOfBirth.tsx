import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { getFieldError, safeT } from '@maps-react/mhf/utils';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { DOB, StepName } from '../../lib/constants';

export const DateOfBirth: StepComponent = ({ errors, entry, flow, step }) => {
  const { t } = useTranslation();
  // Define the content keys for generic and specific expandable section messages
  const genericKey = 'components.date-of-birth.expandable-section';
  const specificKey = `components.date-of-birth.expandable-section.${flow}`;

  // Fallback to generic content if specific content is not available
  const expandableContent =
    safeT(t, `${specificKey}.content`) ?? t(`${genericKey}.content`);

  const error = getFieldError('dates', errors)
    ? t('components.date-of-birth.form.generic.error')
    : undefined;
  const hint = t('components.date-of-birth.hint');
  const dayLabel = t('components.date-of-birth.form.day.label');
  const monthLabel = t('components.date-of-birth.form.month.label');
  const yearLabel = t('components.date-of-birth.form.year.label');
  const getAriaLabel = (label: string) => `${label.toLowerCase()}. ${hint}`;

  return (
    <FormWrapper
      className="pt-4 md:max-w-xl"
      nextStep={StepName.CONTACT_DETAILS}
      step={step}
      ariaLabel={t('components.date-of-birth.title')}
    >
      <Errors errors={error ? [{} as ErrorType] : []}>
        <Paragraph
          id="date-of-birth-hint"
          className="text-gray-650"
          data-testid="date-of-birth-hint"
        >
          {hint}
        </Paragraph>
        <TextInput type="hidden" error={error} />
      </Errors>
      <div className="flex gap-5 mb-2">
        <div className=" max-w-16">
          <TextInput
            id="day"
            name="day"
            type="number"
            data-testid="input-day"
            label={dayLabel}
            aria-label={getAriaLabel(dayLabel)}
            defaultValue={entry?.data?.day ?? ''}
            min={DOB.day.min}
            max={DOB.day.max}
            onKeyDown={dobInputHandlers.blockNegativeAndE}
            onInput={dobInputHandlers.sanitizeInput}
            hasGlassBoxClass={true}
            aria-describedby="date-of-birth-hint"
          />
        </div>
        <div className="max-w-16">
          <TextInput
            id="month"
            name="month"
            type="number"
            data-testid="input-month"
            label={monthLabel}
            aria-label={getAriaLabel(monthLabel)}
            defaultValue={entry?.data?.month ?? ''}
            min={DOB.month.min}
            max={DOB.month.max}
            onKeyDown={dobInputHandlers.blockNegativeAndE}
            onInput={dobInputHandlers.sanitizeInput}
            hasGlassBoxClass={true}
            aria-describedby="date-of-birth-hint"
          />
        </div>
        <div className="max-w-24">
          <TextInput
            id="year"
            name="year"
            type="number"
            data-testid="input-year"
            label={yearLabel}
            aria-label={getAriaLabel(yearLabel)}
            defaultValue={entry?.data?.year ?? ''}
            min={DOB.year.min}
            max={DOB.year.max}
            onKeyDown={dobInputHandlers.blockNegativeAndE}
            onInput={dobInputHandlers.sanitizeInput}
            hasGlassBoxClass={true}
            aria-describedby="date-of-birth-hint"
          />
        </div>
      </div>
      <ExpandableSection
        title={t('components.date-of-birth.expandable-section.title')}
      >
        <Markdown
          content={expandableContent}
          data-testid="date-of-birth-expandable-content"
        />
      </ExpandableSection>
    </FormWrapper>
  );
};

/**
 * Handlers for the date of birth input fields.
 * - `blockNegativeAndE`: Prevents negative numbers and scientific notation (e.g., 'e') in the input.
 * - `sanitizeInput`: Sanitizes the input to allow only digits.
 * Progressive enhancement is used to ensure for JS-enabled browsers, the input fields only accept valid numeric values.
 */
export const dobInputHandlers = {
  blockNegativeAndE(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  },
  sanitizeInput(event: React.FormEvent<HTMLInputElement>) {
    const element = event.currentTarget;
    element.value = element.value.replace(/[^\d]/g, '');
  },
};
