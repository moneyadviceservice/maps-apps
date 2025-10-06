import { SUBMIT_ANSWER_API } from 'CONSTANTS';
import { landingContent } from 'data/landing';
import { useDueDateValidation } from 'hooks/useDueDateValidation';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';
import { DateInput } from '@maps-react/form/components/DateInput';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type Props = {
  lang: string;
  queryData: DataFromQuery;
  isEmbed: boolean;
};

const BabyMoneyTimelineLanding = ({ lang, isEmbed, queryData = {} }: Props) => {
  const { z } = useTranslation();
  const { intro } = landingContent(z);

  const { dueDate, defaultDueDate, validation, errors } =
    useDueDateValidation(queryData);

  const hintTextDate = defaultDueDate.split('-').join(' ');

  return (
    <Container className="-mt-4">
      <div className="lg:max-w-[860px]">
        {!isEmbed && (
          <Link
            href={`https://www.moneyhelper.org.uk/${lang}/family-and-care/becoming-a-parent/baby-money-timeline`}
          >
            <Icon type={IconType.CHEVRON_LEFT} />
            {z({ en: 'Back', cy: 'Yn ôl' })}
          </Link>
        )}
        <ErrorSummary
          title={z({
            en: 'There is a problem',
            cy: 'Mae yna broblem',
          })}
          errors={{ dueDate: errors.map((error) => error.message) }}
          classNames="my-8"
        />

        <div className="mt-8">{intro}</div>

        <form action={SUBMIT_ANSWER_API} method="POST" id="baby-money-timeline">
          <input type="hidden" name="language" value={lang} />
          {isEmbed && <input type="hidden" name="isEmbedded" value="true" />}
          <fieldset className="flex flex-wrap gap-6 my-8" role="group">
            <Errors errors={errors} testId="error-dueDate" id="dueDate">
              {errors?.length > 0 && (
                <p className="mt-2 text-red-600" role="alert">
                  {errors[0].message}
                </p>
              )}
              <DateInput
                showDayField={true}
                legend={z({
                  en: 'What is your baby’s due date?',
                  cy: 'Beth yw dyddiad disgwyl eich babi?',
                })}
                hintText={
                  errors && Object.keys(errors).length > 0
                    ? z({
                        en: `For example, ${hintTextDate}`,
                        cy: `Er enghraifft, ${hintTextDate}`,
                      })
                    : undefined
                }
                defaultValues={dueDate}
                fieldErrors={validation.fieldErrors}
              />
            </Errors>
          </fieldset>

          <Button
            className="md:my-8"
            variant="primary"
            id="continue"
            type="submit"
          >
            {z({ en: 'Continue', cy: 'Parhau' })}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default BabyMoneyTimelineLanding;
