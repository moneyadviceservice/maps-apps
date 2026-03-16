import { useTranslation } from '@maps-react/hooks/useTranslation';

type Z = ReturnType<typeof useTranslation>['z'];

export const firmSummary = {
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
        en: 'Visit provider website (opens in a new tab)',
        cy: 'Ewch i wefan y darparwr (yn agor mewn tab newydd)',
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
    moreInfo: (z: Z) =>
      z({
        en: 'More info',
        cy: 'Mwy o wybodaeth',
      }),
    description: (z: Z) =>
      z({
        en: `If you are going to get quotes from different providers, try and use firms that use different medical screening companies. This may give you a wider choice of price and/or cover offered. There is more information on medical screening in our FAQs on the previous screen.`,
        cy: `Os ydych yn mynd i gael amcan prisiau gan wahanol ddarparwyr, ceisiwch ddefnyddio cwmnïau sy'n defnyddio gwahanol gwmnïau sgrinio meddygol. Gall hyn roi dewis ehangach i chi o bris a/neu yswiriant a gynigir. Mae mwy o wybodaeth am sgrinio meddygol yn ein Cwestiynau Cyffredin ar y sgrin flaenorol.`,
      }),
    defaultCompanyEn: 'the provider',
    defaultCompanyCy: 'y darparwr',
  },

  covidMedical: {
    label: (z: Z) =>
      z({
        en: 'Coronavirus cover for medical expenses',
        cy: 'Yswiriant coronafeirws ar gyfer costau meddygol',
      }),
    moreInfo: (z: Z) =>
      z({
        en: 'Not all policies will provide cover for medical emergencies and/or repatriation if you are affected by Coronavirus while you are on your trip, but many will. So always check this before you buy. Even if Coronavirus cover is included, always check exactly what is covered.',
        cy: "Ni fydd pob polisi yn darparu ar gyfer argyfyngau meddygol a/neu ddychwelyd os bydd Coronafeirws yn effeithio arnoch tra byddwch ar eich taith, ond bydd llawer yn gwneud hynny. Felly gwiriwch hyn bob amser cyn i chi brynu. Hyd yn oed os yw yswiriant Coronafeirws wedi'i gynnwys, gwiriwch yn union beth sydd wedi'i gynnwys.",
      }),
  },

  covidCancellation: {
    label: (z: Z) =>
      z({
        en: 'Coronavirus cover if trip cancelled',
        cy: "Yswiriant coronafeirws pe bai'r daith yn cael ei chanslo",
      }),
    moreInfo: (z: Z) =>
      z({
        en: 'Some policies will refund the cost of your trip if you have to cancel because of Coronavirus, but ONLY if the policyholder tests positive for Coronavirus and is unable to travel. If the policyholder can’t travel because they are self-isolating or in quarantine, most policies won’t pay out. Check all the policy conditions with your provider carefully before you buy.',
        cy: "Bydd rhai polisïau yn ad-dalu cost eich taith os bydd yn rhaid i chi ganslo oherwydd Coronafeirws, ond DIM OND os yw deiliad y polisi'n profi'n bositif am Goronafeirws ac yn methu â theithio. Os na all deiliad y polisi deithio oherwydd ei fod yn hunan-ynysu neu mewn cwarantîn, ni fydd y mwyafrif o bolisïau yn talu allan. Gwiriwch yr holl amodau'r polisi gyda'ch darparwr yn ofalus cyn i chi brynu.",
      }),
  },

  common: {
    yes: (z: Z) =>
      z({
        en: 'Yes',
        cy: 'Oes',
      }),
    no: (z: Z) =>
      z({
        en: 'No',
        cy: 'Na',
      }),
    moreInfo: (z: Z) =>
      z({
        en: 'More info',
        cy: 'Mwy o wybodaeth',
      }),
  },
};
