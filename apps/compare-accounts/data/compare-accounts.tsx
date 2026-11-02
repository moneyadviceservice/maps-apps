import { useTranslation } from '@maps-react/hooks/useTranslation';

type AccountProps = {
  value: string;
  title: string;
  details: string;
};

const accountFeatures = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<AccountProps> => {
  return [
    {
      value: 'chequeBookAvailable',
      title: z({ en: 'Cheque book available', cy: 'Llyfr siec ar gael' }),
      details: z({
        en: 'Accounts where a cheque book is given or available upon request.',
        cy: 'Cyfrifon lle rhoddir llyfr siec neu ar gael os ydych yn gofyn.',
      }),
    },
    {
      value: 'noMonthlyFee',
      title: z({ en: 'No monthly fee', cy: 'Dim ffi misol' }),
      details: z({
        en: 'Accounts that don’t require you to pay a charge each month to keep the account.',
        cy: "Cyfrifon nad oes rhaid i chi dalu tâl bob mis i gadw'r cyfrif.",
      }),
    },
    {
      value: 'openToNewCustomers',
      title: z({
        en: 'Open to new customers',
        cy: 'Ar agor i gwsmeriaid newydd',
      }),
      details: z({
        en: 'Accounts that are available to new customers. You don’t have to already have a different type of account with the bank to apply for these accounts.',
        cy: "Cyfrifon sydd ar gael i gwsmeriaid newydd. Does dim rhaid i chi gael cyfrif gwahanol eisoes gyda'r banc i wneud cais am y cyfrifon hyn.",
      }),
    },
    {
      value: 'overdraftFacilities',
      title: z({ en: 'Overdraft facilities', cy: 'Cyfleusterau gorddrafft' }),
      details: z({
        en: 'Accounts that let you temporarily use more money than is in the account. Note that overdrafts are offered based on your circumstances.',
        cy: "Cyfrifon sy'n eich gadael i ddefnyddio mwy o arian dros dro nag sydd yn y cyfrif. Sylwer fod gorddrafftiau yn cael eu cynnig yn seiliedig ar eich amgylchiadau.",
      }),
    },
    {
      value: 'sevenDaySwitching',
      title: z({ en: '7-day switching', cy: 'Newid 7-diwrnod' }),
      details: z({
        en: 'Accounts that allow you to switch over all Direct Debits and standing orders from your old account to the new one automatically within 7 days.',
        cy: "Cyfrifon sy'n eich galluogi i newid bob Debyd Uniongyrchol a rheolau sefydlog o'ch hen gyfrif i'r un newydd yn awtomatig o fewn 7 diwrnod.",
      }),
    },
  ];
};
const accountAccess = (z: ReturnType<typeof useTranslation>['z']) => {
  return [
    {
      value: 'branchBanking',
      title: z({ en: 'Branch banking', cy: 'Bancio cangen' }),
      details: z({
        en: 'Accounts from banks that have high-street branches that you can visit.',
        cy: 'Cyfrifon gan fanciau sydd â changhennau ar y stryd fawr y gallwch ymweld â nhw.',
      }),
    },
    {
      value: 'internetBanking',
      title: z({ en: 'Internet banking', cy: 'Bancio ar y we' }),
      details: z({
        en: 'Accounts that let you bank online through a dedicated website.',
        cy: "Cyfrifon sy'n gadael i chi fancio ar-lein drwy wefan bwrpasol.",
      }),
    },
    {
      value: 'mobileAppBanking',
      title: z({ en: 'Mobile app banking', cy: 'ap ffôn symudol' }),
      details: z({
        en: 'Accounts from banks that support banking through a mobile application.',
        cy: "Cyfrifon gan fanciau sy'n cefnogi bancio drwy gais symudol.",
      }),
    },
    {
      value: 'postOfficeBanking',
      title: z({ en: 'Post Office banking', cy: "Bancio Swyddfa'r Post" }),
      details: z({
        en: 'Accounts that let you bank through a Post Office.',
        cy: "Cyfrifon sy'n gadael i chi fancio trwy Swyddfa'r Post.",
      }),
    },
  ];
};

