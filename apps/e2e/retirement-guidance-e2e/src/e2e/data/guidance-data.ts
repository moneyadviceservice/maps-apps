type VariableGuidanceCopy = {
  heading: string;
  content: string;
  links: Array<{
    text: string;
    url: string;
  }>;
};

type VariableGuidancePackage = Record<'en' | 'cy', VariableGuidanceCopy>;

export type StaticGuidanceCopy = {
  title: string;
  paragraphs: readonly string[];
  listItems: readonly string[];
  links: readonly string[];
};

export type StaticGuidancePackage = {
  sectionTestId: string;
  en: StaticGuidanceCopy;
  cy: StaticGuidanceCopy;
};

export const guidanceData = {
  GP01: {
    en: {
      heading:
        'Check if you’ll be better off transferring or combining your pensions',
      content:
        'Transferring your pension to a different provider or scheme might mean you can:pay less if the new scheme has lower feeshave more options to invest or take your pensionbring multiple pension schemes together so you can manage them in one place, called consolidation.You can choose which pensions you want to combine and which you’d like to keep separate – you do not have to combine them all.But with any pension transfer, there’s a risk you might:pay more if the new scheme has higher feeslose valuable benefits that only your current provider offers.For example, your current scheme might offer a bonus payment after a certain date or have a protected pension age that lets you access your pension earlier than other new schemes would.Find out more in our guide Should I transfer or consolidate my pensions?',
      links: [
        {
          text: 'Should I transfer or consolidate my pensions?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-transfers-consolidation/transfer-or-combine-pensions',
        },
      ],
    },
    cy: {
      heading:
        'Gwiriwch a fyddech chi’n well eich byd wrth drosglwyddo neu gyfuno’ch pensiynau',
      content:
        'Gallai trosglwyddo’ch pensiwn i ddarparwr neu gynllun gwahanol olygu y gallwch chi:dalu llai os oes gan y cynllun newydd ffioedd iscael mwy o opsiynau i fuddsoddi neu gymryd eich pensiwndod â chynlluniau pensiwn lluosog at ei gilydd fel y gallwch chi eu rheoli mewn un lle, a elwir yn gyfuno.Gallwch ddewis pa bensiynau rydych chi eisiau cyfuno a pha rai yr hoffech eu cadw ar wahân – nid oes rhaid i chi gyfuno pob un.Ond gydag unrhyw drosglwyddiad pensiwn, mae risg y gallech chi:dalu mwy os oes gan y cynllun newydd ffioedd uwchcolli buddion gwerthfawr os mai ond eich darparwr presennol sy’n eu cynnig.Er enghraifft, gallai eich cynllun presennol gynnig taliad bonws ar ôl dyddiad penodol neu fod ag oedran pensiwn gwarchodedig sy’n caniatáu i chi gael mynediad at eich pensiwn yn gynharach nag y byddai cynlluniau newydd eraill.Darganfyddwch fwy yn ein canllaw A ddylwn i drosglwyddo neu gyfuno fy mhensiynau?',
      links: [
        {
          text: 'A ddylwn i drosglwyddo neu gyfuno fy mhensiynau?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-transfers-consolidation/transfer-or-combine-pensions',
        },
      ],
    },
  },
  GP01a: {
    en: {
      heading: 'You’re usually better off leaving your pension where it is',
      content:
        'Most people are better off keeping a defined benefit pension, according to the Financial Conduct Authority (FCA) and the Pensions Regulator (TPR).This is because defined benefit pensions offer guaranteed benefits that you cannot get back if you transfer out.If you transfer a defined benefit pension into a defined contribution scheme, you’ll lose the promise of guaranteed retirement income based on your salary and length of service.Instead, the amount you’ll get in retirement depends on how well your invested money performs – so there’s a risk you could get a lot less.You might also need to limit how much you take to make sure it lasts for your full retirement.For full information, see our guide How to transfer out of a defined benefit pension.',
      links: [
        {
          text: 'How to transfer out of a defined benefit pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-transfers-consolidation/transferring-your-defined-benefit-pension',
        },
      ],
    },
    cy: {
      heading: 'Fel arfer, mae’n well i chi adael eich pensiwn lle mae',
      content:
        'Mae’n well i’r rhan fwyaf o bobl gadw buddion wedi’u diffinio, yn ôl yr Awdurdod Ymddygiad Ariannol (FCA) a’r Rheoleiddiwr Pensiynau (TPR).Mae hyn oherwydd bod pensiynau buddion wedi’u diffinio yn cynnig buddion gwarantedig na allwch eu cael yn ôl os byddwch yn trosglwyddo allan.Os byddwch yn trosglwyddo pensiwn buddion wedi’u diffinio i gynllun cyfraniadau wedi’u diffinio, byddwch yn colli’r addewid o incwm ymddeoliad gwarantedig yn seiliedig ar eich cyflog a hyd eich gwasanaeth.Yn lle hynny, mae’r swm a gewch yn ystod ymddeoliad yn dibynnu ar ba mor dda y mae eich arian a fuddsoddwyd yn perfformio - felly mae risg y gallech gael llawer llai.Efallai y bydd angen i chi hefyd gyfyngu ar faint rydych yn ei gymryd i wneud yn siŵr ei fod yn para am eich ymddeoliad llawn.Am wybodaeth lawn, gweler ein canllaw Sut i drosglwyddo allan o bensiwn buddion wedi’u diffinio.',
      links: [
        {
          text: 'Sut i drosglwyddo allan o bensiwn buddion wedi’u diffinio',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-transfers-consolidation/transferring-your-defined-benefit-pension',
        },
      ],
    },
  },
  GP01c: {
    en: {
      heading:
        'Check if you’ll be better off transferring or combining your pensions',
      content:
        'Transferring your defined contribution pension to a different provider or scheme might mean you can:pay less if the new scheme has lower feeshave more options to invest or take your pensionbring multiple pension schemes together so you can manage them in one place – this is called consolidation.You can choose which pensions you want to combine and which you’d like to keep separate – you do not have to combine them all.But with any pension transfer, there’s a risk you might:pay more if the new scheme has higher feeslose valuable benefits that only your current provider offers.For example, your current scheme might offer a bonus payment after a certain date or have a protected pension age that lets you access your pension earlier than other new schemes would.Find out more in our guide Should I transfer or consolidate my pensions?You’re usually better off leaving your defined benefit pension where it isMost people are better off keeping a defined benefit pension, according to the Financial Conduct Authority (FCA) and the Pensions Regulator (TPR).This is because defined benefit pensions offer guaranteed benefits that you cannot get back if you transfer out.If you transfer a defined benefit pension into a defined contribution scheme, you’ll lose the promise of guaranteed retirement income based on your salary.Instead, the amount you’ll get in retirement depends on how well your invested money performs – so there’s a risk you could get a lot less.You might also need to limit how much you take to make sure it lasts for your full retirement.For full information, see our guide How to transfer out of a defined benefit pension.',
      links: [
        {
          text: 'Should I transfer or consolidate my pensions?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-transfers-consolidation/transfer-or-combine-pensions',
        },
        {
          text: 'How to transfer out of a defined benefit pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-transfers-consolidation/transferring-your-defined-benefit-pension',
        },
      ],
    },
    cy: {
      heading:
        'Gwiriwch a fyddech chi’n well eich byd wrth drosglwyddo neu gyfuno’ch pensiynau',
      content:
        'Gallai trosglwyddo’ch pensiwn cyfraniadau wedi’u diffinio i ddarparwr neu gynllun gwahanol olygu y gallwch chi:dalu llai os oes gan y cynllun newydd ffioedd iscael mwy o opsiynau i fuddsoddi neu gymryd eich pensiwndod â chynlluniau pensiwn lluosog at ei gilydd fel y gallwch chi eu rheoli mewn un lle – gelwir hyn yn gyfuno.Gallwch ddewis pa bensiynau rydych chi am eu cyfuno a pha rai yr hoffech chi eu cadw ar wahân – nid oes rhaid i chi eu cyfuno i gyd.Ond gydag unrhyw drosglwyddiad pensiwn, mae risg y gallech chi:dalu mwy os oes gan y cynllun newydd ffioedd uwchcolli buddion gwerthfawr os mai ond eich darparwr presennol sy’n eu cynnig.Er enghraifft, gallai eich cynllun presennol gynnig taliad bonws ar ôl dyddiad penodol neu fod ag oedran pensiwn gwarchodedig sy’n caniatáu i chi gael mynediad at eich pensiwn yn gynharach nag y byddai cynlluniau newydd eraill.Darganfyddwch fwy yn ein canllaw A ddylwn i drosglwyddo neu gyfuno fy mhensiynau?Fel arfer, mae’n well i chi adael eich pensiwn buddion wedi’u diffinio lle maeMae’n well i’r rhan fwyaf o bobl gadw pensiwn buddion wedi’u diffinio, yn ôl yr Awdurdod Ymddygiad Ariannol (FCA) a’r Rheoleiddiwr Pensiynau (TPR).Mae hyn oherwydd bod pensiynau buddion wedi’u diffinio yn cynnig buddion gwarantedig na allwch eu cael yn ôl os byddwch yn trosglwyddo allan.Os byddwch yn trosglwyddo pensiwn buddion wedi’u diffinio i gynllun cyfraniadau wedi’u diffinio, byddwch yn colli’r addewid o incwm ymddeoliad gwarantedig yn seiliedig ar eich cyflog.Yn lle hynny, mae’r swm a gewch yn ystod ymddeoliad yn dibynnu ar ba mor dda y mae eich arian a fuddsoddwyd yn perfformio - felly mae risg y gallech gael llawer llai.Efallai y bydd angen i chi hefyd gyfyngu ar faint rydych yn ei gymryd i wneud yn siŵr ei fod yn para am eich ymddeoliad llawn.Am wybodaeth lawn, gweler ein canllaw Sut i drosglwyddo allan o bensiwn buddion wedi’u diffinio.',
      links: [
        {
          text: 'A ddylwn i drosglwyddo neu gyfuno fy mhensiynau?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-transfers-consolidation/transfer-or-combine-pensions',
        },
        {
          text: 'Sut i drosglwyddo allan o bensiwn buddion wedi’u diffinio',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-transfers-consolidation/transferring-your-defined-benefit-pension',
        },
      ],
    },
  },
  GP02: {
    en: {
      heading: 'Check if your employer will pay more into your pension',
      content:
        'Your employer already pays into your pension, but you might not be getting the maximum amount possible.To check, ask your employer if they offer contribution matching. This means they’ll pay more into your pension if you do too, up to a certain limit.For example, if your employer will match up to 10% of your wages, they’ll typically pay in:5% if you pay in 5%8% if you pay in 8%10% if you pay in 10%.This can add hundreds or thousands of pounds to your pension each year. Our Workplace pension contribution calculator can work out how much you could get.Paying more into your pension might not decrease your take-home pay by as much as you think. This is because you usually get tax relief when you pay into a pension.For example, a £10 contribution into your pension will normally cost you:£8 if you pay basic-rate tax£6 if you pay higher-rate tax.Find out more in our guide Ways to boost your pension.',
      links: [
        {
          text: 'contribution matching',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/contribution-matching',
        },
        {
          text: 'Workplace pension contribution calculator',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/workplace-pension-calculator',
        },
        {
          text: 'Ways to boost your pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/how-to-increase-your-pension-savings',
        },
      ],
    },
    cy: {
      heading: 'Gwiriwch a fydd eich cyflogwr yn talu mwy i mewn i’ch pensiwn',
      content:
        'Mae eich cyflogwr eisoes yn talu i mewn i’ch pensiwn, ond efallai nad ydych chi’n cael y swm mwyaf posibl.I wirio, gofynnwch i’ch cyflogwr a ydyn nhw’n cynnig cyfateb cyfraniadau. Mae hyn yn golygu y byddan nhw’n talu mwy i mewn i’ch pensiwn os gwnewch chi hynny hefyd, hyd at derfyn penodol.Er enghraifft, os bydd eich cyflogwr yn cyfateb hyd at 10% o’ch cyflog, byddan nhw fel arfer yn talu i mewn:5% os ydych chi’n talu 5% i mewn8% os ydych chi’n talu 8% i mewn10% os ydych chi’n talu 10% i mewnGall hyn ychwanegu cannoedd neu filoedd o bunnoedd at eich pensiwn bob blwyddyn. Gall ein Cyfrifiannell cyfraniadau pensiwn gweithle gyfrifo faint y gallech chi ei gael.Efallai na fydd talu mwy i mewn i’ch pensiwn yn lleihau eich cyflog net cymaint ag yr ydych chi’n meddwl. Mae hyn oherwydd eich bod chi fel arfer yn cael rhyddhad treth pan fyddwch chi’n talu i mewn i bensiwn.Er enghraifft, bydd cyfraniad o £10 i’ch pensiwn fel arfer yn costio:£8 os ydych chi’n talu treth ar y gyfradd sylfaenol£6 os ydych chi’n talu treth ar y gyfradd uwch.Darganfyddwch fwy yn ein canllaw Ffyrdd o roi hwb i’ch pensiwn.',
      links: [
        {
          text: 'Cyfrifiannell cyfraniadau pensiwn gweithle',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/workplace-pension-calculator',
        },
        {
          text: 'Ffyrdd o roi hwb i’ch pensiwn',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/how-to-increase-your-pension-savings',
        },
      ],
    },
  },
  GP02a: {
    en: {
      heading:
        'Check if you can boost your pension by making extra contributions',
      content:
        'Your defined benefit pension works by giving you a guaranteed retirement income based on your salary and how long you worked for your employer.But you might be able to increase your benefits by making additional voluntary contributions (AVCs).These are extra payments into your pension on top of your standard contributions, which are usually a set amount based on your current salary.Find out more in our guide Boost your pension with AVCs.If your scheme does not let you make AVCs, you could start your own defined contribution pension for any additional savings.',
      links: [
        {
          text: 'defined benefit pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained',
        },
        {
          text: 'Boost your pension with AVCs',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/what-are-avcs-and-fsavcs',
        },
        {
          text: 'start your own defined contribution pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/choosing-a-pension-yourself',
        },
      ],
    },
    cy: {
      heading:
        'Gwiriwch a allwch chi roi hwb i’ch pensiwn drwy wneud cyfraniadau ychwanegol',
      content:
        'Mae eich pensiwn buddion wedi’u diffinio yn gweithio drwy roi incwm ymddeoliad gwarantedig i chi yn seiliedig ar eich cyflog a pha mor hir y gwnaethoch chi weithio i’ch cyflogwr.Ond efallai y byddwch chi’n gallu cynyddu eich buddion drwy wneud cyfraniadau gwirfoddol ychwanegol (AVCs).Mae’r rhain yn daliadau ychwanegol i’ch pensiwn ar ben eich cyfraniadau safonol, sydd fel arfer yn swm penodol yn seiliedig ar eich cyflog presennol.Darganfyddwch fwy yn ein canllaw Rhoi hwb i’ch pensiwn gydag AVCs.Os nad yw’ch cynllun yn caniatáu i chi wneud AVCs, gallech chi ddechrau eich pensiwn cyfraniadau wedi’u diffinio eich hun ar gyfer unrhyw gynilion ychwanegol.',
      links: [
        {
          text: 'pensiwn buddion wedi’u diffinio',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained',
        },
        {
          text: 'Rhoi hwb i’ch pensiwn gydag AVCs',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/what-are-avcs-and-fsavcs',
        },
        {
          text: 'ddechrau eich pensiwn cyfraniadau wedi’u diffinio eich hun',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/choosing-a-pension-yourself',
        },
      ],
    },
  },
  GP02b: {
    en: {
      heading:
        'Check if you can boost your pension by making extra contributions',
      content:
        'For your defined contribution pension, ask your employer if they offer contribution matching. This means they’ll pay more into your pension if you do too, up to a certain limit.This can add hundreds or thousands of pounds to your pension each year. Our Workplace pension contribution calculator can work out how much you could get.For your defined benefit pension, you might be able to increase your benefits by making additional voluntary contributions (AVCs).These are extra payments into your pension on top of your standard contributions, which are usually a set amount based on your current salary.Find out more in our guide Boost your pension with AVCs.If your scheme does not let you make AVCs, you could start your own defined contribution pension for any additional savings.',
      links: [
        {
          text: 'defined contribution pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained',
        },
        {
          text: 'contribution matching',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/contribution-matching',
        },
        {
          text: 'Workplace pension contribution calculator',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/workplace-pension-calculator',
        },
        {
          text: 'defined benefit pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained',
        },
        {
          text: 'Boost your pension with AVCs',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/what-are-avcs-and-fsavcs',
        },
        {
          text: 'start your own defined contribution pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/choosing-a-pension-yourself',
        },
      ],
    },
    cy: {
      heading:
        'Gwiriwch a allwch chi roi hwb i’ch pensiwn drwy wneud cyfraniadau ychwanegol',
      content:
        'Ar gyfer eich pensiwn cyfraniadau wedi’u diffinio, gofynnwch i’ch cyflogwr a ydyn nhw’n cynnig cyfateb cyfraniadau. Mae hyn yn golygu y byddan nhw’n talu mwy i’ch pensiwn os gwnewch chi hynny hefyd, hyd at derfyn penodol.Gall hyn ychwanegu cannoedd neu filoedd o bunnoedd at eich pensiwn bob blwyddyn. Gall ein Cyfrifiannell cyfraniadau pensiwn gweithle gyfrifo faint y gallech chi ei gael.Ar gyfer eich pensiwn buddion wedi’u diffinio, efallai y byddwch chi’n gallu cynyddu eich buddion drwy wneud cyfraniadau gwirfoddol ychwanegol (AVCs).Mae’r rhain yn daliadau ychwanegol i’ch pensiwn ar ben eich cyfraniadau safonol, sydd fel arfer yn swm penodol yn seiliedig ar eich cyflog presennol.Darganfyddwch fwy yn ein canllaw Rhoi hwb i’ch pensiwn gydag AVCs.Os nad yw’ch cynllun yn caniatáu i chi wneud AVCs, gallech chi ddechrau eich pensiwn cyfraniadau wedi’u diffinio eich hun ar gyfer unrhyw gynilion ychwanegol.',
      links: [
        {
          text: 'cyfraniadau wedi’u diffinio',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes',
        },
        {
          text: 'cyfateb cyfraniadau',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/contribution-matching',
        },
        {
          text: 'Cyfrifiannell cyfraniadau pensiwn gweithle',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/workplace-pension-calculator',
        },
        {
          text: 'pensiwn buddion wedi’u diffinio',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-benefit-or-final-salary-pensions-schemes-explained',
        },
        {
          text: 'Rhoi hwb i’ch pensiwn gydag AVCs',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/what-are-avcs-and-fsavcs',
        },
        {
          text: 'ddechrau eich pensiwn cyfraniadau wedi’u diffinio eich hun',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/choosing-a-pension-yourself',
        },
      ],
    },
  },
  GP03: {
    en: {
      heading: 'Ask to join your employer’s pension scheme',
      content:
        'You can ask to join your employer’s workplace pension scheme at any time from age 16 to 75. If you previously left the scheme and want to rejoin, some schemes will allow this at any time while others might only allow it once a year.Your employer must also automatically enrol you in a pension scheme if you’re a UK resident and:usually work in the UKare between age 22 and the State Pension ageearn more than £192 a week, £833 a month or £10,000 a yeardo not already have a suitable workplace pension.This includes if you had previously opted out but still meet the criteria, so you’re likely to be auto-enrolled again within three years of opting out.For more information, see our guide about pension auto-enrolment.',
      links: [
        {
          text: 'State Pension age',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'pension auto-enrolment',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/automatic-enrolment-an-introduction',
        },
      ],
    },
    cy: {
      heading: 'Gofynnwch i ymuno â chynllun pensiwn eich cyflogwr',
      content:
        'Gallwch ofyn i ymuno â chynllun pensiwn gweithle eich cyflogwr ar unrhyw adeg rhwng 16 a 75 oed. Os gwnaethoch adael y cynllun o’r blaen ac eisiau ailymuno, bydd rhai cynlluniau’n caniatáu hyn ar unrhyw adeg tra bydd eraill efallai ond yn ei ganiatáu unwaith y flwyddyn.Rhaid i’ch cyflogwr hefyd eich cofrestru’n awtomatig mewn cynllun pensiwn os ydych chi’n breswylydd yn y DU ac:fel arfer yn gweithio yn y DUrhwng 22 oed ac oedran Pensiwn y Wladwriaethyn ennill mwy na £192 yr wythnos, £833 y mis neu £10,000 y flwyddynnad oes gennych bensiwn gweithle addas eisoes.Mae hyn yn cynnwys os oeddech wedi optio allan o’r blaen ond yn dal i fodloni’r meini prawf, felly mae’n debygol y byddwch yn cael eich cofrestru’n awtomatig eto o fewn tair blynedd i optio allan.Am ragor o wybodaeth, gweler ein canllaw am gofrestru awtomatig pensiwn.',
      links: [
        {
          text: 'oedran Pensiwn y Wladwriaeth',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'gofrestru awtomatig pensiwn',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/automatic-enrolment-an-introduction',
        },
      ],
    },
  },
  GP04: {
    en: {
      heading:
        'Check the cost of increasing your contributions and benefit from extra tax relief',
      content:
        'Your pension will usually pay you a higher retirement income if you can save over the longest period possible. This is because the amount you’ll get largely depends on:how much you pay inhow much is added from investment growth.Our Pension calculator can help you work out an estimate of your total retirement income, including how much you might need and how it might change if you save more.For example, if you save £200 into a pension each month, at age 65 your pension could be worth around:£158,000 if you start at age 20£112,000 if you start at age 30£73,000 if you start at age 40£40,000 if you start at age 50.You’ll usually benefit from extra tax reliefWhen you pay into a pension, you usually benefit from tax relief. This is a top-up payment from the government and means the money you’d normally pay in Income Tax goes into your pension instead.For example, for every £100 paid into your pension:a basic-rate taxpayer (20%) pays £80a higher-rate taxpayer (40%) pays £60.The rest comes from tax relief.Each tax year, you can usually get tax relief on your pension contributions up to 100% of your earnings or £60,000 – whichever is lower.If you earn less than £3,600, you can save up to £2,880 into a pension and still get tax relief.You might need to claim some of your tax reliefIf you pay Income Tax above 20%, you’ll usually need to claim the extra tax relief yourself. You can:claim on GOV.UKcontact HMRC orcomplete a Self Assessment tax return.For more information, see our guide about Self-employed pensions.',
      links: [
        {
          text: 'Pension calculator',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
        },
        {
          text: 'tax relief',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/tax-relief-and-your-pension',
        },
        {
          text: 'claim on GOV.UK',
          url: 'https://www.gov.uk/guidance/claim-tax-relief-on-your-private-pension-payments',
        },
        {
          text: 'contact HMRC',
          url: 'https://www.gov.uk/find-hmrc-contacts/income-tax-enquiries',
        },
        {
          text: 'Self Assessment tax return',
          url: 'https://www.gov.uk/register-for-self-assessment',
        },
        {
          text: 'Self-employed pensions',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pensions-for-self-employed-people',
        },
      ],
    },
    cy: {
      heading:
        'Gwiriwch gost cynyddu eich cyfraniadau a manteisiwch ar ryddhad treth ychwanegol',
      content:
        'Fel arfer, bydd eich pensiwn yn talu incwm ymddeoliad uwch i chi os gallwch chi arbed dros y cyfnod hiraf posibl. Mae hyn oherwydd bod y swm y byddwch chi’n ei gael yn dibynnu’n fawr ar:faint rydych chi’n ei dalu i mewnfaint sy’n cael ei ychwanegu o dwf buddsoddiad.Gall ein Cyfrifiannell pensiwn eich helpu i gyfrifo amcangyfrif o gyfanswm eich incwm ymddeoliad, gan gynnwys faint y gallech fod ei angen a sut y gallai newid os byddwch chi’n cynilo mwy.Er enghraifft, os ydych chi’n cynilo £200 i mewn i bensiwn bob mis, yn 65 oed gallai eich pensiwn fod werth tua:£158,000 os byddwch chi’n dechrau yn 20 oed£112,000 os byddwch chi’n dechrau yn 30 oed£73,000 os byddwch chi’n dechrau yn 40 oed£40,000 os byddwch chi’n dechrau yn 50 oed.Fel arfer, byddwch chi’n elwa o ryddhad treth ychwanegolPan fyddwch chi’n talu i mewn i bensiwn, fel arfer byddwch chi’n elwa o ryddhad treth. Mae hwn yn daliad ychwanegol gan y llywodraeth ac mae’n golygu bod yr arian y byddech chi fel arfer yn ei dalu mewn Treth Incwm yn mynd i’ch pensiwn yn lle.Er enghraifft, am bob £100 a delir i’ch pensiwn:mae trethdalwr cyfradd sylfaenol (20%) yn talu £80mae trethdalwr cyfradd uwch (40%) yn talu £60.Daw’r gweddill o ryddhad treth.Bob blwyddyn dreth, fel arfer gallwch gael rhyddhad treth ar eich cyfraniadau pensiwn hyd at 100% o’ch enillion neu £60,000 – pa bynnag un sydd isaf.Os ydych chi’n ennill llai na £3,600, gallwch chi gynilo hyd at £2,880 i mewn i bensiwn a dal i gael rhyddhad treth.Efallai y bydd angen i chi hawlio rhywfaint o’ch rhyddhad trethOs ydych chi’n talu Treth Incwm uwchlaw 20%, fel arfer bydd angen i chi hawlio’r rhyddhad treth ychwanegol eich hun. Gallwch:wneud cais ar GOV.UKcysylltu â CThEF neucwblhau ffurflen dreth Hunanasesiad.Am ragor o wybodaeth, gweler ein canllaw am bensiynau hunangyflogedig.',
      links: [
        {
          text: 'Cyfrifiannell pensiwn',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-calculator',
        },
        {
          text: 'ryddhad treth',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/tax-relief-and-your-pension',
        },
        {
          text: 'wneud cais ar GOV.UK',
          url: 'https://www.gov.uk/guidance/claim-tax-relief-on-your-private-pension-payments',
        },
        {
          text: 'cysylltu â CThEF',
          url: 'https://www.gov.uk/government/organisations/hm-revenue-customs/contact/income-tax-enquiries-for-individuals-pensioners-and-employees',
        },
        {
          text: 'ffurflen dreth Hunanasesiad',
          url: 'https://www.gov.uk/register-for-self-assessment',
        },
        {
          text: 'bensiynau hunangyflogedig',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pensions-for-self-employed-people',
        },
      ],
    },
  },
  GP05: {
    en: {
      heading: 'Start your own pension',
      content:
        'By itself, the State Pension is unlikely to give you enough money for a comfortable retirement – even if you qualify for the maximum amount.You’ll also need to wait until your State Pension age to claim it.Starting your own pension means you’ll normally:have more money to live off in retirementbe able to take your pension anytime from age 55 (57 from April 2028)get an income if you need to retire early due to poor health.Many pension providers will let you choose how much you pay in and how often – like a regular amount or one-off payments as and when.For more information, see our guides:A guide to self-employed pensionsHow to start your own pension',
      links: [
        {
          text: 'your State Pension age',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'A guide to self-employed pensions',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pensions-for-self-employed-people',
        },
        {
          text: 'How to start your own pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/choosing-a-pension-yourself',
        },
      ],
    },
    cy: {
      heading: 'Dechrau eich pensiwn eich hun',
      content:
        'Ar ei ben ei hun, mae’n annhebygol y bydd Pensiwn y Wladwriaeth yn rhoi digon o arian i chi ar gyfer ymddeoliad cyfforddus – hyd yn oed os ydych chi’n gymwys ar gyfer y swm uchaf.Bydd angen i chi hefyd aros tan eich oedran Pensiwn y Wladwriaeth i’w hawlio.Mae dechrau eich pensiwn eich hun fel arfer yn golygu y byddwch chi:yn cael mwy o arian i fyw arno yn eich ymddeoliadyn gallu cymryd eich pensiwn unrhyw bryd o 55 oed (57 o fis Ebrill 2028)yn cael incwm os oes angen i chi ymddeol yn gynnar oherwydd iechyd gwael.Bydd llawer o ddarparwyr pensiwn yn gadael i chi ddewis faint rydych chi’n ei dalu i mewn a pha mor aml – fel swm rheolaidd neu daliadau untro pryd bynnag.Am ragor o wybodaeth, gweler ein canllawiau:Canllaw i bensiynau hunangyflogedigSut i ddechrau eich pensiwn eich hun',
      links: [
        {
          text: 'oedran Pensiwn y Wladwriaeth',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'Canllaw i bensiynau hunangyflogedig',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pensions-for-self-employed-people',
        },
        {
          text: 'Sut i ddechrau eich pensiwn eich hun',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/choosing-a-pension-yourself',
        },
      ],
    },
  },
  GP06: {
    en: {
      heading: 'Check if you’re saving enough for your retirement',
      content:
        'If you set up your own pension, your pension provider might have a minimum amount you must pay in each month, like £100. But you typically need to pay in much more than the minimum to save enough for a comfortable retirement.Our Pension calculator can work out an estimate of your retirement income, including how much you might need and how it could change if you save more.When you pay into a pension, you usually benefit from tax relief. This is a top-up payment from the government and means the money you’d normally pay in Income Tax goes into your pension instead.For example, for every £100 paid into your pension:a basic-rate taxpayer (20%) pays £80a higher-rate taxpayer (40%) pays £60.The rest comes from tax relief.Each tax year, you can usually get tax relief on your pension contributions up to 100% of your earnings or £60,000 – whichever is lower.If you earn less than £3,600, you can save up to £2,880 into a pension and still get tax relief.For more information, see Why should I save into a pension?The Retirement Living Standards also lists how much you might need for a comfortable retirement.',
      links: [
        {
          text: 'Pension calculator',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
        },
      ],
    },
    cy: {
      heading: 'Gwiriwch a ydych chi’n cynilo digon ar gyfer eich ymddeoliad',
      content:
        'Os ydych chi’n sefydlu eich pensiwn eich hun, efallai y bydd gan eich darparwr isafswm y mae’n rhaid i chi ei dalu i mewn bob mis, fel £100. Ond fel arfer mae angen i chi dalu llawer mwy na’r isafswm i gynilo digon ar gyfer ymddeoliad cyfforddus.Gall ein Cyfrifiannell pensiwn gyfrifo amcangyfrif o’ch incwm ymddeoliad, gan gynnwys faint y gallech fod ei angen a sut y gallai newid os byddwch chi’n cynilo mwy.Pan fyddwch chi’n talu i mewn i bensiwn, fel arfer rydych chi’n elwa o ryddhad treth. Mae hwn yn daliad ychwanegol gan y llywodraeth ac mae’n golygu bod yr arian y byddech chi fel arfer yn ei dalu mewn Treth Incwm yn mynd i mewn i’ch pensiwn yn lle.Er enghraifft, am bob £100 a delir i mewn i’ch pensiwn:mae trethdalwr cyfradd sylfaenol (20%) yn talu £80mae trethdalwr cyfradd uwch (40%) yn talu £60.Daw’r gweddill o ryddhad treth.Bob blwyddyn dreth, fel arfer gallwch gael rhyddhad treth ar eich cyfraniadau pensiwn hyd at 100% o’ch enillion neu £60,000 - pa bynnag un sydd isaf.Os ydych chi’n ennill llai na £3,600, gallwch chi gynilo hyd at £2,880 i mewn i bensiwn a dal i gael rhyddhad treth.Am ragor o wybodaeth, gweler Pam ddylwn i gynilo i mewn i bensiwn?Mae Retirement Living Standards hefyd yn rhestru faint y gallech fod ei angen ar gyfer ymddeoliad cyfforddus.',
      links: [
        {
          text: 'Cyfrifiannell pensiwn',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/pension-calculator',
        },
        {
          text: 'Pam ddylwn i gynilo i mewn i bensiwn?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
        },
        {
          text: 'Retirement Living Standards',
          url: 'https://www.retirementlivingstandards.org.uk/',
        },
      ],
    },
  },
  GP07: {
    en: {
      heading: 'Start your own pension',
      content:
        'Even if you qualify for the maximum State Pension, it’s unlikely to give you enough money for a comfortable retirement. You’ll also need to wait until your State Pension age to claim it.Saving into your own pension means you can:choose to take money from age 55 (57 from April 2028) or younger if you need to retire due to poor healthstill claim the State Pension when you’re old enough.For more information, see:our guide Why should I save into a pension?how much you might need for a comfortable retirement on the Retirement Living Standards website.',
      links: [
        {
          text: 'your State Pension age',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'retire due to poor health',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/early-retirement-because-of-illness-sickness-or-disability',
        },
        {
          text: 'Why should I save into a pension?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
        },
        {
          text: 'Retirement Living Standards',
          url: 'https://www.retirementlivingstandards.org.uk/',
        },
      ],
    },
    cy: {
      heading: 'Dechreuwch eich pensiwn eich hun',
      content:
        'Hyd yn oed os ydych chi’n gymwys ar gyfer y Pensiwn y Wladwriaeth uchaf, mae’n annhebygol y bydd yn rhoi digon o arian i chi ar gyfer ymddeoliad cyfforddus. Bydd angen i chi hefyd aros tan eich oedran Pensiwn y Wladwriaeth i’w hawlio.Mae cynilo i’ch pensiwn eich hun yn golygu y gallwch chi:ddewis cymryd arian o 55 oed (57 o fis Ebrill 2028) neu’n iau os oes angen i chi ymddeol oherwydd iechyd gwaeldal i hawlio’r Pensiwn y Wladwriaeth pan fyddwch chi’n ddigon hen.Am ragor o wybodaeth, gweler:ein canllaw Pam ddylwn i gynilo i bensiwn?faint y gallech fod ei angen ar gyfer ymddeoliad cyfforddus ar wefan Retirement Living Standards',
      links: [
        {
          text: 'oedran Pensiwn y Wladwriaeth',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'ymddeol oherwydd iechyd gwael',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/early-retirement-because-of-illness-sickness-or-disability',
        },
        {
          text: 'Pam ddylwn i gynilo i bensiwn?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
        },
        {
          text: 'Retirement Living Standards',
          url: 'https://www.retirementlivingstandards.org.uk/',
        },
      ],
    },
  },
  GP07a: {
    en: {
      heading: 'Consider paying into your own pension',
      content:
        'Even if you qualify for the maximum State Pension, it’s unlikely to give you enough money for a comfortable retirement. You’ll also need to wait until your State Pension age to claim it.Saving into your own pension means you can:choose to take money from age 55 (57 from April 2028) or younger if you need to retire due to poor healthstill claim the State Pension when you’re old enough.When you pay into a pension, the government adds a top-up payment called tax relief.Each tax year, you can usually get tax relief on your pension contributions up to 100% of your earnings or £60,000 – whichever is lower.If you earn less than £3,600, you can save up to £2,880 into a pension and still get 20% basic-rate tax relief.The only risk is if you’re close to your State Pension age and unlikely to get the full amount of State Pension.This is because you might currently be eligible for Pension Credit, which could top up your income for free. Even a small pension income can mean you no longer qualify.For more information, see:our guide Why should I save into a pension?how much you might need for a comfortable retirement on the Retirement Living Standards website.',
      links: [
        {
          text: 'your State Pension age',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'retire due to poor health',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/early-retirement-because-of-illness-sickness-or-disability',
        },
        {
          text: 'State Pension age',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'Pension Credit',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension/pension-credit',
        },
        {
          text: 'Why should I save into a pension?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
        },
        {
          text: 'Retirement Living Standards',
          url: 'https://www.retirementlivingstandards.org.uk/',
        },
      ],
    },
    cy: {
      heading: 'Ystyriwch gyfrannu at eich pensiwn eich hun.',
      content:
        'Hyd yn oed os ydych chi’n gymwys ar gyfer y Pensiwn y Wladwriaeth uchaf, mae’n annhebygol y bydd yn rhoi digon o arian i chi ar gyfer ymddeoliad cyfforddus. Bydd angen i chi hefyd aros tan eich oedran Pensiwn y Wladwriaeth i’w hawlio.Mae cynilo i’ch pensiwn eich hun yn golygu y gallwch chi:ddewis cymryd arian o 55 oed (57 o fis Ebrill 2028) neu’n iau os oes angen i chi ymddeol oherwydd iechyd gwaeldal i hawlio’r Pensiwn y Wladwriaeth pan fyddwch chi’n ddigon hen.Pan fyddwch yn talu i mewn i bensiwn, mae’r llywodraeth yn ychwanegu taliad ychwanegol o’r enw rhyddhad treth.Bob blwyddyn dreth, gallwch fel arfer gael rhyddhad treth ar eich cyfraniadau pensiwn hyd at 100% o’ch enillion neu £60,000 – pa bynnag un sy’n is.Os ydych yn ennill llai na £3,600, gallwch gynilo hyd at £2,880 mewn pensiwn a pharhau i gael rhyddhad treth ar y gyfradd sylfaenol o 20%.Yr unig risg yw os ydych yn agos at eich oedran Pensiwn y Wladwriaeth ac yn annhebygol o gael swm llawn Pensiwn y Wladwriaeth.Mae hyn oherwydd efallai eich bod ar hyn o bryd yn gymwys i gael Credyd Pensiwn, a allai roi hwb i’ch incwm am ddim. Gall hyd yn oed incwm pensiwn bach olygu nad ydych yn gymwys mwyach.Am ragor o wybodaeth, gweler:ein canllaw Pam ddylwn i gynilo i bensiwn?faint y gallech fod ei angen ar gyfer ymddeoliad cyfforddus ar wefan Retirement Living Standards',
      links: [
        {
          text: 'oedran Pensiwn y Wladwriaeth',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'ymddeol oherwydd iechyd gwael',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/early-retirement-because-of-illness-sickness-or-disability',
        },
        {
          text: 'Pensiwn y Wladwriaeth',
          url: 'https://www.gov.uk/state-pension-age',
        },
        {
          text: 'Credyd Pensiwn',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension/pension-credit',
        },
        {
          text: 'Pam ddylwn i gynilo i bensiwn?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/why-save-into-a-pension',
        },
        {
          text: 'Retirement Living Standards',
          url: 'https://www.retirementlivingstandards.org.uk/',
        },
      ],
    },
  },
  GP08: {
    en: {
      heading: 'Understand your pension options if you move overseas',
      content:
        'If you move overseas, you usually have 2 options for your UK pension – leave it where it is or take it with youOption 1: Leave your pension where it isYou must tell your provider you’re moving overseas, but your pension will continue to be managed in the UK.When you’re ready to take your pension, it’s usually paid in pounds and taxed as UK income. If you need it in a different currency, you could transfer the money into a foreign exchange account – many large banks offer these.The main risk is not knowing how much pension income you’re going to get because:you might need to pay exchange feesexchange rates often change daily.If you plan to continue paying into a UK pension after you move abroad, you might also not qualify for any tax relief on your contributions.For more information, see Can I save into a UK pension if I live overseas?Option 2: Transfer your pension to an overseas scheme You could consider moving your pension to an overseas scheme to get your pension income:paid in your local currency taxed in the country you’re moving to.This can be complicated, so it’s usually a good idea to pay for financial advice in the UK and in the country you’re moving your pension to.For more information, see our guide How to move your UK pension overseas.',
      links: [
        {
          text: 'Can I save into a UK pension if I live overseas?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/moving-living-and-retiring-abroad#Can-I-save-into-a-UK-pension-scheme-if-I-live-overseas',
        },
        {
          text: 'How to move your UK pension overseas.',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-transfers-consolidation/moving-your-uk-pension-overseas',
        },
      ],
    },
    cy: {
      heading: 'Deall eich opsiynau pensiwn os byddwch yn symud dramor',
      content:
        'Os byddwch yn symud dramor, fel arfer mae gennych 2 opsiwn ar gyfer eich pensiwn yn y DU – ei adael lle mae neu ei gymryd gyda chi.Opsiwn 1: Gadael eich pensiwn lle mae eisoesRhaid i chi ddweud wrth eich darparwr eich bod yn symud dramor, ond bydd eich pensiwn yn parhau i gael ei reoli yn y DU.Pan fyddwch yn barod i gymryd eich pensiwn, fel arfer caiff ei dalu mewn punnoedd a’i drethu fel incwm yn y DU. Os oes ei angen arnoch mewn arian cyfred gwahanol, gallech drosglwyddo’r arian i gyfrif cyfnewid tramor – mae llawer o fanciau mawr yn cynnig y rhain.Y prif risg yw peidio â gwybod faint o incwm pensiwn y byddwch yn ei gael oherwydd:efallai y bydd angen i chi dalu ffioedd cyfnewidmae cyfraddau cyfnewid yn aml yn newid yn ddyddiol.Os ydych chi’n bwriadu parhau i dalu i mewn i bensiwn yn y DU ar ôl i chi symud dramor, efallai na fyddwch yn gymwys i gael unrhyw ryddhad treth ar eich cyfraniadau chwaith.Am ragor o wybodaeth, gweler A allaf gynilo mewn pensiwn yn y DU os ydw i’n byw dramor?Opsiwn 2: Trosglwyddo eich pensiwn i gynllun tramorFe allech chi ystyried symud eich pensiwn i gynllun tramor i gael eich incwm pensiwn:wedi’i dalu yn eich arian cyfred lleolwedi’i drethu yn y wlad rydych chi’n symud iddi.Gall hyn fod yn gymhleth, felly fel arfer mae’n syniad da talu am gyngor ariannol yn y DU ac yn y wlad rydych chi’n symud eich pensiwn iddi.Am ragor o wybodaeth, gweler ein canllaw Sut i symud eich pensiwn y DU dramor.',
      links: [
        {
          text: 'A allaf gynilo mewn pensiwn yn y DU os ydw i’n byw dramor?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/moving-living-and-retiring-abroad#Can-I-save-into-a-UK-pension-scheme-if-I-live-overseas',
        },
        {
          text: 'Sut i symud eich pensiwn y DU dramor',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-transfers-consolidation/moving-your-uk-pension-overseas',
        },
      ],
    },
  },
  GP08a: {
    en: {
      heading:
        'Check if your UK State Pension will be affected by moving overseas',
      content:
        'You can claim the UK State Pension if you move overseas, but you will not qualify for:annual increases - unless the country you’re moving to is listed on GOV.UKPension Credit.If your State Pension is paid into an international account, you’ll receive it in your local currency. This means the amount you’ll get depends on the exchange rate at the time.For more information, see our guide What happens to my pension if I retire abroad?',
      links: [
        {
          text: 'State Pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension/state-pension-an-overview',
        },
        {
          text: 'country you’re moving to is listed on GOV.UK',
          url: 'https://www.gov.uk/government/publications/state-pensions-annual-increases-if-you-live-abroad/countries-where-we-pay-an-annual-increase-in-the-state-pension',
        },
        {
          text: 'Pension Credit',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension/pension-credit',
        },
        {
          text: 'What happens to my pension if I retire abroad?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/moving-living-and-retiring-abroad',
        },
      ],
    },
    cy: {
      heading:
        'Gwiriwch a fydd eich Pensiwn y Wladwriaeth y DU yn cael ei effeithio gan symud dramor',
      content:
        'Gallwch hawlio Pensiwn y Wladwriaeth y DU os byddwch yn symud dramor, ond ni fyddwch yn gymwys ar gyfer:cynnydd blynyddol – oni bai bod y wlad rydych yn symud iddi wedi’i rhestru ar GOV.UKCredyd Pensiwn.Os telir eich Pensiwn y Wladwriaeth i gyfrif rhyngwladol, byddwch yn ei dderbyn yn eich arian cyfred lleol. Mae hyn yn golygu bod y swm a gewch yn dibynnu ar y gyfradd gyfnewid ar y pryd.Am ragor o wybodaeth, gweler ein canllaw Beth sy’n digwydd i’m pensiwn os byddaf yn ymddeol dramor?',
      links: [
        {
          text: 'Pensiwn y Wladwriaeth',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension/state-pension-an-overview',
        },
        {
          text: 'y wlad rydych yn symud iddi wedi’i rhestru ar GOV.UK',
          url: 'https://www.gov.uk/government/publications/state-pensions-annual-increases-if-you-live-abroad/countries-where-we-pay-an-annual-increase-in-the-state-pension',
        },
        {
          text: 'Credyd Pensiwn',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension/pension-credit',
        },
        {
          text: 'Beth sy’n digwydd i’m pensiwn os byddaf yn ymddeol dramor?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/moving-living-and-retiring-abroad',
        },
      ],
    },
  },
  GP08b: {
    en: {
      heading: 'Decide if you want to move your pension overseas',
      content:
        'If you move overseas, you usually have 2 options for your UK pension – leave it where it is or take it with you.Option 1: Leave your pension where it is You must tell your provider you’re moving overseas, but your pension will continue to be managed in the UK.When you’re ready to take your pension, it’s usually paid in pounds and taxed as UK income. If you need it in a different currency, you could transfer the money into a foreign exchange account – many large banks offer these.The main risk is not knowing how much pension income you’re going to get because:you might need to pay exchange feesexchange rates often change daily.If you plan to continue paying into a UK pension after you move abroad, you might also not qualify for any tax relief on your contributions.For more information, see Can I save into a UK pension if I live overseas?Option 2: Transfer your pension to an overseas schemeYou could consider moving your pension to an overseas scheme to get your pension income:paid in your local currency taxed in the country you’re moving to. This can be complicated, so it’s usually a good idea to pay for financial advice in the UK and in the country you’re moving your pension to.For more information, see our guide How to move your UK pension overseas.Your UK State Pension might be affected if you move overseasYou can claim the UK State Pension if you move overseas, but you will not qualify for:annual increases – unless the country you’re moving to is listed on GOV.UKPension Credit.If your State Pension is paid into an international account, you’ll receive it in your local currency. This means the amount you’ll get depends on the exchange rate at the time.For more information, see our guide What happens to my pension if I retire abroad?',
      links: [
        {
          text: 'Can I save into a UK pension if I live overseas?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/moving-living-and-retiring-abroad#Can-I-save-into-a-UK-pension-scheme-if-I-live-overseas-',
        },
        {
          text: 'How to move your UK pension overseas.',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-transfers-consolidation/moving-your-uk-pension-overseas',
        },
        {
          text: 'State Pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension/state-pension-an-overview',
        },
        {
          text: 'country you’re moving to is listed on GOV.UK',
          url: 'https://www.gov.uk/government/publications/state-pensions-annual-increases-if-you-live-abroad/countries-where-we-pay-an-annual-increase-in-the-state-pension',
        },
        {
          text: 'Pension Credit',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension/pension-credit',
        },
        {
          text: 'What happens to my pension if I retire abroad?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/moving-living-and-retiring-abroad',
        },
      ],
    },
    cy: {
      heading: 'Penderfynwch a ydych chi eisiau symud eich pensiwn dramor',
      content:
        'Os byddwch chi’n symud dramor, fel arfer mae gennych 2 opsiwn ar gyfer eich pensiwn yn y DU – ei adael lle mae neu ei gymryd gyda chi.Opsiwn 1: Gadael eich pensiwn lle mae eisoesRhaid i chi ddweud wrth eich darparwr eich bod chi’n symud dramor, ond bydd eich pensiwn yn parhau i gael ei reoli yn y DU.Pan fyddwch chi’n barod i gymryd eich pensiwn, fel arfer caiff ei dalu mewn punnoedd a’i drethu fel incwm yn y DU. Os oes ei angen arnoch chi mewn arian cyfred gwahanol, gallech chi drosglwyddo’r arian i gyfrif cyfnewid tramor – mae llawer o fanciau mawr yn cynnig y rhain.Y prif risg yw peidio â gwybod faint o incwm pensiwn y byddwch chi’n ei gael oherwydd:efallai y bydd angen i chi dalu ffioedd cyfnewidmae cyfraddau cyfnewid yn aml yn newid yn ddyddiol.Os ydych chi’n bwriadu parhau i dalu i mewn i bensiwn y DU ar ôl i chi symud dramor, efallai na fyddwch chi’n gymwys i gael unrhyw ryddhad treth ar eich cyfraniadau chwaith.Am ragor o wybodaeth, gweler A allaf gynilo i mewn i bensiwn y DU os ydw i’n byw dramor?Opsiwn 2: Trosglwyddo eich pensiwn i gynllun tramorFe allech chi ystyried symud eich pensiwn i gynllun tramor i gael eich incwm pensiwn:wedi’i dalu yn eich arian cyfred lleolwedi’i drethu yn y wlad rydych chi’n symud iddi.Gall hyn fod yn gymhleth, felly fel arfer mae’n syniad da talu am gyngor ariannol yn y DU ac yn y wlad rydych chi’n symud eich pensiwn iddi.Am ragor o wybodaeth, gweler ein canllaw Sut i symud eich pensiwn y DU dramor.Efallai y bydd eich Pensiwn Gwladwriaeth y DU yn cael ei effeithio os byddwch chi’n symud dramorGallwch hawlio Pensiwn y Wladwriaeth y DU os byddwch yn symud dramor, ond ni fyddwch yn gymwys ar gyfer:cynnydd blynyddol – oni bai bod y wlad rydych yn symud iddi wedi’i rhestru ar GOV.UKCredyd Pensiwn.Os telir eich Pensiwn y Wladwriaeth i gyfrif rhyngwladol, byddwch yn ei dderbyn yn eich arian cyfred lleol. Mae hyn yn golygu bod y swm a gewch yn dibynnu ar y gyfradd gyfnewid ar y pryd.Am ragor o wybodaeth, gweler ein canllaw Beth sy’n digwydd i’m pensiwn os byddaf yn ymddeol dramor?',
      links: [
        {
          text: 'A allaf gynilo i mewn i bensiwn y DU os ydw i’n byw dramor?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/moving-living-and-retiring-abroad#Can-I-save-into-a-UK-pension-scheme-if-I-live-overseas-',
        },
        {
          text: 'Sut i symud eich pensiwn y DU dramor',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-transfers-consolidation/moving-your-uk-pension-overseas',
        },
        {
          text: 'Pensiwn y Wladwriaeth',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension/state-pension-an-overview',
        },
        {
          text: 'y wlad rydych yn symud iddi wedi’i rhestru ar GOV.UK',
          url: 'https://www.gov.uk/government/publications/state-pensions-annual-increases-if-you-live-abroad/countries-where-we-pay-an-annual-increase-in-the-state-pension',
        },
        {
          text: 'Credyd Pensiwn',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension/pension-credit',
        },
        {
          text: 'Beth sy’n digwydd i’m pensiwn os byddaf yn ymddeol dramor?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/moving-living-and-retiring-abroad',
        },
      ],
    },
  },
  GP09: {
    en: {
      heading:
        'Consider using the value of your home to boost your retirement income',
      content:
        'There are ways of using the value of your home to increase your income in retirement, including paying for any care costs. For example, you could:move to a cheaper home and save or invest the difference, called downsizingborrow money tied up in your home using a retirement mortgage from age 50 or equity release from age 55.For more information on your options, see our guide Should I downsize my home to fund my retirement?',
      links: [
        {
          text: 'Should I downsize my home to fund my retirement?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
      ],
    },
    cy: {
      heading:
        'Ystyriwch ddefnyddio gwerth eich cartref i hybu eich incwm ymddeoliad',
      content:
        'Mae yna ffyrdd o ddefnyddio gwerth eich cartref i gynyddu eich incwm yn eich ymddeoliad, gan gynnwys talu am unrhyw gostau gofal. Er enghraifft, gallech:symud i gartref rhatach a chynilo neu fuddsoddi’r gwahaniaeth, a elwir yn lleihau maint eich cartrefbenthyg arian sydd wedi’i glymu yn eich cartref gan ddefnyddio morgais ymddeoliad o 50 oed neu ryddhau ecwiti o 55 oed.Am ragor o wybodaeth am eich opsiynau, gweler ein canllaw A ddylwn i leihau maint fy nghartref i ariannu fy ymddeoliad?',
      links: [
        {
          text: 'A ddylwn i leihau maint fy nghartref i ariannu fy ymddeoliad?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
      ],
    },
  },
  GP09a: {
    en: {
      heading:
        'Consider using the value of your home to boost your retirement income',
      content:
        'There are ways of using the value of your home to increase your income in retirement, including paying for any care costs. For example, you could:move to a cheaper home and save or invest the difference, called downsizingborrow money tied up in your home using a retirement mortgage from age 50 or equity release from age 55.For more information on your options, see our guide Should I downsize my home to fund my retirement?',
      links: [
        {
          text: 'Should I downsize my home to fund my retirement?',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
      ],
    },
    cy: {
      heading:
        'Ystyriwch ddefnyddio gwerth eich cartref i hybu eich incwm ymddeoliad',
      content:
        'Mae yna ffyrdd o ddefnyddio gwerth eich cartref i gynyddu eich incwm yn eich ymddeoliad, gan gynnwys talu am unrhyw gostau gofal. Er enghraifft, gallech:symud i gartref rhatach a chynilo neu fuddsoddi’r gwahaniaeth, a elwir yn lleihau maint eich cartrefbenthyg arian sydd wedi’i glymu yn eich cartref gan ddefnyddio morgais ymddeoliad o 50 oed neu ryddhau ecwiti o 55 oed.Am ragor o wybodaeth am eich opsiynau, gweler ein canllaw A ddylwn i leihau maint fy nghartref i ariannu fy ymddeoliad?',
      links: [
        {
          text: 'A ddylwn i leihau maint fy nghartref i ariannu fy ymddeoliad?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
      ],
    },
  },
  GP10: {
    en: {
      heading:
        'Consider using the value of your home to boost your retirement income',
      content:
        'You might be able to use the value of your home to increase your income in retirement, including paying for any care costs. This includes:Moving to a cheaper home and saving or investing the difference, called downsizing. This can also help make sure your home is suitable for your future needs, such as a bungalow, retirement property or sheltered housing.Accessing the money tied up in your home, either using a mortgage or equity release.With a retirement interest-only (RIO) mortgage, you pay a monthly amount to cover the interest and repay the loan when you sell the house, die, move into long-term care or at the end of the mortgage term. This is usually available from age 50.With equity release, from age 55, you can normally choose to either:take out a lifetime mortgage with monthly interest payments – the loan is then repaid when you sell, die or move outsell all or part of your home to a home reversion plan provider for less than its market value and stay living there as a tenant for an agreed period with a low amount of rent to pay.You might also be able to use equity release scheme to fund your care.',
      links: [
        {
          text: 'downsizing',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
        {
          text: 'retirement interest-only (RIO) mortgage',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/retirement-interest-only-mortgages',
        },
        {
          text: 'equity release',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/what-is-equity-release',
        },
        {
          text: 'use equity release scheme to fund your care',
          url: 'https://www.moneyhelper.org.uk/en/family-and-care/long-term-care/using-an-equity-release-scheme-to-fund-your-care',
        },
      ],
    },
    cy: {
      heading:
        'Ystyriwch ddefnyddio gwerth eich cartref i hybu eich incwm ymddeoliad',
      content:
        'Efallai y byddwch yn gallu defnyddio gwerth eich cartref i gynyddu eich incwm yn eich ymddeoliad, gan gynnwys talu am unrhyw gostau gofal. Mae hyn yn cynnwys:Symud i gartref rhatach a chynilo neu fuddsoddi’r gwahaniaeth, a elwir yn lleihau maint eich cartref. Gall hyn hefyd helpu i sicrhau bod eich cartref yn addas ar gyfer eich anghenion yn y dyfodol, fel byngalo, eiddo ymddeoliad neu dai gwarchod.Cael mynediad at yr arian sydd wedi’i glymu yn eich cartref, naill ai gan ddefnyddio morgais neu ryddhau ecwiti.Gyda morgais ymddeoliad llog yn unig (RIO), rydych chi’n talu swm misol i dalu’r llog ac ad-dalu’r benthyciad pan fyddwch chi’n gwerthu’r tŷ, yn marw, yn symud i ofal hirdymor neu ar ddiwedd tymor y morgais. Mae hyn fel arfer ar gael o 50 oed.Gyda rhyddhau ecwiti, o 55 oed, gallwch fel arfer ddewis naill ai:gymryd morgais gydol oes gyda thaliadau llog misol – yna caiff y benthyciad ei ad-dalu pan fyddwch chi’n gwerthu, yn marw neu’n symud allangwerthu’ch cartref cyfan neu ran ohono i ddarparwr cynllun gwrthdroi cartref am lai na’i werth marchnad ac aros yn byw yno fel tenant am gyfnod y cytunwyd arno gyda swm isel o rent i’w dalu.Efallai y byddwch hefyd yn gallu defnyddio cynllun rhyddhau ecwiti i ariannu eich gofal.',
      links: [
        {
          text: 'lleihau maint eich cartref',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
        {
          text: 'morgais ymddeoliad llog yn unig (RIO)',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/retirement-interest-only-mortgages',
        },
        {
          text: 'rhyddhau ecwiti',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/what-is-equity-release',
        },
        {
          text: 'defnyddio cynllun rhyddhau ecwiti i ariannu eich gofal',
          url: 'https://www.moneyhelper.org.uk/cy/family-and-care/long-term-care/using-an-equity-release-scheme-to-fund-your-care',
        },
      ],
    },
  },
  GP10a: {
    en: {
      heading:
        'Consider using the value of your home to boost your retirement income',
      content:
        'You might be able to use the value of your home to increase your income in retirement, including paying for any care costs. This includes:Moving to a cheaper home and saving or investing the difference, called downsizing. This can also help make sure your home is suitable for your future needs, such as a bungalow, retirement property or sheltered housing.Accessing the money tied up in your home, either using a mortgage or equity release.With a retirement interest-only (RIO) mortgage, you pay a monthly amount to cover the interest and repay the loan when you sell the house, die, move into long-term care or at the end of the mortgage term. This is usually available from age 50.With equity release, from age 55, you can normally choose to either:take out a lifetime mortgage with monthly interest payments – the loan is then repaid when you sell, die or move outsell all or part of your home to a home reversion plan provider for less than its market value and stay living there as a tenant for an agreed period – with a low amount of rent to pay.But be aware that releasing money from your home can affect your eligibility for certain benefits and discounts – so you could be worse off.You might also need to use the value of your home to help fund any care you might need at a later date. Releasing money early could limit your options.Find out about using equity release to fund your care.',
      links: [
        {
          text: 'downsizing',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
        {
          text: 'retirement interest-only (RIO) mortgage',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/retirement-interest-only-mortgages',
        },
        {
          text: 'equity release',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/what-is-equity-release',
        },
        {
          text: 'using equity release to fund your care',
          url: 'https://www.moneyhelper.org.uk/en/family-and-care/long-term-care/using-an-equity-release-scheme-to-fund-your-care',
        },
      ],
    },
    cy: {
      heading:
        'Ystyriwch ddefnyddio gwerth eich cartref i hybu eich incwm ymddeoliad',
      content:
        'Efallai y byddwch yn gallu defnyddio gwerth eich cartref i gynyddu eich incwm yn eich ymddeoliad, gan gynnwys talu am unrhyw gostau gofal. Mae hyn yn cynnwys:Symud i gartref rhatach a chynilo neu fuddsoddi’r gwahaniaeth, a elwir yn symud i gartref llai. Gall hyn hefyd helpu i sicrhau bod eich cartref yn addas ar gyfer eich anghenion yn y dyfodol, fel byngalo, eiddo ymddeoliad neu dai gwarchod.Cael mynediad at yr arian sydd wedi’i glymu yn eich cartref, naill ai gan ddefnyddio morgais neu ryddhau ecwiti.Gyda morgais ymddeol llog yn unig (RIO), rydych chi’n talu swm misol i dalu’r llog ac ad-dalu’r benthyciad pan fyddwch chi’n gwerthu’r tŷ, yn marw, yn symud i ofal hirdymor neu ar ddiwedd tymor y morgais. Mae hyn fel arfer ar gael o 50 oed.Gyda rhyddhau ecwiti, o 55 oed, gallwch fel arfer ddewis naill ai:gymryd morgais gydol oes gyda thaliadau llog misol – yna caiff y benthyciad ei ad-dalu pan fyddwch chi’n gwerthu, yn marw neu’n symud allangwerthu’ch cartref cyfan neu ran ohono i ddarparwr cynllun dychweliad cartref am lai na’i werth marchnad a pharhau i fyw ynddo fel tenant am gyfnod y cytunwyd arno gyda swm isel o rent i’w dalu.Ond cofiwch y gall rhyddhau arian o’ch cartref effeithio ar eich hawl i fudd-daliadau a gostyngiadau penodol – felly gallech fod gyda llai o arian.Efallai y bydd angen i chi hefyd ddefnyddio gwerth eich cartref i helpu i dalu am unrhyw ofal y gallai fod ei angen arnoch yn y dyfodol. Gallai rhyddhau arian yn gynnar gyfyngu ar eich opsiynau.Dysgwch fwy am ddefnyddio cynllun rhyddhau ecwiti i gyllido eich gofal.',
      links: [
        {
          text: 'symud i gartref llai',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
        {
          text: 'morgais ymddeol llog yn unig (RIO)',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/retirement-interest-only-mortgages',
        },
        {
          text: 'rhyddhau ecwiti',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/what-is-equity-release',
        },
        {
          text: 'ddefnyddio cynllun rhyddhau ecwiti i gyllido eich gofal',
          url: 'https://www.moneyhelper.org.uk/cy/family-and-care/long-term-care/using-an-equity-release-scheme-to-fund-your-care',
        },
      ],
    },
  },
  GP11: {
    en: {
      heading:
        'Check the mortgage options available after you retire and plan how you’ll repay the debt',
      content:
        'It’s usually harder to get a new mortgage as you get closer to retirement age, as you still need to pass lenders’ affordability checks. But there are special products you could consider.This includes:A retirement interest-only (RIO) mortgage, where you pay a monthly amount to cover the interest and repay the loan when you sell the house, die, move into long-term care or at the end of the mortgage term. This is usually available from age 50.An equity release scheme, from age 55, that either lets you:take out a lifetime mortgage with monthly interest payments – the loan is then repaid when you sell, die or move outsell all or part of your home to a home reversion plan provider for less than its market value and stay living there as a tenant for an agreed period – with a low amount of rent to pay.Plan how you’ll repay your existing mortgageUnless you already own your home outright, you’ll need to plan how you’ll repay your mortgage before you’d like to retire.If you have an interest-only mortgage, you’ll need to budget to pay off the full amount you owe, as your normal repayments only cover the interest.Avoid relying on repaying your mortgage using a future lump sum that’s not guaranteed, such as:money from inheritance or a bonusselling up and buying a cheaper home to use the difference.Instead, contact your lender to understand your options – such as moving to a repayment mortgage. It’s also a good idea to find out if there are any penalties for repaying your mortgage early.For more information, see our guides:Ways of repaying an interest-only mortgageShould you pay off your mortgage early?Consider using the value of your home to boost your retirement incomeThere are ways of using the value of your home to increase your income in retirement, including paying for any care costs.For example, you could move to a cheaper home and save or invest the difference, called downsizing.For more information on your options, see our guide Should I downsize my home to fund my retirement?',
      links: [
        {
          text: 'retirement interest-only (RIO) mortgage',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/retirement-interest-only-mortgages',
        },
        {
          text: 'equity release',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/what-is-equity-release',
        },
        {
          text: 'Ways of repaying an interest-only mortgage',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/ways-of-repaying-an-interest-only-mortgage',
        },
        {
          text: 'Should you pay off your mortgage early?',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/should-you-pay-off-your-mortgage-early',
        },
      ],
    },
    cy: {
      heading:
        'Gwiriwch yr opsiynau morgais sydd ar gael ar ôl i chi ymddeol a chynlluniwch sut y byddwch chi’n ad-dalu’r ddyled',
      content:
        'Fel arfer, mae’n anoddach cael morgais newydd wrth i chi agosáu at oedran ymddeol, gan fod angen i chi basio gwiriadau fforddiadwyedd benthycwyr o hyd. Ond mae cynhyrchion arbennig y gallech eu hystyried.Mae hyn yn cynnwys:Morgais ymddeoliad llog yn unig (RIO), lle rydych chi’n talu swm misol i dalu’r llog ac ad-dalu’r benthyciad pan fyddwch chi’n gwerthu’r tŷ, yn marw, yn symud i ofal hirdymor neu ar ddiwedd tymor y morgais. Mae hyn fel arfer ar gael o 50 oed.Cynllun rhyddhau ecwiti, o 55 oed, sydd naill ai’n caniatáu i chi:gymryd morgais gydol oes gyda thaliadau llog misol - yna caiff y benthyciad ei ad-dalu pan fyddwch chi’n gwerthu, yn marw neu’n symud allanwerthu’ch cartref cyfan neu ran ohono i ddarparwr cynllun gwrthdroi cartref am lai na’i werth marchnad ac aros yn byw yno fel tenant am gyfnod y cytunwyd arno - gyda swm isel o rent i’w dalu.Cynlluniwch sut y byddwch yn ad-dalu eich morgais presennolOni bai eich bod eisoes yn berchen ar eich cartref yn llwyr, bydd angen i chi gynllunio sut y byddwch yn ad-dalu eich morgais cyn i chi ymddeol.Os oes gennych forgais llog yn unig, bydd angen i chi gyllidebu i dalu’r swm llawn sy’n ddyledus gennych, gan mai dim ond y llog y mae eich ad-daliadau arferol yn ei dalu.Osgowch ddibynnu ar ad-dalu eich morgais gan ddefnyddio cyfandaliad yn y dyfodol nad yw wedi’i warantu, fel:arian o etifeddiaeth neu fonwsgwerthu a phrynu cartref rhatach i ddefnyddio’r gwahaniaeth.Yn lle, cysylltwch â’ch benthyciwr i ddeall eich opsiynau - fel symud i forgais ad-dalu. Mae hefyd yn syniad da darganfod a oes unrhyw gosbau am ad-dalu eich morgais yn gynnar.Am ragor o wybodaeth, gweler ein canllawiau:Ffyrdd o ad-dalu morgais llog yn unigA ddylech chi dalu eich morgais yn gynnar?Ystyriwch ddefnyddio gwerth eich cartref i hybu eich incwm ymddeoliadMae yna ffyrdd o ddefnyddio gwerth eich cartref i gynyddu eich incwm yn eich ymddeoliad, gan gynnwys talu am unrhyw gostau gofal.Er enghraifft, gallech symud i gartref rhatach a chynilo neu fuddsoddi’r gwahaniaeth, a elwir yn symud i gartref llai.Am ragor o wybodaeth am eich opsiynau, gweler ein canllaw A ddylwn i symud i gartref llai i ariannu fy ymddeoliad?',
      links: [
        {
          text: 'Morgais ymddeoliad llog yn unig (RIO)',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/retirement-interest-only-mortgages',
        },
        {
          text: 'rhyddhau ecwiti',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/what-is-equity-release',
        },
        {
          text: 'Ffyrdd o ad-dalu morgais llog yn unig',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/ways-of-repaying-an-interest-only-mortgage',
        },
        {
          text: 'A ddylech chi dalu eich morgais yn gynnar?',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/should-you-pay-off-your-mortgage-early',
        },
        {
          text: 'A ddylwn i symud i gartref llai i ariannu fy ymddeoliad?',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
        },
      ],
    },
  },
  GP12: {
    en: {
      heading:
        'Check the mortgage options available after you retire and plan how you’ll repay the debt',
      content:
        'It’s usually harder to get a new mortgage as you get closer to retirement age, as you still need to pass lenders’ affordability checks. But there are special products you could consider.This includes:A retirement interest-only (RIO) mortgage, where you pay a monthly amount to cover the interest and repay the loan when you sell the house, die, move into long-term care or at the end of the mortgage term. This is usually available from age 50.An equity release scheme, from age 55, that either lets you:take out a lifetime mortgage with monthly interest payments – the loan is then repaid when you sell, die or move outsell all or part of your home to a home reversion plan provider for less than its market value and stay living there as a tenant for an agreed period – with a low amount of rent to pay.Plan how you’ll repay your existing mortgageUnless you already own your home outright, you’ll need to plan how you’ll repay your mortgage before you’d like to retire.If you have an interest-only mortgage, you’ll need to budget to pay off the full amount you owe, as your normal repayments only cover the interest.Avoid relying on repaying your mortgage using a future lump sum that’s not guaranteed, such as:money from inheritance or a bonusselling up and buying a cheaper home to use the difference.Instead, contact your lender to understand your options – such as moving to a repayment mortgage. It’s also a good idea to find out if there are any penalties for repaying your mortgage early.For more information, see our guides:Ways of repaying an interest-only mortgageShould you pay off your mortgage early?Get help if you’re worried about paying your mortgage repaymentsIf you’re worried you’ll miss a mortgage repayment, or struggle to repay, tell your mortgage lender. They must help you and treat you fairly.For example, they might be able to temporarily lower or stop your payments by:extending your mortgage termletting you only repay the interestgiving you a payment holiday – you usually won’t need to make any repayments during this period.If you’ve already missed a payment and are in mortgage arrears, it’s best to speak to a debt adviser. Our Debt advice locator tool can help you find free and confidential debt advisers near you, online and by phone.',
      links: [
        {
          text: 'retirement interest-only (RIO) mortgage',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/retirement-interest-only-mortgages',
        },
        {
          text: 'equity release',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/what-is-equity-release',
        },
        {
          text: 'Ways of repaying an interest-only mortgage',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/ways-of-repaying-an-interest-only-mortgage',
        },
        {
          text: 'Should you pay off your mortgage early?',
          url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/should-you-pay-off-your-mortgage-early',
        },
        {
          text: 'Debt advice locator tool',
          url: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
        },
      ],
    },
    cy: {
      heading:
        'Gwiriwch yr opsiynau morgais sydd ar gael ar ôl i chi ymddeol a chynlluniwch sut y byddwch chi’n ad-dalu’r ddyled',
      content:
        'Fel arfer, mae’n anoddach cael morgais newydd wrth i chi agosáu at oedran ymddeoliad, gan fod angen i chi basio gwiriadau fforddiadwyedd benthycwyr o hyd. Ond mae cynhyrchion arbennig y gallech eu hystyried.Mae hyn yn cynnwys:Morgais ymddeoliad llog yn unig (RIO), lle rydych chi’n talu swm misol i dalu’r llog ac ad-dalu’r benthyciad pan fyddwch chi’n gwerthu’r tŷ, yn marw, yn symud i ofal hirdymor neu ar ddiwedd tymor y morgais. Mae hyn fel arfer ar gael o 50 oed.Cynllun rhyddhau ecwiti, o 55 oed, sydd naill ai’n caniatáu i chi:gymryd morgais gydol oes gyda thaliadau llog misol - yna caiff y benthyciad ei ad-dalu pan fyddwch chi’n gwerthu, yn marw neu’n symud allanwerthu’ch cartref cyfan neu ran ohono i ddarparwr cynllun gwrthdroi cartref am lai na’i werth marchnad ac aros yn byw yno fel tenant am gyfnod y cytunwyd arno - gyda swm isel o rent i’w dalu.Cynlluniwch sut y byddwch yn ad-dalu eich morgais presennolOni bai eich bod eisoes yn berchen ar eich cartref yn llwyr, bydd angen i chi gynllunio sut y byddwch yn ad-dalu eich morgais cyn i chi ymddeol.Os oes gennych forgais llog yn unig, bydd angen i chi gyllidebu i dalu’r swm llawn sy’n ddyledus gennych, gan mai dim ond y llog y mae eich ad-daliadau arferol yn ei dalu.Osgowch ddibynnu ar ad-dalu eich morgais gan ddefnyddio cyfandaliad yn y dyfodol nad yw wedi’i warantu, fel:arian o etifeddiaeth neu fonwsgwerthu a phrynu cartref rhatach i ddefnyddio’r gwahaniaeth.Yn lle, cysylltwch â’ch benthyciwr i ddeall eich opsiynau - fel symud i forgais ad-dalu. Mae hefyd yn syniad da darganfod a oes unrhyw gosbau am ad-dalu eich morgais yn gynnar.Am ragor o wybodaeth, gweler ein canllawiau:Ffyrdd o ad-dalu morgais llog yn unigA ddylech chi dalu eich morgais yn gynnar?Cael help os ydych chi’n poeni am dalu eich ad-daliadau morgaisOs ydych chi’n poeni byddwch chi’n methu ad-daliad morgais, neu’n cael traffeth i’w had-dalu, rhowch wybod i’ch benthyciwr morgais. Mae’n rhaid iddynt eich helpu a’ch trin yn deg.Er enghraifft, efallai bydden nhw’n gallu lleihau neu stopio eich taliadau dros dro gan:estynu tymor eich morgaiseich caniatau i ad-dalu’r llog yn unigrhoi gwyliau talu i chi – fel arfer ni fydd angen i chi wneud unrhyw daliadau yn ystod y cyfnod hwn.Os ydych chi eisoes wedi methu taliad neu rydych mewn ôl-ddyledion morgais, y peth gorau yw siarad ag ymgynghorydd dyledion. Gall ein teclyn Lleolwr Cyngor ar Ddyledion eich helpu i ddod o hyd i ymgynghorwyr dyledion am ddim a chyfrinachol yn agos atoch chi, ar-lein a dros y ffôn.',
      links: [
        {
          text: 'Morgais ymddeoliad llog yn unig (RIO)',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/retirement-interest-only-mortgages',
        },
        {
          text: 'rhyddhau ecwiti',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/what-is-equity-release',
        },
        {
          text: 'Ffyrdd o ad-dalu morgais llog yn unig',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/ways-of-repaying-an-interest-only-mortgage',
        },
        {
          text: 'A ddylech chi dalu eich morgais yn gynnar?',
          url: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/should-you-pay-off-your-mortgage-early',
        },
        {
          text: 'teclyn Lleolwr Cyngor ar Ddyledion',
          url: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
        },
      ],
    },
  },
  GP12a: {
    en: {
      heading:
        'Get help if you’re worried about paying your mortgage repayments',
      content:
        'If you’re worried you’ll miss a mortgage repayment, or struggle to repay, tell your mortgage lender. They must help you and treat you fairly.For example, they might be able to temporarily lower or stop your payments by:extending your mortgage termletting you only repay the interestgiving you a payment holiday – you usually won’t need to make any repayments during this period.If you’ve already missed a payment and are in mortgage arrears, it’s best to speak to a debt adviser. Our Debt advice locator tool can help you find free and confidential debt advisers near you, online and by phone.',
      links: [
        {
          text: 'Debt advice locator tool',
          url: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
        },
      ],
    },
    cy: {
      heading:
        'Cael help os ydych chi’n poeni am dalu eich ad-daliadau morgais',
      content:
        'Os ydych chi’n poeni byddwch chi’n methu ad-daliad morgais, neu’n cael trafferth i’w ad-dalu, rhowch wybod i’ch benthyciwr morgais. Mae’n rhaid iddynt eich helpu a’ch trin yn deg.Er enghraifft, efallai bydden nhw’n gallu lleihau neu stopio eich taliadau dros dro gan:estynu tymor eich morgaiseich caniatau i ad-dalu’r llog yn unigrhoi gwyliau talu i chi – fel arfer ni fydd angen i chi wneud unrhyw daliadau yn ystod y cyfnod hwn.Os ydych chi eisoes wedi methu taliad neu rydych mewn ôl-ddyledion morgais, y peth orau yw siarad ag ymgynghorydd dyledion. Gall ein teclyn Lleolwr Cyngor ar Ddyledion eich helpu i ddod o hyd i ymgynghorwyr dyledion am ddim a chyfrinachol yn agos atoch chi, ar-lein a dros y ffôn.',
      links: [
        {
          text: 'teclyn Lleolwr Cyngor ar Ddyledion',
          url: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
        },
      ],
    },
  },
  GP13: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'Council or housing association rent usually increases every April, often in line with inflation or up to an agreed maximum cap for the area you live in.This means you’ll need to plan how you’ll pay the extra each year.If you get Housing Benefit or the housing element of Universal Credit, check if you qualify for a Discretionary Housing Payment (DHP). This can help you pay your housing costs. Find out more in our guide Help with rent increases, arrears and if you’re struggling to pay.You can also ask to swap your home if it no longer meets your needs, perhaps because it’s too large or does not meet your accessibility needs in retirement. See your rights if you rent from the council or housing association.',
      links: [
        {
          text: 'Help with rent increases, arrears and if you’re struggling to pay',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'your rights if you rent from the council or housing association',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu’ch rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Fel arfer, mae rhent y cyngor neu gymdeithas dai yn cynyddu bob mis Ebrill, yn aml yn unol â chwyddiant neu hyd at uchafswm y cytunwyd arno ar gyfer yr ardal rydych chi’n byw ynddo.Mae hyn yn golygu y bydd angen i chi gynllunio sut y byddwch chi’n talu’r swm ychwanegol bob blwyddyn.Os ydych chi’n cael Budd-dal Tai neu elfen dai Credyd Cynhwysol, gwiriwch a ydych chi’n gymwys i gael Taliad Tai Dewisol (DHP). Gall hyn eich helpu i dalu’ch costau tai. Darganfyddwch fwy yn ein canllaw Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu.Gallwch hefyd ofyn am gyfnewid eich cartref os nad yw bellach yn diwallu’ch anghenion, efallai oherwydd ei fod yn rhy fawr neu nad yw’n diwallu’ch anghenion hygyrchedd yn eich ymddeoliad. Gweler eich hawliau os ydych chi’n rhentu gan y cyngor neu gymdeithas dai.',
      links: [
        {
          text: 'Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'eich hawliau os ydych chi’n rhentu gan y cyngor neu gymdeithas dai',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association',
        },
      ],
    },
  },
  GP14: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'Council or housing association rent usually increases every April, often in line with inflation or up to an agreed maximum cap for the area you live in.This means you’ll need to plan how you’ll pay the extra each year.If you get Housing Benefit or the housing element of Universal Credit, check if you qualify for a Discretionary Housing Payment (DHP). This can help you pay your housing costs. Find out more in our guide Help with rent increases, arrears and if you’re struggling to pay.You can also ask to swap your home if it no longer meets your needs, perhaps because it’s too large or does not meet your accessibility needs in retirement. See your rights if you rent from the council or housing association.Taking a tax-free lump sum from your pension can reduce your future incomeIf you take a tax-free lump sum from your pension, you’ll usually reduce the future income it can provide – which you might need to cover your essential costs, including your rent. This means you could be worse off overall. If you cash your entire pension in, you’ll typically lose a large chunk of it to Income Tax.If the amount you take from your pension increases your overall income or savings, it might also affect the benefits you’re entitled to. You can use our Benefits calculator to check what you’re eligible for now and how it might change if your income or savings increased.',
      links: [
        {
          text: 'Help with rent increases, arrears and if you’re struggling to pay',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'your rights if you rent from the council or housing association',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association',
        },
        {
          text: 'tax-free lump sum',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
        },
        {
          text: 'cash your entire pension in',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/taking-your-whole-pension-in-one-go',
        },
        {
          text: 'Benefits calculator',
          url: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu’ch rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Fel arfer, mae rhent y cyngor neu gymdeithas dai yn cynyddu bob mis Ebrill, yn aml yn unol â chwyddiant neu hyd at uchafswm y cytunwyd arno ar gyfer yr ardal rydych chi’n byw ynddi.Mae hyn yn golygu y bydd angen i chi gynllunio sut y byddwch chi’n talu’r swm ychwanegol bob blwyddyn.Os ydych chi’n cael Budd-dal Tai neu elfen dai Credyd Cynhwysol, gwiriwch a ydych chi’n gymwys i gael Taliad Tai Dewisol (DHP). Gall hyn eich helpu i dalu’ch costau tai. Darganfyddwch fwy yn ein canllaw Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu.Gallwch hefyd ofyn am gyfnewid eich cartref os nad yw bellach yn diwallu’ch anghenion, efallai oherwydd ei fod yn rhy fawr neu nad yw’n diwallu’ch anghenion hygyrchedd yn eich ymddeoliad. Gweler eich hawliau os ydych chi’n rhentu gan y cyngor neu gymdeithas dai.Gall cymryd cyfandaliad di-dreth o’ch pensiwn leihau’ch incwm yn y dyfodolOs cymerwch gyfandaliad di-dreth o’ch pensiwn, byddwch fel arfer yn lleihau’r incwm yn y dyfodol y gall ei ddarparu - y gallai fod ei angen arnoch i dalu’ch costau hanfodol, gan gynnwys eich rhent. Mae hyn yn golygu y gallech fod mewn sefyllfa waeth yn gyffredinol. Os byddwch yn cymryd eich pensiwn cyfan, byddwch fel arfer yn colli cyfran fawr ohono i Dreth Incwm.Os yw’r swm a gymerwch o’ch pensiwn yn cynyddu’ch incwm neu gynilion cyffredinol, gallai hefyd effeithio ar y budd-daliadau y mae gennych hawl iddynt. Gallwch ddefnyddio ein Cyfrifiannell budd-daliadau i wirio beth rydych yn gymwys i’w gael nawr a sut y gallai newid pe bai’ch incwm neu gynilion yn cynyddu.',
      links: [
        {
          text: 'Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'eich hawliau os ydych chi’n rhentu gan y cyngor neu gymdeithas dai',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association',
        },
        {
          text: 'gyfandaliad di-dreth',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
        },
        {
          text: 'cymryd eich pensiwn cyfan',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/taking-your-whole-pension-in-one-go',
        },
        {
          text: 'Cyfrifiannell budd-daliadau',
          url: 'https://www.moneyhelper.org.uk/cy/benefits/benefits-calculator',
        },
      ],
    },
  },
  GP14a: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'Council or housing association rent usually increases every April, often in line with inflation or up to an agreed maximum cap for the area you live in.This means you’ll need to plan how you’ll pay the extra each year.If you get Housing Benefit or the housing element of Universal Credit, check if you qualify for a Discretionary Housing Payment (DHP). This can help you pay your housing costs. Find out more in our guide Help with rent increases, arrears and if you’re struggling to pay.You can also ask to swap your home if it no longer meets your needs, perhaps because it’s too large or does not meet your accessibility needs in retirement. See your rights if you rent from the council or housing association.',
      links: [
        {
          text: 'Help with rent increases, arrears and if you’re struggling to pay',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'your rights if you rent from the council or housing association',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu’ch rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Fel arfer, mae rhent y cyngor neu gymdeithas dai yn cynyddu bob mis Ebrill, yn aml yn unol â chwyddiant neu hyd at uchafswm y cytunwyd arno ar gyfer yr ardal rydych chi’n byw ynddi.Mae hyn yn golygu y bydd angen i chi gynllunio sut y byddwch chi’n talu’r swm ychwanegol bob blwyddyn.Os ydych chi’n cael Budd-dal Tai neu elfen dai Credyd Cynhwysol, gwiriwch a ydych chi’n gymwys i gael Taliad Tai Dewisol (DHP). Gall hyn eich helpu i dalu’ch costau tai. Darganfyddwch fwy yn ein canllaw Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu.Gallwch hefyd ofyn am gyfnewid eich cartref os nad yw bellach yn diwallu’ch anghenion, efallai oherwydd ei fod yn rhy fawr neu nad yw’n diwallu’ch anghenion hygyrchedd yn eich ymddeoliad. Gweler eich hawliau os ydych chi’n rhentu gan y cyngor neu gymdeithas dai.',
      links: [
        {
          text: 'Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'eich hawliau os ydych chi’n rhentu gan y cyngor neu gymdeithas dai',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association',
        },
      ],
    },
  },
  GP14b: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'Council or housing association rent usually increases every April, often in line with inflation or up to an agreed maximum cap for the area you live in.This means you’ll need to plan how you’ll pay the extra each year.Your guaranteed income from your defined benefit pension will usually increase each year, so this might help cover your rent increase. You can ask your pension provider how much your pension should increase by each year.If you get Housing Benefit or the housing element of Universal Credit, you could also check if you qualify for a Discretionary Housing Payment (DHP). This can help you pay your housing costs. Find out more in our guide Help with rent increases, arrears and if you’re struggling to pay.You can also ask to swap your home if it no longer meets your needs, perhaps because it’s too large or does not meet your accessibility needs in retirement. See your rights if you rent from the council or housing association.Taking a tax-free lump sum from your pension can reduce your future incomeIf you take a tax-free lump sum from your pension, you’ll often reduce the future income it can provide – which you might need to cover your essential costs, including your rent. This means you could be worse off overall. If you cash your entire pension in, you’ll typically lose a large chunk of it to Income Tax.If the amount you take from your pension increases your overall income or savings, it might also affect the benefits you’re entitled to. You can use our Benefits calculator to check what you’re eligible for now and how it might change if your income or savings increased.',
      links: [
        {
          text: 'Help with rent increases, arrears and if you’re struggling to pay',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'your rights if you rent from the council or housing association',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association',
        },
        {
          text: 'tax-free lump sum',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
        },
        {
          text: 'cash your entire pension in',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/taking-your-whole-pension-in-one-go',
        },
        {
          text: 'Benefits calculator',
          url: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu’ch rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Fel arfer, mae rhent y cyngor neu gymdeithas dai yn cynyddu bob mis Ebrill, yn aml yn unol â chwyddiant neu hyd at uchafswm y cytunwyd arno ar gyfer yr ardal rydych chi’n byw ynddi.Mae hyn yn golygu y bydd angen i chi gynllunio sut y byddwch chi’n talu’r swm ychwanegol bob blwyddyn.Mae eich incwm gwarantedig o’ch pensiwn buddion wedi’u diffinio fel arfer yn cynyddu pob blwyddyn, felly gallai hyn helpu i dalu eich cynnydd mewn rhent. Gofynnwch eich darparwr pensiwn faint dylai eich pensiwn cynyddu bob blwyddyn.Os ydych chi’n cael Budd-dal Tai neu elfen dai Credyd Cynhwysol, gwiriwch a ydych chi’n gymwys i gael Taliad Tai Dewisol (DHP). Gall hyn eich helpu i dalu’ch costau tai. Darganfyddwch fwy yn ein canllaw Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu.Gallwch hefyd ofyn am gyfnewid eich cartref os nad yw bellach yn diwallu’ch anghenion, efallai oherwydd ei fod yn rhy fawr neu nad yw’n diwallu’ch anghenion hygyrchedd yn eich ymddeoliad. Gweler eich hawliau os ydych chi’n rhentu gan y cyngor neu gymdeithas dai.Gall cymryd cyfandaliad di-dreth o’ch pensiwn leihau’ch incwm yn y dyfodolOs cymerwch gyfandaliad di-dreth o’ch pensiwn, byddwch fel arfer yn lleihau’r incwm yn y dyfodol y gall ei ddarparu - y gallai fod ei angen arnoch i dalu’ch costau hanfodol, gan gynnwys eich rhent. Mae hyn yn golygu y gallech fod mewn sefyllfa waeth yn gyffredinol. Os byddwch yn cymryd eich pensiwn cyfan, byddwch fel arfer yn colli cyfran fawr ohono i Dreth Incwm.Os yw’r swm a gymerwch o’ch pensiwn yn cynyddu’ch incwm neu gynilion cyffredinol, gallai hefyd effeithio ar y budd-daliadau y mae gennych hawl iddynt. Gallwch ddefnyddio ein Cyfrifiannell budd-daliadau i wirio beth rydych yn gymwys i’w gael nawr a sut y gallai newid pe bai’ch incwm neu gynilion yn cynyddu.',
      links: [
        {
          text: 'Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'eich hawliau os ydych chi’n rhentu gan y cyngor neu gymdeithas dai',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association',
        },
        {
          text: 'gyfandaliad di-dreth',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
        },
        {
          text: 'cymryd eich pensiwn cyfan',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/taking-your-whole-pension-in-one-go',
        },
        {
          text: 'Cyfrifiannell budd-daliadau',
          url: 'https://www.moneyhelper.org.uk/cy/benefits/benefits-calculator',
        },
      ],
    },
  },
  GP15: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'If you’re planning on moving to a new rented home after retirement, be aware that you’ll usually still need to pass affordability checks. For example, you might need to have an annual income worth 2 or 3 times more than the annual rent.If your regular pension income is below this but you have cash savings, you might be able to show evidence of this instead. But never pay rent in advance as this is illegal.If you cannot afford a rented home that meets your needs, consider downsizing or moving to a cheaper area.You could also apply for social housing. The eligibility criteria depend on where you live, but you might be given priority if you have a low income and are 50 or over.You usually need to apply and join a waiting list, with available homes given to those with the highest priority.Find out more in our guide How to find a rented home you can afford.',
      links: [
        {
          text: 'How to find a rented home you can afford',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/how-much-rent-can-you-afford',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu eich rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Os ydych chi’n bwriadu symud i gartref rhent newydd ar ôl ymddeol, byddwch yn ymwybodol y bydd angen i chi fel arfer basio gwiriadau fforddiadwyedd o hyd. Er enghraifft, efallai y bydd angen i chi gael incwm blynyddol sy’n werth 2 neu 3 gwaith yn fwy na’r rhent blynyddol.Os yw eich incwm pensiwn rheolaidd yn is na hyn ond bod gennych chi gynilion arian parod, efallai y byddwch chi’n gallu dangos tystiolaeth o hyn yn lle. Ond peidiwch byth â thalu rhent ymlaen llaw gan fod hyn yn anghyfreithlon.Os na allwch chi fforddio cartref rhent sy’n diwallu eich anghenion, ystyriwch leihau maint eich tŷ neu symud i ardal rhatach.Fe allech chi hefyd wneud cais am dai cymdeithasol. Mae’r meini prawf cymhwysedd yn dibynnu ar ble rydych chi’n byw, ond efallai y byddwch chi’n cael blaenoriaeth os oes gennych chi incwm isel ac yn 50 oed neu’n hŷn.Fel arfer mae angen i chi wneud cais ac ymuno â rhestr aros, gyda chartrefi sydd ar gael yn cael eu rhoi i’r rhai sydd â’r flaenoriaeth uchaf.Darganfyddwch fwy yn ein canllaw Sut i ddod o hyd i gartref rhent y gallwch chi ei fforddio.',
      links: [
        {
          text: 'Sut i ddod o hyd i gartref rhent y gallwch chi ei fforddio',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/how-much-rent-can-you-afford',
        },
      ],
    },
  },
  GP15a: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'Your landlord can usually only increase your rent once a year and you must be given at least 2 months’ notice. If you think any rent increase is above the market rate for your area, you can challenge it and apply for a market rent determination.But the exact rules depend on the type of agreement you have, and where in the UK you rent. For example, your landlord doesn’t have to give you notice to increase your rent if you’re a lodger. For more information, see our guide Help with rent increases, arrears and if you’re struggling to pay.If you’re planning on moving to a new rented home after retirement, be aware that you’ll usually still need to pass affordability checks. For example, you might need to have an annual income worth 2 or 3 times more than the annual rent.If your regular pension income is below this but you have cash savings, you might be able to show evidence of this instead. But never pay rent in advance as this is illegal.If you cannot afford a rented home that meets your needs, consider downsizing or moving to a cheaper area.You could also apply for social housing. The eligibility criteria depends on where you live, but you might be given priority if you have a low income and are 50 or over.You usually need to apply and join a waiting list, with available homes given to those with the highest priority.Find out more in our guide How to find a rented home you can afford.',
      links: [
        {
          text: 'apply for a market rent determination',
          url: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
        },
        {
          text: 'Help with rent increases, arrears and if you’re struggling to pay',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'How to find a rented home you can afford',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/how-much-rent-can-you-afford',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu eich rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Fel arfer dim ond unwaith y flwyddyn y gall eich landlord gynyddu eich rhent a rhaid rhoi o leiaf 2 fis o rybudd i chi. Os ydych chi’n credu bod unrhyw gynnydd rhent yn uwch na chyfradd y farchnad ar gyfer eich ardal, gallwch ei herio a gwneud cais am benderfyniad rhent marchnad.Ond mae’r union rheolau yn dibynnu ar y math o gytundeb sydd gennych, a ble yn y DU rydych chi’n rhentu. Er enghraifft, nid oes rhaid i’ch landlord roi rhybudd i chi i gynyddu eich rhent os ydych chi’n lletywr. Am ragor o wybodaeth, gweler ein canllaw Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu.Os ydych chi’n bwriadu symud i gartref rhent newydd ar ôl ymddeol, byddwch yn ymwybodol y bydd angen i chi fel arfer basio gwiriadau fforddiadwyedd o hyd. Er enghraifft, efallai y bydd angen i chi gael incwm blynyddol sy’n werth 2 neu 3 gwaith yn fwy na’r rhent blynyddol.Os yw eich incwm pensiwn rheolaidd yn is na hyn ond bod gennych chi gynilion arian parod, efallai y byddwch chi’n gallu dangos tystiolaeth o hyn yn lle. Ond peidiwch byth â thalu rhent ymlaen llaw gan fod hyn yn anghyfreithlon.Os na allwch chi fforddio cartref rhent sy’n diwallu eich anghenion, ystyriwch leihau maint eich tŷ neu symud i ardal rhatach.Fe allech chi hefyd wneud cais am dai cymdeithasol. Mae’r meini prawf cymhwysedd yn dibynnu ar ble rydych chi’n byw, ond efallai y byddwch chi’n cael blaenoriaeth os oes gennych chi incwm isel ac yn 50 oed neu’n hŷn.Fel arfer mae angen i chi wneud cais ac ymuno â rhestr aros, gyda chartrefi sydd ar gael yn cael eu rhoi i’r rhai sydd â’r flaenoriaeth uchaf.Darganfyddwch fwy yn ein canllaw Sut i ddod o hyd i gartref rhent y gallwch chi ei fforddio.',
      links: [
        {
          text: 'gwneud cais am benderfyniad rhent marchnad',
          url: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
        },
        {
          text: 'Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'Sut i ddod o hyd i gartref rhent y gallwch chi ei fforddio',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/how-much-rent-can-you-afford',
        },
      ],
    },
  },
  GP16: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'Your landlord can usually only increase your rent once a year and you must be given at least 2 months’ notice. If you think any rent increase is above the market rate for your area, you can challenge it and apply for a market rent determination.But the exact rules depend on the type of agreement you have, and where in the UK you rent. For example, your landlord doesn’t have to give you notice to increase your rent if you’re a lodger. For more information, see our guide Help with rent increases, arrears and if you’re struggling to pay.Taking a tax-free lump sum from your pension can reduce your future incomeIf you take a tax-free lump sum from your pension, you’ll often reduce the future income it can provide – which you might need to cover your essential costs, including your rent. This means you could be worse off overall. If you cash your entire pension in, you’ll typically lose a large chunk of it to Income Tax.If the amount you take from your pension increases your overall income or savings, it might also affect the benefits you’re entitled to. You can use our Benefits calculator to check what you’re eligible for now and how it might change if your income or savings increased.',
      links: [
        {
          text: 'apply for a market rent determination',
          url: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
        },
        {
          text: 'Help with rent increases, arrears and if you’re struggling to pay',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'tax-free lump sum',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
        },
        {
          text: 'cash your entire pension in',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/taking-your-whole-pension-in-one-go',
        },
        {
          text: 'Benefits calculator',
          url: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu eich rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Fel arfer dim ond unwaith y flwyddyn y gall eich landlord gynyddu eich rhent a rhaid rhoi o leiaf 2 fis o rybudd i chi. Os ydych chi’n credu bod unrhyw gynnydd rhent yn uwch na chyfradd y farchnad ar gyfer eich ardal, gallwch ei herio a gwneud cais am benderfyniad rhent marchnad.Ond mae’r union rheolau yn dibynnu ar y math o gytundeb sydd gennych, a ble yn y DU rydych chi’n rhentu. Er enghraifft, nid oes rhaid i’ch landlord roi rhybudd i chi i gynyddu eich rhent os ydych chi’n lletywr. Am ragor o wybodaeth, gweler ein canllaw Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu.Gall cymryd cyfandaliad di-dreth o’ch pensiwn leihau eich incwm yn y dyfodolOs cymerwch gyfandaliad di-dreth o’ch pensiwn, byddwch fel arfer yn lleihau’r incwm yn y dyfodol y gall ei ddarparu - y gallai fod ei angen arnoch i dalu’ch costau hanfodol, gan gynnwys eich rhent. Mae hyn yn golygu y gallech fod mewn sefyllfa waeth yn gyffredinol. Os byddwch yn cymryd eich pensiwn cyfan, byddwch fel arfer yn colli cyfran fawr ohono i Dreth Incwm.Os yw’r swm a gymerwch o’ch pensiwn yn cynyddu’ch incwm neu gynilion cyffredinol, gallai hefyd effeithio ar y budd-daliadau y mae gennych hawl iddynt. Gallwch ddefnyddio ein Cyfrifiannell budd-daliadau i wirio beth rydych yn gymwys i’w gael nawr a sut y gallai newid pe bai’ch incwm neu gynilion yn cynyddu.',
      links: [
        {
          text: 'gwneud cais am benderfyniad rhent marchnad',
          url: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
        },
        {
          text: 'Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'gyfandaliad di-dreth',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
        },
        {
          text: 'cymryd eich pensiwn cyfan',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/taking-your-whole-pension-in-one-go',
        },
        {
          text: 'Cyfrifiannell budd-daliadau',
          url: 'https://www.moneyhelper.org.uk/cy/benefits/benefits-calculator',
        },
      ],
    },
  },
  GP16a: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'Your landlord can usually only increase your rent once a year and you must be given at least 2 months’ notice. If you think any rent increase is above the market rate for your area, you can challenge it and apply for a market rent determination.But the exact rules depend on the type of agreement you have, and where in the UK you rent. For example, your landlord doesn’t have to give you notice to increase your rent if you’re a lodger. For more information, see our guide Help with rent increases, arrears and if you’re struggling to pay.If you’re planning on moving to a new rented home after retirement, be aware that you’ll usually still need to pass affordability checks. For example, you might need to have an annual income worth 2 or 3 times more than the annual rent.If your regular pension income is below this but you have cash savings, you might be able to show evidence of this instead. But never pay rent in advance as this is illegal.If you cannot afford a rented home that meets your needs, consider downsizing or moving to a cheaper area.You could also apply for social housing. The eligibility criteria depend on where you live, but you might be given priority if you have a low income and are 50 or over.You usually need to apply and join a waiting list, with available homes given to those with the highest priority.Find out more in our guide How to find a rented home you can afford.Taking a tax-free lump sum from your pension can reduce your future incomeIf you take a tax-free lump sum from your pension, you’ll often reduce the future income it can provide – which you might need to cover your essential costs, including your rent. This means you could be worse off overall. If you cash your entire pension in, you’ll typically lose a large chunk of it to Income Tax.If the amount you take from your pension increases your overall income or savings, you might also affect the benefits you’re entitled to. You can use our Benefits calculator to check what you’re eligible for now and how it might change if your income or savings increased.',
      links: [
        {
          text: 'apply for a market rent determination',
          url: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
        },
        {
          text: 'Help with rent increases, arrears and if you’re struggling to pay',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'How to find a rented home you can afford',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/how-much-rent-can-you-afford',
        },

        {
          text: 'tax-free lump sum',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
        },
        {
          text: 'cash your entire pension in',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/taking-your-whole-pension-in-one-go',
        },
        {
          text: 'Benefits calculator',
          url: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu eich rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Fel arfer dim ond unwaith y flwyddyn y gall eich landlord gynyddu eich rhent a rhaid rhoi o leiaf 2 fis o rybudd i chi. Os ydych chi’n credu bod unrhyw gynnydd rhent yn uwch na chyfradd y farchnad ar gyfer eich ardal, gallwch ei herio a gwneud cais am benderfyniad rhent marchnad.Ond mae’r union rheolau yn dibynnu ar y math o gytundeb sydd gennych, a ble yn y DU rydych chi’n rhentu. Er enghraifft, nid oes rhaid i’ch landlord roi rhybudd i chi i gynyddu eich rhent os ydych chi’n lletywr. Am ragor o wybodaeth, gweler ein canllaw Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu.Os ydych chi’n bwriadu symud i gartref rhent newydd ar ôl ymddeol, byddwch yn ymwybodol y bydd angen i chi basio gwiriadau fforddiadwyedd fel arfer. Er enghraifft, efallai y bydd angen i chi gael incwm blynyddol sy’n werth 2 neu 3 gwaith yn fwy na’r rhent blynyddol.Os yw eich incwm pensiwn rheolaidd yn is na hyn ond bod gennych chi gynilion arian parod, efallai y byddwch chi’n gallu dangos tystiolaeth o hyn yn lle. Ond peidiwch byth â thalu rhent ymlaen llaw gan fod hyn yn anghyfreithlon.Os na allwch fforddio cartref rhent sy’n diwallu eich anghenion, ystyriwch symud i dŷ llai neu symud i ardal rhatach.Fe allech chi hefyd wneud cais am dai cymdeithasol. Mae’r meini prawf cymhwysedd yn dibynnu ar ble rydych chi’n byw, ond efallai y byddwch chi’n cael blaenoriaeth os oes gennych chi incwm isel ac yn 50 oed neu’n hŷn.Fel arfer, mae angen i chi wneud cais ac ymuno â rhestr aros, gyda chartrefi sydd ar gael yn cael eu rhoi i’r rhai sydd â’r flaenoriaeth uchaf.Darganfyddwch fwy yn ein canllaw Sut i ddod o hyd i gartref rhent y gallwch chi ei fforddio.Gall cymryd cyfandaliad di-dreth o’ch pensiwn leihau eich incwm yn y dyfodolOs cymerwch gyfandaliad di-dreth o’ch pensiwn, byddwch fel arfer yn lleihau’r incwm yn y dyfodol y gall ei ddarparu - y gallai fod ei angen arnoch i dalu’ch costau hanfodol, gan gynnwys eich rhent. Mae hyn yn golygu y gallech fod mewn sefyllfa waeth yn gyffredinol. Os byddwch yn cymryd eich pensiwn cyfan, byddwch fel arfer yn colli cyfran fawr ohono i Dreth Incwm.Os yw’r swm a gymerwch o’ch pensiwn yn cynyddu’ch incwm neu gynilion cyffredinol, gallai hefyd effeithio ar y budd-daliadau y mae gennych hawl iddynt. Gallwch ddefnyddio ein Cyfrifiannell budd-daliadau i wirio beth rydych yn gymwys i’w gael nawr a sut y gallai newid pe bai’ch incwm neu gynilion yn cynyddu.',
      links: [
        {
          text: 'gwneud cais am benderfyniad rhent marchnad',
          url: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
        },
        {
          text: 'Cymorth gyda chodiadau rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
        {
          text: 'Sut i ddod o hyd i gartref rhent y gallwch chi ei fforddio',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/how-much-rent-can-you-afford',
        },
        {
          text: 'gyfandaliad di-dreth',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
        },
        {
          text: 'cymryd eich pensiwn cyfan',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/taking-your-whole-pension-in-one-go',
        },
        {
          text: 'Cyfrifiannell budd-daliadau',
          url: 'https://www.moneyhelper.org.uk/cy/benefits/benefits-calculator',
        },
      ],
    },
  },
  GP16b: {
    en: {
      heading:
        'Plan how you’ll pay your rent after you retire, including future rent rises',
      content:
        'If you’re worried you won’t be able to afford a rented home that meets your needs, consider downsizing or moving to a cheaper area.You could also apply for social housing. The eligibility criteria depend on where you live, but you might be given priority if you have a low income and are 50 or over.You usually need to apply and join a waiting list, with available homes given to those with the highest priority. Find out more in our guide How to find a rented home you can afford.If you stay in a private rented home, be aware that your landlord can usually only increase your rent once a year and you must be given at least 2 months’ notice. If you think any rent increase is above the market rate for your area, you can challenge it and apply for a market rent determination.But the exact rules depend on the type of agreement you have, and where in the UK you rent. For example, your landlord doesn’t have to give you notice to increase your rent if you’re a lodger. For more information, see our guide Help with rent increases, arrears and if you’re struggling to pay.If you’re planning on moving to a new private rented home after retirement, be aware that you’ll usually still need to pass affordability checks. For example, you might need to have an annual income worth 2 or 3 times more than the annual rent.If your regular pension income is below this but you have cash savings, you might be able to show evidence of this instead. But never pay rent in advance as this is illegal.',
      links: [
        {
          text: 'How to find a rented home you can afford',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/how-much-rent-can-you-afford',
        },
        {
          text: 'apply for a market rent determination',
          url: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
        },
        {
          text: 'Help with rent increases, arrears and if you’re struggling to pay',
          url: 'https://www.moneyhelper.org.uk/en/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
      ],
    },
    cy: {
      heading:
        'Cynlluniwch sut y byddwch chi’n talu eich rhent ar ôl i chi ymddeol, gan gynnwys codiadau rhent yn y dyfodol',
      content:
        'Os ydych chi’n poeni na fyddwch chi’n gallu fforddio cartref rhent sy’n diwallu eich anghenion, ystyriwch leihau maint eich tŷ neu symud i ardal rhatach.Fe allech chi hefyd wneud cais am dai cymdeithasol. Mae’r meini prawf cymhwysedd yn dibynnu ar ble rydych chi’n byw, ond efallai y byddwch chi’n cael blaenoriaeth os oes gennych chi incwm isel ac yn 50 oed neu’n hŷn.Fel arfer, mae angen i chi wneud cais ac ymuno â rhestr aros, gyda chartrefi sydd ar gael yn cael eu rhoi i’r rhai sydd â’r flaenoriaeth uchaf. Darganfyddwch fwy yn ein canllaw Sut i ddod o hyd i gartref rhent y gallwch chi ei fforddio.Os ydych chi’n aros mewn cartref rhent preifat, byddwch yn ymwybodol mai dim ond unwaith y flwyddyn y gall eich landlord fel arfer gynyddu eich rhent a rhaid i chi gael o leiaf 2 fis o rybudd. Os ydych chi’n credu bod unrhyw gynnydd rhent yn uwch na chyfradd y farchnad ar gyfer eich ardal, gallwch ei herio a gwneud cais am benderfyniad rhent marchnad.Ond mae’r union rheolau yn dibynnu ar y math o gytundeb sydd gennych chi, a ble yn y DU rydych chi’n rhentu. Er enghraifft, nid oes rhaid i’ch landlord roi rhybudd i chi i gynyddu’ch rhent os ydych chi’n lletywr. Am ragor o wybodaeth, gweler ein canllaw Cymorth gyda chynnydd rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu.Os ydych chi’n bwriadu symud i gartref rhent preifat newydd ar ôl ymddeol, byddwch yn ymwybodol y bydd angen i chi basio gwiriadau fforddiadwyedd fel arfer. Er enghraifft, efallai y bydd angen i chi gael incwm blynyddol sy’n werth 2 neu 3 gwaith yn fwy na’r rhent blynyddol.Os yw’ch incwm pensiwn rheolaidd yn is na hyn ond bod gennych chi gynilion arian parod, efallai y byddwch chi’n gallu dangos tystiolaeth o hyn yn lle. Ond peidiwch byth â thalu rhent ymlaen llaw gan fod hyn yn anghyfreithlon.',
      links: [
        {
          text: 'Sut i ddod o hyd i gartref rhent y gallwch chi ei fforddio',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/how-much-rent-can-you-afford',
        },
        {
          text: 'gwneud cais am benderfyniad rhent marchnad',
          url: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
        },
        {
          text: 'Cymorth gyda chynnydd rhent, ôl-ddyledion ac os ydych chi’n cael trafferth talu',
          url: 'https://www.moneyhelper.org.uk/cy/homes/renting/rent-arrears-problems-paying-your-rent#Help-if-you-can-t-afford-your-rent',
        },
      ],
    },
  },
  GP17: {
    en: {
      heading: 'Decide how to split your pensions in a divorce or dissolution',
      content:
        'Always include pensions in a divorce or dissolution settlement, even if you’ve agreed to keep them separate.This is because they might be your biggest assets and can be worth more than your home, so you might not be getting a fair deal.You can usually choose to use one or more of these options:transfer a portion of one person’s pension to another, called pension sharingask the pension provider to pay a share of the future pension income to each of you, called pension attachment or earmarkingkeep the full pension and let the other partner take other assets of similar value, called pension offsetting.You’ll normally need to decide how your pensions are split between you – they do not always need to be shared equally. You could consider using a mediator to help you decide.For more information, see How to split pensions in a divorce or dissolution. You can also book a free Pensions and divorce or dissolution appointment to get impartial guidance on your options from one of our pension specialists.',
      links: [
        {
          text: 'How to split pensions in a divorce or dissolution',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/split-pensions-in-a-divorce-or-dissolution',
        },
        {
          text: 'Pensions and divorce or dissolution appointment',
          url: 'https://www.moneyhelper.org.uk/en/family-and-care/divorce-and-separation/divorce-dissolution-pensions-appointment',
        },
      ],
    },
    cy: {
      heading:
        'Penderfynwch sut i rannu eich pensiynau mewn ysgariad neu ddiddymiad',
      content:
        'Dylech bob amser gynnwys pensiynau mewn setliad ysgariad neu ddiddymiad, hyd yn oed os ydych chi wedi cytuno i’w cadw ar wahân.Mae hyn oherwydd efallai mai nhw bydd eich asedau mwyaf a gallant fod werth mwy na’ch cartref, felly efallai nad ydych chi’n cael bargen deg.Fel arfer gallwch ddewis defnyddio un neu fwy o’r opsiynau hyn:trosglwyddo cyfran o bensiwn un person i un arall, a elwir yn rhannu pensiwngofyn i’r darparwr pensiwn dalu cyfran o’r incwm pensiwn yn y dyfodol i bob un ohonoch, a elwir yn atodi neu glustnodi pensiwncadw’r pensiwn llawn a gadael i’r partner arall gymryd asedau eraill o werth tebyg, a elwir yn wrthbwyso pensiwn.Fel arfer bydd angen i chi benderfynu sut mae eich pensiynau’n cael eu rhannu rhyngoch chi - nid oes angen eu rhannu’n gyfartal bob amser. Gallech ystyried defnyddio cyfryngwr i’ch helpu i benderfynu.Am ragor o wybodaeth, gweler Sut i rannu pensiynau mewn ysgariad neu ddiddymiad. Gallwch hefyd trefnu apwyntiad Pensiynau ac ysgariad neu ddiddymiad am ddim i gael arweiniad diduedd ar eich opsiynau gan un o’n harbenigwyr pensiwn.',
      links: [
        {
          text: 'Sut i rannu pensiynau mewn ysgariad neu ddiddymiad',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-problems/split-pensions-in-a-divorce-or-dissolution',
        },
        {
          text: 'apwyntiad Pensiynau ac ysgariad neu ddiddymiad',
          url: 'https://www.moneyhelper.org.uk/cy/family-and-care/divorce-and-separation/divorce-dissolution-pensions-appointment',
        },
      ],
    },
  },
  GP22: {
    en: {
      heading: 'Find out which types of pension you have',
      content:
        'If you have pensions you’ve not taken yet, the way they work and your options depend on what type it is.You can find out about different pension types in our guide Pension types and how they work. Your pension provider can also confirm the exact type and features you have.For more help and information about the different types of pensions, see our pensions explained section.',
      links: [
        {
          text: 'Pension types and how they work',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/types-of-pension-and-how-they-work',
        },
        {
          text: 'pensions explained',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics',
        },
      ],
    },
    cy: {
      heading: 'Darganfyddwch pa fathau o bensiwn sydd gennych',
      content:
        'Os oes gennych bensiynau nad ydych wedi’u cymryd eto, mae’r ffordd maen nhw’n gweithio a’ch opsiynau’n dibynnu ar y math sydd gennych.Gallwch ddysgu mwy am y gwahanol fathau o bensiynau yn ein canllaw Mathau o bensiynau a sut maen nhw’n gweithio. Gall eich darparwr pensiwn hefyd gadarnhau’n union pa fath a nodweddion sydd gennych.I gael rhagor o gymorth a gwybodaeth am y gwahanol fathau o bensiynau, gweler ein hadran esbonio pensiynau.',
      links: [
        {
          text: 'Mathau o bensiynau a sut maen nhw’n gweithio',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/types-of-pension-and-how-they-work',
        },
        {
          text: 'esbonio pensiynau',
          url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics',
        },
      ],
    },
  },
  GP23: {
    en: {
      heading: 'Speak with a free and confidential debt adviser',
      content:
        'It’s a good idea to get help with your current finances first. Sorting your debts now can help you have a more comfortable retirement. You’re not alone and help is available.Our Debt advice locator tool can help you find free and confidential debt advisers near you, online and by phone.',
      links: [
        {
          text: 'Debt advice locator tool',
          url: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
        },
      ],
    },
    cy: {
      heading: 'Siaradwch ag ymgynghorydd dyledion cyfrinachol am ddim',
      content:
        'Mae’n syniad da cael help gyda’ch cyllid cyfredol yn gyntaf. Gall trefnu eich dyledion nawr eich helpu i gael ymddeoliad mwy cyfforddus. Nid ydych chi ar eich pen eich hun ac mae help ar gael.Gall ein teclyn Lleolwr cyngor ar ddyledion eich helpu i ddod o hyd i ymgynghorwyr dyled cyfrinachol ac am ddim yn agos atoch chi, ar-lein a thros y ffôn.',
      links: [
        {
          text: 'teclyn Lleolwr cyngor ar ddyledion',
          url: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
        },
      ],
    },
  },
  GP23a: {
    en: {
      heading: 'Continue to get free help with your debts',
      content:
        'It’s great that you’ve already had debt advice. This can help you plan how to organise and repay the money you owe.If you need more support, you can use our Debt advice locator tool to find free and confidential debt advisers near you, online and by phone.',
      links: [
        {
          text: 'Debt advice locator tool',
          url: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
        },
      ],
    },
    cy: {
      heading: 'Parhewch i gael cymorth am ddim gyda’ch dyledion',
      content:
        'Mae’n wych eich bod eisoes wedi cael cyngor ar ddyledion. Gall hyn eich helpu i gynllunio sut i drefnu ac ad-dalu’r arian sy’n ddyledus gennych.Os oes angen mwy o gymorth arnoch, gallwch ddefnyddio ein teclyn Lleolwr cyngor ar ddyledion i ddod o hyd i ymgynghorwyr dyledion am ddim a chyfrinachol yn agos atoch chi, ar-lein a thros y ffôn.',
      links: [
        {
          text: 'teclyn Lleolwr cyngor ar ddyledion',
          url: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
        },
      ],
    },
  },
} as const satisfies Record<string, VariableGuidancePackage>;

export const staticGuidanceData = {
  SGR1: {
    sectionTestId: 'retirement-benefits-section',
    en: {
      title: 'Check if you’re entitled to any payments, grants and discounts',
      paragraphs: [
        'Many people do not realise that they’re entitled to extra support.',
        'Our quick and easy Benefits calculator can show you what you might be eligible for now.',
        'Any extra payments you get could help support your current costs and might mean you can afford to save more for your retirement.',
        'After you retire, you might also be able to get help paying certain costs. For example:',
        'Find out more in our guide about benefits in retirement.',
      ],
      listItems: [
        'help with your heating bills',
        'a free bus pass',
        'a free TV licence',
        'help with dental treatment.',
      ],
      links: [
        '/en/benefits/benefits-calculator',
        '/en/benefits/benefits-in-later-life/benefits-in-retirement',
      ],
    },
    cy: {
      title:
        'Gwiriwch a oes gennych hawl i unrhyw daliadau, grantiau a gostyngiadau',
      paragraphs: [
        'Nid yw llawer o bobl yn sylweddoli bod ganddynt hawl i gymorth ychwanegol.',
        'Gall ein cyfrifiannell Budd-daliadau cyflym a hawdd ddangos pa gymorth y gallech fod yn gymwys i’w gael.',
        'Gallai unrhyw daliadau ychwanegol a gewch helpu i dalu am eich costau presennol, a gallent olygu y gallwch fforddio cynilo mwy ar gyfer eich ymddeoliad.',
        'Ar ôl i chi ymddeol, efallai y gallwch hefyd gael cymorth i dalu costau penodol. Er enghraifft:',
        'Darganfyddwch fwy yn ein canllaw budd-daliadau mewn ymddeoliad.',
      ],
      listItems: [
        'cymorth gyda’ch biliau gwresogi',
        'tocyn bws am ddim',
        'trwydded deledu am ddim',
        'cymorth gyda thriniaeth ddeintyddol.',
      ],
      links: [
        '/cy/benefits/benefits-calculator',
        '/cy/benefits/benefits-in-later-life/benefits-in-retirement',
      ],
    },
  },
  SGR2: {
    sectionTestId: 'retirement-pre-benefits-section',
    en: {
      title:
        'Check if you can claim Pension Credit, plus other grants and discounts',
      paragraphs: [
        'If you’re expecting to have a low retirement income, care for someone else or receive disability benefits, check if you’re entitled to Pension Credit to boost your income.',
        'Even if you do not qualify for much extra money, it can make you eligible for other grants and help.',
        'You can use our Benefits calculator to see what you’re entitled to.',
        'You might also be able to get help paying certain costs. For example:',
        'Find out more in our guide about benefits in retirement.',
      ],
      listItems: [
        'help with your heating bills',
        'help with housing and care costs',
        'a free TV licence',
        'help with dental treatment.',
      ],
      links: [
        '/en/pensions-and-retirement/state-pension/pension-credit',
        '/en/benefits/benefits-calculator',
        '/en/benefits/benefits-in-later-life/benefits-in-retirement',
      ],
    },
    cy: {
      title:
        'Gwiriwch a allwch hawlio Credyd Pensiwn, ynghyd â grantiau a disgowntiau eraill',
      paragraphs: [
        'Os ydych chi’n disgwyl cael incwm ymddeol isel, yn gofalu am rywun arall neu’n derbyn budd-daliadau anabledd, gwiriwch a oes gennych hawl i Gredyd Pensiwn i roi hwb i’ch incwm.',
        'Hyd yn oed os nad ydych yn gymwys i gael llawer o arian ychwanegol, gall eich gwneud yn gymwys i gael grantiau a chymorth eraill.',
        'Gallwch ddefnyddio ein Cyfrifiannell budd-daliadau i weld beth sydd gennych hawl iddo.',
        'Efallai y byddwch hefyd yn gallu cael cymorth i dalu rhai costau. Er enghraifft:',
        'Darganfyddwch fwy yn ein canllaw am fudd-daliadau yn ystod ymddeoliad.',
      ],
      listItems: [
        'cymorth gyda’ch biliau gwresogi',
        'cymorth gyda chostau tai a gofal',
        'trwydded deledu am ddim',
        'cymorth gyda thriniaeth ddeintyddol.',
      ],
      links: [
        '/cy/pensions-and-retirement/state-pension/pension-credit',
        '/cy/benefits/benefits-calculator',
        '/cy/benefits/benefits-in-later-life/benefits-in-retirement',
      ],
    },
  },
} as const satisfies Record<string, StaticGuidancePackage>;
