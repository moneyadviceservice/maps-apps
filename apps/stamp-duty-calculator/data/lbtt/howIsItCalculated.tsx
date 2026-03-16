import React from 'react';
import { parse } from 'date-fns';
import { BuyerContentConfig } from '../types';

// First-time buyer content
const FIRST_TIME_BUYER_CONTENT: BuyerContentConfig = {
  buyerType: 'firstTimeBuyer',
  periods: [
    {
      //From 06/04/2023 onwards
      startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
      endDate: null,
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Land and Buildings Transaction Tax (LBTT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Trafodion Tir ac Adeiladau (LBTT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'When buying your first home, you won’t need to pay LBTT on the first £175,000. This is called ‘first-time buyer relief’. There won’t be any Land and Buildings Transaction Tax due if you buy your home for less than £175,000.',
            cy: "Wrth brynu eich cartref cyntaf, ni fydd angen i chi dalu LBTT ar y £175,000 cyntaf. Gelwir hyn yn 'rhyddhad prynwr tro cyntaf'. Ni fydd unrhyw Dreth Trafodion Tir ac Adeiladau yn ddyledus gennych os byddwch yn prynu eich cartref am lai na £175,000.",
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of LBTT a{' '}
                <strong>first-time buyer</strong> would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau LBTT y byddai{' '}
                <strong>prynwr tro cyntaf</strong> yn ei dalu.
              </>
            ),
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Stamp Duty'],
            cy: [
              'Pris prynu eiddo ',
              'Cyfradd Treth Trafodion Tir ac Adeiladau (LBTT)',
            ],
          },
          data: [
            ['£0 - £175,000', '0%'],
            ['£175,001 - £250,000', '2%'],
            ['£250,001 - £325,000', '5%'],
            ['£325,001 - £750,000', '10%'],
            ['£750,001+', '12%'],
          ],
        },

        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy your first home for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu eich cartref cyntaf am £300,000, bydd y canlynol yn ddyledus gennych:",
          },
          items: [
            {
              en: '0% on the first £175,000 = £0',
              cy: '0% ar y £175,000 cyntaf = £0 ',
            },
            {
              en: '2% on the remaining £75,000 = £1,500',
              cy: '2% ar y £75,000 nesaf = £1,500 ',
            },
            {
              en: '5% on the remaining £50,000 = £2,500',
              cy: "5% ar y £50,000 sy'n weddill = £2,500 ",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £4,000 in Land and Buildings Transaction Tax.',
            cy: 'Felly, byddwch yn talu £4,000 mewn Treth Trafodion Tir ac Adeiladau. ',
          },
        },

        {
          type: 'list',
          preamble: {
            en: 'A first-time buyer is someone who:',
            cy: 'Mae prynwr tro cyntaf yn rhywun sydd: ',
          },
          items: [
            {
              en: 'is buying their first home, and  ',
              cy: 'yn prynu eu cartref cyntaf, ac  ',
            },
            {
              en: 'has never owned a residential property in the UK or any other country.',
              cy: 'erioed wedi bod yn berchen ar eiddo preswyl yn y DU nac unrhyw wlad arall. ',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'You’re eligible for an increased 0% rate of LBTT if you, and anyone you’re buying with, are first-time buyers. If you’re buying with someone else and they aren’t a first-time buyer, you won’t be able to claim first-time buyer relief.',
            cy: "Rydych chi'n gymwys i gael cyfradd uwch o 0% o LBTT os ydych chi, ac unrhyw un rydych chi'n prynu gyda nhw, yn brynwyr tro cyntaf. Os ydych chi'n prynu gyda rhywun arall ac nad ydyn nhw'n brynwr tro cyntaf, ni fyddwch yn gallu hawlio rhyddhad prynwr tro cyntaf.",
          },
        },
      ],
    },
  ],
};

