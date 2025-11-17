import { Link } from '@maps-react/common/components/Link';
import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

export const guaranteedIncomeEstimatorQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [potInput(1, z), ageInput(2, z)];
};

const potInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'pot',
    title: z({
      en: 'How much is in your pot?',
      cy: 'Faint sydd yn eich cronfa?',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      invalid: z({
        en: 'Use numbers only',
        cy: 'Defnyddiwch rifau yn unig',
      }),
      min: z({
        en: 'Amount must be at least £1',
        cy: `Mae'n rhaid i'r swm fod o leiaf £1`,
      }),
    },
  };
};

const ageInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'NumberInput',
    answers: [],
    type: 'age',
    title: z({
      en: 'What age do you want to take your money?',
      cy: 'Pa oedran ydych chi eisiau cymryd eich arian?',
    }),
    errors: {
      required: z({
        en: 'Enter a figure',
        cy: 'Rhowch ffigwr',
      }),
      max: z({
        en: 'you can compare annuities on the MoneyHelper website',
        cy: `gallwch gymharu blwydd-daliadau ar y Gwefan HelpwrArian`,
      }),
      maxHTML: z({
        en: (
          <>
            <p className="inline">
              You must be aged 55 to 75 - you can compare annuities on the
            </p>{' '}
            <Link
              asInlineText
              target="_blank"
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/compare-annuities"
            >
              MoneyHelper website
            </Link>
          </>
        ),
        cy: (
          <>
            <p className="inline">
              Mae{"'"}n rhaid i chi fod yn 55 i 75 oed - gallwch gymharu
              blwydd-daliadau ar y
            </p>{' '}
            <Link
              asInlineText
              target="_blank"
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/compare-annuities"
            >
              Gwefan HelpwrArian
            </Link>
          </>
        ),
      }),
    },
  };
};
