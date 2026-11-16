import { Group } from 'types';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export const groups = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Group> => {
  return [
    {
      title: z({ en: 'About you', cy: 'No translation' }),
      group: 'screening',
    },
    {
      title: z({ en: 'Preventing debts', cy: 'Atal dyledion' }),
      descritionScoreOne: z({
        en: "Based on your answers, debt may be one of your biggest financial worries. It's great that you're taking steps to get support. Getting free debt advice will help you prioritise your debts and get back on track.",
        cy: "Yn seiliedig ar eich atebion, efallai mai dyled yw un o'ch pryderon ariannol mwyaf. Mae'n wych eich bod yn cymryd camau i gael cefnogaeth. Bydd cael cyngor ar ddyledion am ddim yn eich helpu i flaenoriaethu eich dyledion a dod yn ôl ar y trywydd iawn.",
      }),
      descritionScoreTwo: z({
        en: "If you're struggling to keep up with bills and debt payments, you're not alone. We help hundreds of thousands of people with similar worries every year. There are lots of things you can do to get back on track, including getting free debt advice",
        cy: "Os ydych chi'n ei chael hi'n anodd cadw i fyny â biliau a thaliadau dyled, nid ydych chi ar eich pen eich hun. Rydyn ni'n helpu cannoedd o filoedd o bobl â phryderon tebyg bob blwyddyn. Mae llawer o bethau y gallwch eu gwneud i ddod yn ôl ar y trywydd iawn, gan gynnwys cael cyngor ar ddyledion am ddim.",
      }),
      descritionScoreThree: z({
        en: 'Congratulations on being debt free.',
        cy: 'Llongyfarchiadau ar fod yn rhydd o ddyled.',
      }),
      group: 'preventing-debts',
    },
    {
      title: z({ en: 'Budgeting', cy: 'Cyllidebu' }),
      descritionScoreOne: z({
        en: "It looks like you could reduce spending on bills or increase your monthly income. Or maybe you just need help sorting out a budget. Here's how to get started.",
        cy: "Mae'n edrych fel y gallech ostwng gwariant ar filiau neu gynyddu eich incwm misol. Neu efallai mai dim ond help sydd ei angen arnoch i drefnu cyllideb. Dyma sut i ddechrau arni.",
      }),
      descritionScoreTwo: z({
        en: "Perhaps you have a budget already but are having trouble sticking to it. Or maybe you're spending within your means, but you could still maximise your income. Here's how to get back on track.",
        cy: "Efallai bod gennych gyllideb yn barod ond yn cael trafferth cadw ati. Neu efallai eich bod yn gwario o fewn yr hyn y gallech ei fforddio, ond fe allech chi wneud y mwyaf o'ch incwm o hyd. Dyma sut i fynd yn ôl ar y trywydd iawn.",
      }),
      descritionScoreThree: z({
        en: "You're doing well at budgeting. You know it's important to have a budget and stick to it.",
        cy: "Rydych chi'n gwneud yn dda am gyllidebu. Rydych chi'n gwybod ei bod hi'n bwysig cael cyllideb a chadw ati.",
      }),
      group: 'budgeting',
    },
    {
      title: z({ en: 'Estate planning', cy: 'Cynllunio ystad' }),
      descritionScoreOne: z({
        en: 'It looks like you should focus on this area. Here are the key steps that will get you on the right track.',
        cy: "Mae'n debyg y dylech ganolbwyntio ar y maes hwn. Dyma'r camau allweddol a fydd yn mynd â chi ar y trywydd iawn.",
      }),
      descritionScoreTwo: z({
        en: "It looks like you've had a good start — here's what to think about next.",
        cy: "Mae'n edrych fel eich bod chi wedi cael dechrau da - dyma beth i feddwl amdano nesaf.",
      }),
      descritionScoreThree: z({
        en: "Well done, looks like you're all set in terms of planning for your family's future if you die.",
        cy: "Da iawn, mae'n edrych fel eich bod chi i gyd yn barod o ran cynllunio ar gyfer dyfodol eich teulu os byddwch chi'n marw.",
      }),
      group: 'estate-planning',
    },
    {
      title: z({
        en: 'Building emergency savings',
        cy: 'Cronni cynilion brys',
      }),
      descritionScoreOne: z({
        en: 'It looks like you should focus on building up savings for emergencies. Here are the key steps that will get you on the right track.',
        cy: "Mae'n ymddangos y dylech ganolbwyntio ar adeiladu gynilion ar gyfer argyfyngau. Dyma'r camau allweddol a fydd yn mynd â chi ar y trywydd iawn.",
      }),
      descritionScoreTwo: z({
        en: "It looks like you've gotten started on your savings — here's what to think about next.",
        cy: "Mae'n edrych fel eich bod wedi dechrau ar eich cynilion - dyma beth i feddwl amdano nesaf.",
      }),
      descritionScoreThree: z({
        en: "Well done, looks like you're all set in terms of emergency savings.",
        cy: "Da iawn, mae'n edrych fel eich bod chi i gyd yn barod o ran cynilion brys.",
      }),
      group: 'emergency-savings',
    },
    {
      title: z({
        en: 'Managing unexpected costs',
        cy: 'Rheoli costau annisgwyl',
      }),
      descritionScoreOne: z({
        en: "Having some emergency savings is a great way to prepare for unexpected costs. We'll explain how to build up an emergency savings buffer and how much to save.",
        cy: "Mae cael rhai gynilion brys yn ffordd wych o baratoi ar gyfer costau annisgwyl. Byddwn yn egluro sut i gronni byffer cynilion argyfwng a faint i'w gynilo.",
      }),
      descritionScoreTwo: z({
        en: "It looks like you've started thinking about unexpected costs — here's what to do next.",
        cy: "Mae'n edrych fel eich bod wedi dechrau meddwl am gostau annisgwyl - dyma beth i'w wneud nesaf.",
      }),
      descritionScoreThree: z({
        en: "You're doing well at saving for unexpected costs. You would be prepared if you had to meet an unexpected cost or if your circumstances changed.",
        cy: "Rydych chi'n gwneud yn dda am gynilo ar gyfer costau annisgwyl. Byddech yn barod pe bai'n rhaid i chi dalu cost annisgwyl neu pe bai eich amgylchiadau yn newid. ",
      }),
      group: 'unexpected-costs',
    },
    {
      title: z({ en: 'Income protection', cy: 'Diogelu incwm' }),
      descritionScoreOne: z({
        en: 'Do you know what would happen if you lost your regular income? There are actions you can take to make sure you can still afford your everyday expenses.',
        cy: "Ydych chi'n gwybod beth fyddai'n digwydd pe baech yn colli'ch incwm rheolaidd? Mae yna gamau y gallwch eu cymryd i sicrhau eich bod yn dal yn gallu fforddio eich treuliau bob dydd.",
      }),
      descritionScoreTwo: z({
        en: "Maybe you've insured yourself against some income loss or built up a savings buffer, but need some help to continue.",
        cy: 'Efallai eich bod wedi yswirio eich hun rhag rhywfaint o golled incwm neu adeiladu byffer cynilion, ond angen rhywfaint o help i barhau.',
      }),
      descritionScoreThree: z({
        en: 'Well done, looks like you have a good plan for if you lost your regular income.',
        cy: "Da iawn, mae'n edrych fel bod gennych gynllun da ar ei gyfer pe baech chi'n colli'ch incwm rheolaidd.",
      }),
      group: 'income-protection',
    },
    {
      title: z({
        en: 'Retirement planning',
        cy: 'Cynllunio ar gyfer ymddeoliad',
      }),
      descritionScoreOne: z({
        en: "Planning for retirement is one of the key areas for you to focus on. Here's how to get started.",
        cy: "Cynllunio ar gyfer ymddeoliad yw un o'r meysydd allweddol i chi ganolbwyntio arno. Dyma sut i ddechrau arni.",
      }),
      descritionScoreTwo: z({
        en: "You're on the right track, but there are still more steps you can take to save for a comfortable retirement.",
        cy: 'Rydych ar y trywydd iawn, ond mae yna fwy o gamau y gallwch eu cymryd o hyd i gynilo ar gyfer ymddeoliad cyfforddus.',
      }),
      descritionScoreThree: z({
        en: "You're doing well with your retirement savings. You understand your goals and are taking steps to make sure you meet them. Make sure you check in with your savings regularly to stay on track, especially if your circumstances change.",
        cy: "Rydych chi'n gwneud yn dda gyda'ch cynilion ymddeoliad. Rydych chi'n deall eich nodau ac yn cymryd camau i sicrhau eich bod yn eu cyflawni. Gwnewch yn siŵr eich bod yn gwirio eich cynilion yn rheolaidd i aros ar y trywydd iawn, yn enwedig os bydd eich amgylchiadau'n newid.",
      }),
      group: 'retirement-planning',
    },
    {
      title: z({ en: 'Your home', cy: 'Eich cartref' }),
      descritionScoreOne: z({
        en: "It looks like planning where to live when you retire is something you should focus on, whether you're downsizing or just aren't sure. Here are some considerations you should take into account.",
        cy: "Mae'n edrych fel bod cynllunio ar gyfer llety ar ôl ymddeol yn faes y dylech ganolbwyntio arno, p'un a ydych yn symud i gartref llai neu ddim yn siŵr. Dyma rai ystyriaethau y dylech eu hystyried.",
      }),
      descritionScoreTwo: z({
        en: "You've put some thought into where you will live in retirement. If you're planning to rent, there are some tips for renters. If you're thinking about buying a home, or still paying an existing mortgage, there are steps you can take to help you work towards home ownership.",
        cy: "Mae'n edrych fel bod cynllunio ble i fyw pan fyddwch yn ymddeol yn rhywbeth y dylech ganolbwyntio arno, p'un a ydych chi'n prynu tŷ sy'n llai o faint neu os nad ydych yn siŵr. Dyma rai o'r ystyriaethau y dylech eu hystyried.",
      }),
      descritionScoreThree: z({
        en: "Well done, it looks like you've already planned where you'll live when you retire.",
        cy: "Da iawn, mae'n edrych fel eich bod eisoes wedi cynllunio lle y byddwch yn byw pan fyddwch chi'n ymddeol.",
      }),
      group: 'retirement-accomodation-planning',
    },
    {
      title: z({
        en: 'Building non-emergency savings and investments',
        cy: 'Cronni cynilion di-frys a buddsoddiadau',
      }),
      descritionScoreOne: z({
        en: "It seems that you don't have any savings or investments. For help getting started, here's what to do next.",
        cy: "Mae'n ymddangos nad oes gennych unrhyw gynilion na buddsoddiadau. I gael cymorth i ddechrau, dyma beth i'w wneud nesaf.",
      }),
      descritionScoreTwo: z({
        en: 'Great work so far — it seems that you have enough money left over for extra savings. Here are a few tips to maximise your savings.',
        cy: "Gwaith gwych hyd yn hyn—mae'n ymddangos bod gennych ddigon o arian ar ôl ar gyfer cynilion ychwanegol. Dyma rai awgrymiadau i wneud y mwyaf o'ch cynilion.",
      }),
      descritionScoreThree: z({
        en: "Well done, it looks like you've already planned where you'll live when you retire.",
        cy: "Da iawn, mae'n edrych fel eich bod eisoes wedi cynllunio lle y byddwch yn byw pan fyddwch chi'n ymddeol.",
      }),
      group: 'no-emergency-savings',
    },
  ];
};

