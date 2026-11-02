import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

export const retirementGuidanceQuestions = (
  t: ReturnType<typeof useTranslation>['t'],
): Question[] => {
  return [
    {
      questionNbr: 1,
      group: '',
      title: t('q1.question'),
      definition: t('q1.description'),
      type: 'single',
      subType: 'yesNoDontKnow',
      answers: [
        {
          text: t('q1.options.option1'),
        },
        {
          text: t('q1.options.option2'),
        },
        {
          text: t('q1.options.option3'),
        },
        {
          text: t('q1.options.option4'),
        },
        {
          text: t('q1.options.option5'),
          subtext: t('q1.options.option5Separator'),
          alwaysDisplaySubText: true,
        },
        {
          text: t('q1.options.option6'),
        },
      ],
    },
    {
      questionNbr: 2,
      group: '',
      title: t('q2.question'),
      type: 'single',
      answers: [
        {
          text: t('q2.options.option1'),
        },
        {
          text: t('q2.options.option2'),
        },
        {
          text: t('q2.options.option3'),
        },
      ],
    },
    {
      questionNbr: 3,
      group: '',
      title: t('q3.question'),
      type: 'single',
      definition: t('q3.description'),
      answers: [
        {
          text: t('q3.options.option1'),
        },
        {
          text: t('q3.options.option2'),
          hintText: t('q3.options.option2HintText'),
        },
        {
          text: t('q3.options.option3'),
        },
      ],
    },
    {
      questionNbr: 4,
      group: '',
      title: t('q4.question'),
      type: 'single',
      definition: t('q4.description'),
      answers: [
        {
          text: t('q4.options.option1'),
        },
        {
          text: t('q4.options.option2'),
        },
        {
          text: t('q4.options.option3'),
        },
      ],
    },
    {
      questionNbr: 5,
      group: '',
      title: t('q5.question'),
      type: 'multiple',
      definition: t('q5.description'),
      answers: [
        {
          text: t('q5.options.option1'),
          subtext: t('q5.options.option1HintText'),
        },
        {
          text: t('q5.options.option2'),
          subtext: t('q5.options.option2HintText'),
        },
        {
          text: t('q5.options.option3'),
          subtext: t('q5.options.option3HintText'),
        },
        {
          text: t('q5.options.option4'),
          subtext: t('q5.options.option4HintText'),
        },
        {
          text: t('q5.options.option5'),
          subtext: t('q5.options.option5HintText'),
        },
      ],
    },
    {
      questionNbr: 6,
      group: '',
      title: t('q6.question'),
      type: 'single',

      definition: t('q6.description'),
      answers: [
        {
          text: t('q6.options.option1'),
        },
        {
          text: t('q6.options.option2'),
        },
        {
          text: t('q6.options.option3'),
        },
      ],
    },
    {
      questionNbr: 7,
      group: '',
      title: t('q7.question'),
      type: 'single',

      definition: t('q7.description'),
      answers: [
        {
          text: t('q7.options.option1'),
        },
        {
          text: t('q7.options.option2'),
        },
        {
          text: t('q7.options.option3'),
        },
      ],
    },
    {
      questionNbr: 8,
      group: '',
      title: t('q8.question'),
      type: 'single',
      answers: [
        {
          text: t('q8.options.option1'),
        },
        {
          text: t('q8.options.option2'),
        },
      ],
      moreInfo: {
        title: t('q8.moreInfo.moreInfoLink'),
        text: t('q8.moreInfo.infoText'),
      },
    },
    {
      questionNbr: 9,
      group: '',
      title: t('q9.question'),
      type: 'single',
      definition: t('q9.description'),
      answers: [
        {
          text: t('q9.options.option1'),
        },
        {
          text: t('q9.options.option2'),
        },
        {
          text: t('q9.options.option3'),
        },
        {
          text: t('q9.options.option4'),
        },
      ],
    },
    {
      questionNbr: 10,
      group: '',
      title: t('q10.question'),
      type: 'single',

      definition: t('q10.description'),
      answers: [
        {
          text: t('q10.options.option1'),
        },
        {
          text: t('q10.options.option2'),
        },
      ],
      moreInfo: {
        title: t('q10.moreInfo.moreInfoLink'),
        text: t('q10.moreInfo.infoText'),
      },
    },
    {
      questionNbr: 11,
      group: '',
      title: t('q11.question'),
      type: 'single',
      answers: [
        {
          text: t('q11.options.option1'),
        },
        {
          text: t('q11.options.option2'),
        },
      ],
      moreInfo: {
        title: t('q11.moreInfo.moreInfoLink'),
        text: t('q11.moreInfo.infoText'),
      },
    },
  ];
};