const accountTypes = (z: ReturnType<typeof useTranslation>['z']) => {
  return [
    {
      value: 'standardCurrent',
      title: z({ en: 'Standard current', cy: 'Cyfredol safonol' }),
      details: z({
        en: 'Default bank account for everyday banking. Suitable for the majority of people. Usually includes overdrafts, debit cards, cash withdrawals etc.',
        cy: "Cyfrif banc diofyn ar gyfer bancio bob dydd. Addas i'r mwyafrif o bobl. Fel arfer yn cynnwys gorddrafftiau, cardiau debyd, tynnu arian parod ac ati.",
      }),
    },
    {
      value: 'feeFreeBasicBank',
      title: z({ en: 'Fee-free basic', cy: 'Sylfaenol di-dâl' }),
      details: z({
        en: 'Designed for people with a poor credit score and cannot qualify for a standard current account. Similar features to current accounts. Do not include overdrafts.',
        cy: " Wedi'i ddylunio ar gyfer pobl sydd â sgôr credyd gwael ac ni all fod yn gymwys i gael cyfrif cyfredol safonol. Nodweddion tebyg i'r cyfrifon cyfredol. Peidiwch â chynnwys gorddrafftiau.",
      }),
    },
    {
      value: 'student',
      title: z({ en: 'Student', cy: 'Myfyriwr' }),
      details: z({
        en: 'Only available to full-time students or apprentices. Often come with incentives like railcards or cashback. Often offer interest free overdrafts.',
        cy: 'Ar gael i fyfyrwyr llawn amser neu brentisiaid yn unig. Yn aml, yn dod gyda chymhellion fel cardiau rheilffordd neu arian parod. Yn aml yn cynnig gorddrafftiau di-log.',
      }),
    },
    {
      value: 'premier',
      title: z({ en: 'Premier', cy: 'Prif' }),
      details: z({
        en: 'Designed for high income customers. Generally have strict qualifying criteria. Often include rewards and incentives.',
        cy: "Wedi'i ddylunio ar gyfer cwsmeriaid incwm uchel. Yn gyffredinol mae ganddynt feini prawf cymhwyso llym. Yn aml mae'n cynnwys gwobrau a chymhellion.",
      }),
    },
    {
      value: 'eMoney',
      title: z({ en: 'E-money', cy: 'E-arian' }),
      details: z({
        en: 'Designed to be used online and with smartphones. Often include budgeting tools.',
        cy: "Wedi'i gynllunio i'w defnyddio ar-lein a gyda ffonau clyfar. Yn aml mae'n cynnwys teclynnau cyllidebu.",
      }),
    },
    {
      value: 'packaged',
      title: z({ en: 'Packaged', cy: "Wedi'i becynnu" }),
      details: z({
        en: 'Come with extra benefits like insurance, cashback and reward points. You’ll often need to pay a monthly fee.',
        cy: 'Yn dod gyda manteision ychwanegol fel yswiriant, arian parod a phwyntiau gwobrwyo. Yn aml bydd angen i chi dalu ffi fisol.',
      }),
    },
    {
      value: 'childrenYoungPerson',
      title: z({ en: 'Children/young person', cy: 'Plant/pobl ifanc' }),
      details: z({
        en: 'Only available to people under the age of 18.',
        cy: 'Ar gael i bobl o dan 18 oed yn unig',
      }),
    },
    {
      value: 'graduate',
      title: z({ en: 'Graduate', cy: 'Graddio' }),
      details: z({
        en: 'Only available to graduates. Often come with incentives like travel insurance. Designed to support a transition from the interest free overdrafts of student accounts.',
        cy: "Ar gael i raddedigion yn unig. Yn aml yn dod gyda chymhellion fel yswiriant teithio. Wedi'i ddylunio i gefnogi trosglwyddiad o'r gorddrafftiau di-log o gyfrifon myfyrwyr.",
      }),
    },
  ];
};

export { accountAccess, accountFeatures, accountTypes };