export const resultsPageContent = (
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    title: z({
      en: 'Your personalised report',
      cy: 'Eich adroddiad personol',
    }),
    pdfTitle: z({
      en: 'Your personalised Money Midlife MOT report',
      cy: 'Eich adroddiad personol MOT Canol Oes Arian',
    }),
    description: z({
      en: "Well done for completing the Money Midlife MOT. You'll find your results below, listed in order from what you should focus on improving now to what you're already doing well.",
      cy: "Da iawn am gwblhau'r MOT Canol Oes Arian. Byddwch yn darganfod eich canlyniadau isod, wedi'u rhestri yn nhrefn yr hyn y dylech ganolbwyntio ar wella nawr i'r hyn rydych eisoes yn ei wneud yn dda.",
    }),
    focusOnTitle: z({ en: 'What to focus on', cy: 'Beth i ganolbwyntio arno' }),
    focusOnDescription: z({
      en: "These are the key areas where you've said you're less confident. Prioritising these actions will help you get on track to achieve your goals.",
      cy: "Dyma'r meysydd allweddol lle rydych wedi dweud eich bod yn llai hyderus. Bydd blaenoriaethu'r camau hyn yn eich helpu i fynd ar y trywydd iawn i gyflawni'ch nodau",
    }),
    buildOnTitle: z({ en: 'What to build on', cy: 'Beth i adeiladu arno' }),
    buidlOnDescription: z({
      en: "You're on the right track in these areas, but taking these next steps will help you make the most of your money and pensions.",
      cy: "Rydych chi ar y trywydd iawn yn y meysydd hyn, ond bydd cymryd y camau nesaf hyn yn eich helpu i wneud y gorau o'ch arian a'ch pensiynau.",
    }),
    keepGoingTitle: z({ en: 'What to keep doing', cy: 'Beth i barhau' }),
    keepGoingDescription: z({
      en: "Well done! You're doing great in these areas.",
      cy: "Da iawn! Rydych chi'n gwneud yn wych yn y meysydd hyn.",
    }),
  };
};
