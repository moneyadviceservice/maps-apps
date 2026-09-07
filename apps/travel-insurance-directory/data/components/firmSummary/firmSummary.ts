import { useTranslation } from '@maps-react/hooks/useTranslation';

type Z = ReturnType<typeof useTranslation>['z'];

export const firmSummary = {
  policyTable: {
    featureColumn: (z: Z) =>
      z({
        en: 'Policy feature',
        cy: 'Nodwedd y polisi',
      }),
    detailsColumn: (z: Z) =>
      z({
        en: 'Coverage details',
        cy: 'Manylion y cwmpas',
      }),
  },

  contactDetails: {
    title: (z: Z) =>
      z({
        en: 'Contact details',
        cy: 'Manylion cyswllt',
      }),
    call: (z: Z) =>
      z({
        en: 'Call',
        cy: 'Ffôn',
      }),
    email: (z: Z) =>
      z({
        en: 'Email',
        cy: 'E-bost',
      }),
    noContactDetails: (z: Z) =>
      z({
        en: 'No contact details available.',
        cy: 'Nid oes manylion cyswllt ar gael.',
      }),
    visitWebsite: (z: Z) =>
      z({
        en: 'Visit provider website (opens in new tab)',
        cy: 'Ymweld â gwefan darparwr (Yn agor mewn ffenestr newydd)',
      }),
  },

  openingTimes: {
    mondayFriday: (z: Z) =>
      z({
        en: 'Monday-Friday',
        cy: 'Dydd Llun-Dydd Gwener',
      }),
    saturday: (z: Z) =>
      z({
        en: 'Saturday',
        cy: 'Dydd Sadwrn',
      }),
    sunday: (z: Z) =>
      z({
        en: 'Sunday',
        cy: 'Dydd Sul',
      }),
  },

  medicalConditions: {
    label: (z: Z) =>
      z({
        en: 'Medical conditions covered',
        cy: "Cyflyrau meddygol sydd wedi'u cynnwys",
      }),
    mostConditions: (z: Z) =>
      z({
        en: 'Most conditions covered',
        cy: "Mwyafrif o gyflyrau wedi'u cynnwys",
      }),
    notSpecified: (z: Z) =>
      z({
        en: 'Not specified',
        cy: 'Heb ei nodi',
      }),
  },

  medicalEquipment: {
    label: (z: Z) =>
      z({
        en: 'Medical equipment cover',
        cy: 'Yswiriant offer meddygol',
      }),
    yes: (z: Z) =>
      z({
        en: 'Yes',
        cy: 'Oes',
      }),
    yesUpTo: (z: Z) => (amount: string) =>
      z({
        en: `Yes, up to ${amount}`,
        cy: `Oes, hyd at ${amount}`,
      }),
    no: (z: Z) =>
      z({
        en: 'No',
        cy: 'Na',
      }),
  },

  cruiseCover: {
    label: (z: Z) =>
      z({
        en: 'Cruise cover',
        cy: 'Yswiriant mordaith',
      }),
    yes: (z: Z) =>
      z({
        en: 'Yes',
        cy: 'Oes',
      }),
  },

  medicalScreening: {
    label: (z: Z) =>
      z({
        en: 'Medical screening',
        cy: 'Sgrinio meddygol',
      }),
    description: (z: Z) =>
      z({
        en: `If you are going to get quotes from different providers, try and use firms that use different medical screening companies. This may give you a wider choice of price and/or cover offered. There is more information on medical screening in our FAQs on the previous screen.`,
        cy: `Os ydych yn mynd i gael amcan prisiau gan wahanol ddarparwyr, ceisiwch ddefnyddio cwmnïau sy'n defnyddio gwahanol gwmnïau sgrinio meddygol. Gall hyn roi dewis ehangach i chi o bris a/neu yswiriant a gynigir. Mae mwy o wybodaeth am sgrinio meddygol yn ein Cwestiynau Cyffredin ar y sgrin flaenorol.`,
      }),
    defaultCompanyEn: 'the provider',
    defaultCompanyCy: 'y darparwr',
  },
};
