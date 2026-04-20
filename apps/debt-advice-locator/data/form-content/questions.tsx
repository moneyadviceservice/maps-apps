import { Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

export const debtAdviceLocatorQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Question[] => {
  return [
    {
      questionNbr: 1,
      group: 'Region',
      title: z({
        en: 'Where do you live?',
        cy: `Ble ydych chi'n byw?`,
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
      group: 'SmallBusinessOwner',
      title: z({
        en: 'Are you a small business owner or self-employed?',
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
      group: 'AdviceType',
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
            cy: 'Ar-lein',
          }),
          subtext: z({
            en: 'Access resources and guides to help you manage your debt at your own pace. The tools available will vary based on your selected service.',
            cy: `Cael mynediad at adnoddau a chanllawiau i'ch helpu i reoli eich dyled ar eich cyflymder eich hun. Bydd y teclynnau sydd ar gael yn amrywio yn seiliedig ar eich gwasanaeth a ddewiswyd.`,
          }),
        },
        {
          text: z({ en: 'By phone', cy: 'Dros y ffôn' }),
          subtext: z({
            en: 'Speak directly with an advisor over the phone for advice and assistance.',
            cy: 'Siaradwch yn uniongyrchol ag ymgynghorydd dros y ffôn i gael cyngor a chymorth.',
          }),
        },
        {
          text: z({
            en: 'Face-to-face near you',
            cy: 'Wyneb yn wyneb yn eich ardal chi',
          }),
          subtext: z({
            en: 'Meet with a trained advisor in person for personalised support. You can schedule a meeting at a time that suits you.',
            cy: `Cwrdd ag ymgynghorydd hyfforddedig yn bersonol am gymorth personol. Gallwch drefnu cyfarfod ar adeg sy'n gyfleus i chi.`,
          }),
        },
      ],
    },
    {
      questionNbr: 4,
      group: 'Location',
      title: z({
        en: 'What is your location?',
        cy: 'Beth yw eich lleoliad?',
      }),
      type: 'single',
      subType: 'text',
      answers: [],
      inputProps: {
        labelValue: z({
          en: 'City, town, or postcode',
          cy: `Dinas, tref neu gôd post`,
        }),
      },
      hasGlassBoxClass: true,
    },
  ];
};
