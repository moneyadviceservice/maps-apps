import { TabPageData } from 'data/types';

import useTranslation from '@maps-react/hooks/useTranslation';

export const babyMoneyTimelineData = (
  z: ReturnType<typeof useTranslation>['z'],
): TabPageData => {
  return {
    toolHeading: z({
      en: 'Baby money timeline',
      cy: 'Llinell amser arian babi',
    }),
    summaryHeading: z({
      en: '',
      cy: '',
    }),
    tabs: [
      {
        linkText: z({
          en: 'Weeks 1 to 12',
          cy: 'Wythnosau 1 i 12',
        }),
        heading: z({
          en: 'Weeks 1 to 12',
          cy: 'Wythnosau 1 i 12',
        }),
        content: z({
          en: `Congratulations and welcome to your first trimester. Did you know you’re entitled to take paid time off for antenatal appointments, claim free prescriptions and NHS dental care? And if you’re on a low income, you can start receiving Healthy Start vouchers. If you live in Scotland, you can apply for Best Start Foods and check if you're eligible for the Scottish Child Payment. `,
          cy: `Llongyfarchiadau a chroeso i'ch tri mis cyntaf. Oeddech chi’n gwybod bod gennych hawl i gymryd amser i ffwrdd â thâl ar gyfer apwyntiadau cyn geni, hawlio presgripsiynau a gofal deintyddol y GIG am ddim? Ac os ydych ar incwm isel, gallwch ddechrau derbyn talebau Cychwyn Cadarn. Os ydych yn byw yn yr Alban, gallwch wneud cais am Best Start Foods a gwirio a ydych yn gymwys ar gyfer Taliad Plant yr Alban.`,
        }),
      },
      {
        linkText: z({
          en: 'Weeks 13 to 27',
          cy: 'Wythnosau 13 i 27',
        }),
        heading: z({
          en: 'Weeks 13 to 27',
          cy: 'Wythnosau 13 i 27',
        }),
        content: z({
          en: `As you enter your second trimester, it's time to take control of your finances by budgeting for baby essentials. Make sure you check how much maternity pay you’re entitled to, plan your maternity leave and dads might also want to start thinking about paternity leave.`,
          cy: `Wrth i chi ddod i mewn i'ch ail dymor, mae'n bryd cymryd rheolaeth o'ch arian trwy gyllidebu ar gyfer hanfodion babanod. Gwnewch yn siŵr eich bod yn gwirio faint o dâl mamolaeth y mae gennych hawl iddo, cynlluniwch eich absenoldeb mamolaeth ac efallai y bydd tadau am ddechrau meddwl am absenoldeb tadolaeth hefyd. `,
        }),
      },
      {
        linkText: z({
          en: 'Weeks 28 to 41',
          cy: 'Wythnosau 28 i 41',
        }),
        heading: z({
          en: 'Weeks 28 to 41',
          cy: 'Wythnosau 28 i 41',
        }),
        content: z({
          en: 'As you prepare for your baby’s arrival in the third trimester, it’s a good idea to check if you’re entitled to the Sure Start Maternity Grant. Also, see if you qualify for any benefits or tax credits that could help support you and your growing family.',
          cy: `Wrth i chi baratoi ar gyfer geni eich babi yn y trydydd tymor, mae’n syniad da gwirio a oes gennych hawl i Grant Mamolaeth Cychwyn Cadarn. Hefyd, gweler a ydych yn gymwys i gael unrhyw fudd-daliadau neu gredydau treth a allai helpu i'ch cefnogi chi a'ch teulu sy'n tyfu. `,
        }),
      },
      {
        linkText: z({
          en: '0 to 6 months',
          cy: '0 i 6 mis',
        }),
        heading: z({
          en: '0 to 6 months',
          cy: '0 i 6 mis',
        }),
        content: z({
          en: 'Congratulations on the birth of your baby! Now’s the time to register the birth, claim Child Benefit and make sure you’re getting all your entitlements. It’s also a good moment to review your household budget, plan your return to work, explore childcare options and see if you can get help with childcare costs.',
          cy: 'Llongyfarchiadau ar enedigaeth eich babi! Nawr yw’r amser i gofrestru’r enedigaeth, hawlio Budd-dal Plant a gwneud yn siŵr eich bod yn cael popeth y mae gennych hawl iddo. Mae hefyd yn foment dda i adolygu cyllideb eich cartref, cynllunio eich dychwelyd i’r gwaith, archwilio opsiynau gofal plant a gweld a allwch gael help gyda chostau gofal plant. ',
        }),
      },
      {
        linkText: z({
          en: '6 to 12 months',
          cy: '6 i 12 mis',
        }),
        heading: z({
          en: '6 to 12 months',
          cy: '6 i 12 mis',
        }),
        content: z({
          en: 'Now is a good time to make or update your will, check if you need life insurance, and ensure your pension is protected while you’re off work. You could also open a savings account for your baby and explore childcare cost help from your employer or the government.',
          cy: 'Mae nawr yn amser da i wneud neu ddiweddaru eich ewyllys, gwirio a oes angen yswiriant bywyd arnoch, a sicrhau bod eich pensiwn wedi’i ddiogelu tra byddwch i ffwrdd o’r gwaith. Gallech hefyd agor cyfrif cynilo ar gyfer eich babi ac archwilio cymorth costau gofal plant gan eich cyflogwr neu’r llywodraeth. ',
        }),
      },
      {
        linkText: z({
          en: '1 to 2 years',
          cy: '1 i 2 flynedd',
        }),
        heading: z({
          en: '1 to 2 years',
          cy: '1 i 2 flynedd',
        }),
        content: z({
          en: 'As your baby grows, it’s a good time to take a debt health check and get help if you’re struggling with debt. Look for ways to save money on bills and shopping and start thinking about saving for the future.',
          cy: 'Wrth i’ch babi dyfu, mae’n amser da i gael gwiriad iechyd dyled a chael help os ydych chi’n cael trafferth gyda dyled. Chwiliwch am ffyrdd o arbed arian ar filiau a siopa a dechrau meddwl am gynilo ar gyfer y dyfodol. ',
        }),
      },
    ],
  };
};
