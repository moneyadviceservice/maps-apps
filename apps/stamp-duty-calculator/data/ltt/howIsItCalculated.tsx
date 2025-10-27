import React from 'react';
import { parse } from 'date-fns';
import { BuyerContentConfig } from '../types';

// First-time buyer content
const FIRST_TIME_BUYER_CONTENT: BuyerContentConfig = {
  buyerType: 'firstOrNextHome',
  periods: [
    {
      startDate: parse('11/12/2024', 'dd/MM/yyyy', new Date()),
      endDate: null,
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Land Transaction Tax (LTT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Trafodiad Tir (LTT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'LTT is not paid on the first £225,000 when buying a single property.',
            cy: 'Nid yw LTT yn cael ei dalu ar y £225,000 cyntaf wrth brynu eiddo sengl. ',
          },
        },
        {
          type: 'paragraph',
          content: {
            en: (
              <>
                The table below shows the rates of Land Transaction Tax someone {' '}
                <strong>buying their first or next home</strong> would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau Treth Trafodiad Tir y
                byddai rhywun sy'n prynu eu cartref cyntaf neu'u cartref nesaf
                yn ei dalu.{' '}
                <strong>prynu eu cartref cyntaf neu'u cartref nesaf</strong> yn
                ei dalu.
              </>
            ),
          },
        },
        {
          type: 'table',

          heading: {
            en: <strong>Main residential LTT rates</strong>,
            cy: <strong>Prif gyfraddau LTT preswyl </strong>,
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Land Transaction Tax '],
            cy: ['Pris prynu eiddo ', 'Cyfradd Treth Trafodiadau Tir'],
          },
          data: [
            ['£0 - £225,000', '0%'],
            ['£225,001 - £400,000', '6%'],
            ['£400,001 - £750,000', '7.5%'],
            ['£750,001 - £1,500,000', '10%'],
            ['£1,500,001+', '12%'],
          ],
        },

        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy your first home for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu eich cartref cyntaf neu'ch cartref nesaf am £300,000, bydd y canlynol yn ddyledus gennych:",
          },
          items: [
            {
              en: '0% on the first £225,000 = £0',
              cy: '0% ar y £225,000 cyntaf = £0 ',
            },
            {
              en: '6% on the remaining £75,000 = £4,500',
              cy: '6% ar y £75,000 nesaf = £4,500 ',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £4,500 in Land Transaction Tax.',
            cy: 'Felly, byddwch yn talu £4,500 mewn Treth Trafodiadau Tir. ',
          },
        },

        {
          type: 'paragraph',
          content: {
            en: (
              <>
                If the property is an{' '}
                <strong>additional property or second home</strong>, the higher
                residential rates may apply.
              </>
            ),
            cy: (
              <>
                Os yw'r eiddo yn eiddo{' '}
                <strong>ychwanegol neu’n ail gartref</strong>, gall y cyfraddau
                preswyl uwch fod yn berthnasol.
              </>
            ),
          },
        },
        {
          type: 'table',

          heading: {
            en: <strong>Higher residential LTT rates</strong>,
            cy: <strong>Cyfraddau LTT preswyl uwch </strong>,
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Land Transaction Tax'],
            cy: ['Pris prynu eiddo ', 'Cyfradd Treth Trafodiadau Tir '],
          },
          data: [
            ['£0 - £180,000', '5%'],
            ['£180,001 - £250,000', '8.5%'],
            ['£250,001 - £400,000', '10%'],
            ['£400,001 - £750,000', '12.5%'],
            ['£750,001 - £1,500,000', '15%'],
            ['£1,500,001+', '17%'],
          ],
        },
      ],
    },
    {
      startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
      endDate: parse('10/12/2024', 'dd/MM/yyyy', new Date()),
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Land Transaction Tax (LTT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Trafodiad Tir (LTT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'LTT is not paid on the first £225,000 when buying a single property.',
            cy: 'Nid yw LTT yn cael ei dalu ar y £225,000 cyntaf wrth brynu eiddo sengl. ',
          },
        },
        {
          type: 'paragraph',
          content: {
            en: (
              <>
                The table below shows the rates of Land Transaction Tax someone {' '}
                <strong>buying their first or next home</strong> would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau Treth Trafodiad Tir y
                byddai rhywun sy'n{' '}
                <strong>prynu eu cartref cyntaf neu'u cartref nesaf</strong> yn
                ei dalu.
              </>
            ),
          },
        },
        {
          type: 'table',

          heading: {
            en: <strong>Main residential LTT rates</strong>,
            cy: <strong>Prif gyfraddau LTT preswyl </strong>,
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Land Transaction Tax '],
            cy: ['Pris prynu eiddo ', 'Cyfradd Treth Trafodiadau Tir'],
          },
          data: [
            ['£0 - £225,000', '0%'],
            ['£225,001 - £400,000', '6%'],
            ['£400,001 - £750,000', '7.5%'],
            ['£750,001 - £1,500,000', '10%'],
            ['£1,500,001+', '12%'],
          ],
        },

        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy your first home for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu eich cartref cyntaf am £300,000, bydd y canlynol yn ddyledus gennych: ",
          },
          items: [
            {
              en: '0% on the first £225,000 = £0',
              cy: '0% ar y £225,000 cyntaf = £0 ',
            },
            {
              en: '6% on the remaining £75,000 = £4,500',
              cy: '6% ar y £75,000 nesaf = £4,500 ',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £4,500 in Land Transaction Tax.',
            cy: 'Felly, byddwch yn talu £4,500 mewn Treth Trafodiadau Tir. ',
          },
        },

        {
          type: 'paragraph',
          content: {
            en: (
              <>
                If the property is an{' '}
                <strong>additional property or second home</strong>, the higher
                residential rates may apply.
              </>
            ),
            cy: (
              <>
                Os yw'r eiddo yn eiddo{' '}
                <strong>ychwanegol neu’n ail gartref</strong>, gall y cyfraddau
                preswyl uwch fod yn berthnasol.
              </>
            ),
          },
        },

        {
          type: 'table',

          heading: {
            en: <strong>Higher residential LTT rates</strong>,
            cy: <strong>Cyfraddau LTT preswyl uwch </strong>,
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Land Transaction Tax'],
            cy: ['Pris prynu eiddo ', 'Cyfradd Treth Trafodiadau Tir '],
          },
          data: [
            ['£0 - £180,000', '4%'],
            ['£180,001 - £250,000', '7.5%'],
            ['£250,001 - £400,000', '9%'],
            ['£400,001 - £750,000', '11.5%'],
            ['£750,001 - £1,500,000', '14%'],
            ['£1,500,001+', '16%'],
          ],
        },
      ],
    },
  ],
};

