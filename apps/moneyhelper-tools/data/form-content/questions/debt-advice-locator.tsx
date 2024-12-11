import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

export const debtAdviceLocator = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [
    {
      questionNbr: 1,
      group: '',
      title: z({
        en: 'Which country do you live in?',
        cy: `Ym mha wlad ydych chi'n byw ynddi?`,
      }),
      type: 'single',
      answers: [
        {
          text: z({ en: 'England', cy: 'Lloegr' }),
        },
        {
          text: z({ en: 'Scotland', cy: 'Yr Alban' }),
        },
        {
          text: z({ en: 'Wales', cy: 'Cymru' }),
        },
        {
          text: z({ en: 'Northern Ireland', cy: 'Gogledd Iwerddon' }),
        },
      ],
    },
    {
      questionNbr: 2,
      group: '',
      title: z({
        en: 'Are you a small business owner or self-employed? ',
        cy: `Ydych chi'n berchennog busnes bach neu'n hunangyflogedig?`,
      }),
      type: 'single',
      subType: 'yesNo',
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
      ],
    },
    {
      questionNbr: 3,
      group: '',
      title: z({
        en: 'How would you like to get debt advice?',
        cy: `Sut hoffech chi gael cyngor ar ddyledion?`,
      }),
      type: 'single',
      subType: '',
      answers: [
        {
          text: z({
            en: 'Online self-help tools',
            cy: 'Teclynnau hunangymorth ar-lein',
          }),
          subtext: z({
            en: 'Access resources and guides to help you manage your debt at your own pace. The tools available will vary based on your selected service.',
            cy: `Cael mynediad at adnoddau a chanllawiau i'ch helpu i reoli eich dyled ar eich cyflymder eich hun. Bydd y teclynnau sydd ar gael yn amrywio yn seiliedig ar eich gwasanaeth a ddewiswyd.`,
          }),
        },
        {
          text: z({ en: 'Telephone', cy: 'Ffôn' }),
          subtext: z({
            en: 'Speak directly with an advisor over the phone for advice and assistance.',
            cy: 'Siaradwch yn uniongyrchol ag ymgynghorydd dros y ffôn i gael cyngor a chymorth.',
          }),
        },
        {
          text: z({ en: 'Face-to-face', cy: 'Wyneb yn wyneb.' }),
          subtext: z({
            en: 'Meet with a trained advisor in person for personalised support. You can schedule a meeting at a time that suits you.',
            cy: `Cwrdd ag ymgynghorydd hyfforddedig yn bersonol am gymorth personol. Gallwch drefnu cyfarfod ar adeg sy'n gyfleus i chi.`,
          }),
        },
      ],
    },
  ];
};