// Next home content
const NEXT_HOME_CONTENT: BuyerContentConfig = {
  buyerType: 'nextHome',
  periods: [
    {
      startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
      endDate: null,
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Land and Buildings Transaction Tax (LBTT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Trafodion Tir ac Adeiladau (LBTT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'You won’t need to pay LBTT on the first £145,000 of the purchase price.',
            cy: 'Ni fydd angen i chi dalu LBTT ar £145,000 cyntaf y pris prynu. ',
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of LBTT{' '}
                <strong>someone buying their next home</strong> would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos cyfraddau LBTT y byddai{' '}
                <strong>rhywun sy'n prynu eu cartref nesaf</strong> yn ei dalu.{' '}
              </>
            ),
          },
          columns: {
            en: [
              'Purchase price of property',
              'Rate of Land and Buildings Transaction Tax (LBTT)',
            ],
            cy: [
              'Pris prynu eiddo',
              'Cyfradd Treth Trafodion Tir ac Adeiladau (LBTT) ',
            ],
          },
          data: [
            ['£0 - £145,000', '0%'],
            ['£145,001 - £250,000', '2%'],
            ['£250,001 - £325,000', '5%'],
            ['£325,001 - £750,000', '10%'],
            ['Over £750,000', '12%'],
          ],
        },
        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy your next home for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu eich cartref nesaf am £300,000, bydd y canlynol yn ddyledus gennych:",
          },
          items: [
            {
              en: '0% on the first £145,000 = £0',
              cy: '0% ar y £145,000 cyntaf = £0 ',
            },
            {
              en: '2% on the next £105,000 = £2,100',
              cy: '2% ar y £105,000 nesaf = £2,100 ',
            },
            {
              en: '5% on the remaining £50,000 = £2,500',
              cy: "5% ar y £50,000 sy'n weddill = £2,500 ",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £4,600 in Land and Buildings Transaction Tax.',
            cy: 'Felly, byddwch yn talu £4,600 mewn Treth Trafodion Tir ac Adeiladau. ',
          },
        },
      ],
    },
  ],
};