// Next home content
const ADDITIONAL_HOME_CONTENT: BuyerContentConfig = {
  buyerType: 'additionalHome',
  periods: [
    {
      startDate: parse('11/12/2024', 'dd/MM/yyyy', new Date()),
      endDate: null,
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Land Transaction Tax (LTT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Trafodiad Tir (LTT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: (
              <>
                The table below shows the rates of Land Transaction Tax someone {' '}
                <strong>buying an additional property or second home</strong>{' '}
                would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau uwch o Dreth Trafodiad Tir
                y byddai rhywun{' '}
                <strong>sy'n prynu eiddo ychwanegol neu ail gartref </strong>yn
                ei dalu.
              </>
            ),
          },
        },
        {
          type: 'table',

          heading: {
            en: <strong>Higher residential LTT rates</strong>,
            cy: <strong>Cyfraddau LTT preswyl uwch </strong>,
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Land Transaction Tax '],
            cy: ['Pris prynu eiddo ', 'Cyfradd Treth Trafodiadau Tir'],
          },
          data: [
            ['£0 - £180,000', '5%'],
            ['£180,001 - £400,000', '8.5%'],
            ['£250,001 - £400,000', '10%'],
            ['£400,001 - £750,000', '12.5%'],
            ['£750,001 - £1,500,000', '15%'],
            ['£1,500,001+', '17%'],
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
              en: '5% on the first £180,000 = £9,000',
              cy: '5% ar y £180,000 cyntaf = £9,000 ',
            },
            {
              en: '8.5% on the next £70,000 = £5,950',
              cy: '8.5% ar y £70,000 nesaf = £5,950 ',
            },
            {
              en: '10% on the remaining £50,000 = £5,000',
              cy: "    10% ar y £50,000 sy'n weddill = £5000 ",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £19,950 in Land Transaction Tax.',
            cy: 'Felly, byddwch yn talu £19,950 mewn Treth Trafodiadau Tir. ',
          },
        },
        {
          type: 'paragraph',
          content: {
            en: (
              <>
                If someone is <strong>buying their first or next home</strong>,
                the main residential rates in the table below may apply - LTT is
                not paid on the first £225,000 when buying a single property.
              </>
            ),
            cy: (
              <>
                Os yw rhywun yn{' '}
                <strong>prynu eu cartref cyntaf neu'u cartref nesaf</strong>,
                efallai y bydd y prif gyfraddau preswyl yn y tabl isod yn
                berthnasol - nid yw LTT yn cael ei dalu ar y £225,000 cyntaf
                wrth brynu eiddo sengl.{' '}
              </>
            ),
          },
        },
        {
          type: 'table',

          heading: {
            en: <strong>Main residential LTT rates</strong>,
            cy: <strong>Prif gyfraddau LTT preswyl </strong>,
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Land Transaction Tax'],
            cy: ['Pris prynu eiddo ', 'Cyfradd Treth Trafodiadau Tir '],
          },
          data: [
            ['£0 - £225,000', '0%'],
            ['£225,001 - £400,000', '6%'],
            ['£400,001 - £750,000', '7.5%'],
            ['£750,001 - £1,500,000', '10%'],
            ['£1,500,001+', '12%'],
          ],
        },
      ],
    },
    {
      startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
      endDate: parse('10/12/2024', 'dd/MM/yyyy', new Date()),
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Land Transaction Tax (LTT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Trafodiad Tir (LTT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: (
              <>
                The table below shows the rates of Land Transaction Tax someone {' '}
                <strong>buying an additional property or second home</strong>{' '}
                would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau uwch o Dreth Trafodiad Tir
                y byddai rhywun sy'n prynu eiddo{' '}
                <strong>ychwanegol neu ail gartref yn</strong> ei dalu.{' '}
              </>
            ),
          },
        },
        {
          type: 'table',

          heading: {
            en: <strong>Higher residential LTT rates</strong>,
            cy: <strong>Cyfraddau LTT preswyl uwch </strong>,
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Land Transaction Tax '],
            cy: ['Pris prynu eiddo', 'Cyfradd Treth Trafodiadau Tir '],
          },
          data: [
            ['£0 - £180,000', '4%'],
            ['£180,001 - £400,000', '7.5%'],
            ['£250,001 - £400,000', '9%'],
            ['£400,001 - £750,000', '11.5%'],
            ['£750,001 - £1,500,000', '14%'],
            ['£1,500,001+', '16%'],
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
              en: '4% on the first £180,000 = £7,200',
              cy: '    4% ar y £180,000 cyntaf = £7,200 ',
            },
            {
              en: '7.5% on the next £70,000 = £5,250',
              cy: '    7.5% ar y £70,000 nesaf = £5,250 ',
            },
            {
              en: '9% on the remaining £50,000 = £4,500',
              cy: "    9% ar y £50,000 sy'n weddill = £4,500 ",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £16,950 in Land Transaction Tax.',
            cy: 'Felly, byddwch yn talu £16,950 mewn Treth Trafodiadau Tir. ',
          },
        },
        {
          type: 'paragraph',
          content: {
            en: (
              <>
                If someone is <strong>buying their first or next home</strong>,
                the main residential rates in the table below may apply - LTT is
                not paid on the first £225,000 when buying a single property.
              </>
            ),
            cy: (
              <>
                Os yw rhywun yn{' '}
                <strong>prynu eu cartref cyntaf neu'u cartref nesaf</strong>,
                efallai y bydd y prif gyfraddau preswyl yn y tabl isod yn
                berthnasol - nid yw LTT yn cael ei dalu ar y £225,000 cyntaf
                wrth brynu eiddo sengl.{' '}
              </>
            ),
          },
        },
        {
          type: 'table',
          heading: {
            en: <strong>Main residential LTT rates</strong>,
            cy: <strong>Prif gyfraddau LTT preswyl </strong>,
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Land Transaction Tax'],
            cy: ['Pris prynu eiddo', 'Cyfradd Treth Trafodiadau Tir'],
          },
          data: [
            ['£0 - £225,000', '0%'],
            ['£225,001 - £400,000', '6%'],
            ['£400,001 - £750,000', '7.5%'],
            ['£750,001 - £1,500,000', '10%'],
            ['£1,500,001+', '12%'],
          ],
        },
      ],
    },
  ],
};

export const LTT: BuyerContentConfig[] = [
  FIRST_TIME_BUYER_CONTENT,
  ADDITIONAL_HOME_CONTENT,
];