// Additional home content
const ADDITIONAL_HOME_CONTENT: BuyerContentConfig = {
  buyerType: 'additionalHome',
  periods: [
    {
      startDate: parse('05/12/2024', 'dd/MM/yyyy', new Date()),
      endDate: null,
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Land and Buildings Transaction Tax (LBTT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Trafodion Tir ac Adeiladau (LBTT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'LBTT is not paid on the first £145,000 of the purchase price.',
            cy: "Nid yw LBTT yn cael ei dalu ar y £145,000 cyntaf o'r pris prynu.  ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'But when buying a second or additional property, you’ll pay LBTT plus an Additional Dwelling Supplement (ADS) of 8% of the total purchase price.',
            cy: 'Ond wrth brynu ail eiddo neu eiddo ychwanegol, byddwch yn talu LBTT ynghyd ag Atodiad Annedd Ychwanegol (ADS) o 8% o gyfanswm y pris prynu. ',
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of LBTT{' '}
                <strong>
                  someone buying their additional property, or second home
                </strong>{' '}
                would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos cyfraddau LBTT{' '}
                <strong>
                  y byddai rhywun sy'n prynu eu heiddo ychwanegol, neu ail
                  gartref yn
                </strong>{' '}
                ei dalu.
              </>
            ),
          },
          columns: {
            en: [
              'Purchase price of property',
              'Rate of Land and Buildings Transaction Tax (LBTT) ',
            ],
            cy: [
              'Pris prynu eiddo ',
              'Cyfradd Treth Trafodion Tir ac Adeiladau (LBTT) ',
            ],
          },
          data: [
            ['£0 - £145,000', '0%'],
            ['£145,001 - £250,000', '2%'],
            ['£250,001 - £325,000', '5%'],
            ['£325,001 - £750,000', '10%'],
            ['Over £750,000', '12%'],
          ],
        },
        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy a second home for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu ail gartref am £300,000, bydd y canlynol yn ddyledus gennych: ",
          },
          items: [
            {
              en: '0% on the first £145,000 = £0',
              cy: '0% ar y £145,000 cyntaf = £0 ',
            },
            {
              en: '2% on the next £105,000 = £2,100',
              cy: '2% ar y £105,000 nesaf = £2,100 ',
            },
            {
              en: '5% on the remaining £50,000 = £2,500',
              cy: "5% ar y £50,000 sy'n weddill = £2,500 ",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £4,600 in Land and Buildings Transaction Tax',
            cy: 'Felly, byddwch yn talu £4,600 mewn Treth Trafodion Tir ac Adeiladau ',
          },
        },
        {
          type: 'list',
          preamble: {
            en: 'Plus, the Additional Dwelling Supplement:',
            cy: 'Hefyd, yr atodiad annedd ychwanegol: ',
          },
          items: [
            {
              en: '8% on £300,000 = £24,000',
              cy: '    8% o £300,000 = £24,000  ',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you will pay £28,600 in total.',
            cy: 'Felly, byddwch yn talu cyfanswm o £28,600.  ',
          },
        },

        {
          type: 'paragraph',
          content: {
            en: 'Properties under £40,000 do not pay an Additional Dwelling Supplement (ADS).',
            cy: 'Nid yw eiddo o dan £40,000 yn talu Atodiad Annedd Ychwanegol (ADS).',
          },
        },
      ],
    },
    {
      startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
      endDate: parse('04/12/2024', 'dd/MM/yyyy', new Date()),
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Land and Buildings Transaction Tax (LBTT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Trafodion Tir ac Adeiladau (LBTT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'LBTT is not paid on the first £145,000 of the purchase price. ',
            cy: "Nid yw LBTT yn cael ei dalu ar y £145,000 cyntaf o'r pris prynu.  ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'When buying a second or additional property, you’ll pay LBTT plus an Additional Dwelling Supplement (ADS) of 6% of the total purchase price. ',
            cy: 'Wrth brynu ail eiddo neu eiddo ychwanegol, byddwch yn talu LBTT ynghyd ag Atodiad Annedd Ychwanegol (ADS) o 6% o gyfanswm y pris prynu. ',
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of LBTT{' '}
                <strong>
                  someone buying their additional property, or second home
                </strong>{' '}
                would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos cyfraddau LBTT{' '}
                <strong>
                  y byddai rhywun sy'n prynu eu heiddo ychwanegol, neu ail
                  gartref yn
                </strong>{' '}
                ei dalu.
              </>
            ),
          },
          columns: {
            en: [
              'Purchase price of property',
              'Rate of Land and Buildings Transaction Tax (LBTT) ',
            ],
            cy: [
              'Pris prynu eiddo ',
              'Cyfradd Treth Trafodion Tir ac Adeiladau (LBTT) ',
            ],
          },
          data: [
            ['£0 - £145,000', '0%'],
            ['£145,001 - £250,000', '2%'],
            ['£250,001 - £325,000', '5%'],
            ['£325,001 - £750,000', '10%'],
            ['Over £750,000', '12%'],
          ],
        },
        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy a second home for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu ail gartref am £300,000, bydd y canlynol yn ddyledus gennych: ",
          },
          items: [
            {
              en: '0% on the first £145,000 = £0',
              cy: '0% ar y £145,000 cyntaf = £0 ',
            },

            {
              en: '2% on the remaining £105,000 = £2,100',
              cy: '2% ar y £105,000 nesaf = £2,100 ',
            },
            {
              en: '5% on the remaining £50,000 = £2,500',
              cy: "5% ar y £50,000 sy'n weddill = £2,500 ",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £4,600 in Land and Buildings Transaction Tax',
            cy: 'Felly, byddwch yn talu £4,600 mewn Treth Trafodion Tir ac Adeiladau ',
          },
        },
        {
          type: 'list',
          preamble: {
            en: 'Plus, the Additional Dwelling Supplement:',
            cy: 'Hefyd, yr atodiad annedd ychwanegol: ',
          },
          items: [
            {
              en: '6% on £300,000 = £18,000',
              cy: '6% o £300,000 = £18,000  ',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you will pay £22,600 in total.',
            cy: 'Felly, byddwch yn talu cyfanswm o £22,600.  ',
          },
        },

        {
          type: 'paragraph',
          content: {
            en: 'Properties under £40,000 do not pay an Additional Dwelling Supplement (ADS).',
            cy: 'Nid yw eiddo o dan £40,000 yn talu Atodiad Annedd Ychwanegol (ADS). ',
          },
        },
      ],
    },
  ],
};

export const LBTT: BuyerContentConfig[] = [
  FIRST_TIME_BUYER_CONTENT,
  NEXT_HOME_CONTENT,
  ADDITIONAL_HOME_CONTENT,
];
