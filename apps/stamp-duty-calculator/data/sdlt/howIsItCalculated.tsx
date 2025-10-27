import React from 'react';
import { parse } from 'date-fns';
import { Link } from '@maps-react/common/components/Link';
import { BuyerContentConfig } from '../types';

// First-time buyer content
const FIRST_TIME_BUYER_CONTENT: BuyerContentConfig = {
  buyerType: 'firstTimeBuyer',
  periods: [
    {
      //From 01/04/2025 onwards
      startDate: parse('01/04/2025', 'dd/MM/yyyy', new Date()),
      endDate: null,
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Stamp Duty Land Tax (SDLT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Dir y Dreth Stamp (SDLT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: "When buying your first home, you won't need to pay SDLT on the first £300,000. This is called 'first-time buyers' relief'. There won't be any Stamp Duty Land Tax due if you buy your home for less than £300,000.",
            cy: "Wrth brynu eich cartref cyntaf, ni fydd angen i chi dalu SDLT ar y £300,000 cyntaf. Gelwir hyn yn 'rhyddhad prynwyr tro cyntaf'. Ni fydd unrhyw Dreth Dir y Dreth Stamp yn ddyledus gennych os byddwch yn prynu eich cartref am lai na £300,000.",
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of Stamp Duty an eligible{' '}
                <strong>first-time buyer</strong> would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau Treth Stamp y byddai{' '}
                <strong>prynwr tro cyntaf cymwys</strong> yn ei dalu.
              </>
            ),
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Stamp Duty'],
            cy: ['Pris prynu eiddo ', 'Cyfradd y Dreth Stamp'],
          },
          data: [
            ['£0 - £300,000', '0%'],
            ['£300,001 - £500,000', '5%'],
          ],
        },

        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy your first home for £310,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu eich cartref cyntaf am £310,000, bydd y canlynol yn ddyledus gennych:",
          },
          items: [
            {
              en: '0% on the first £300,000 = £0',
              cy: '0% ar y £300,000 cyntaf = £0',
            },
            {
              en: '5% on the remaining £10,000 = £500',
              cy: "5% ar y £10,000 sy'n weddill = £500",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £500 in Stamp Duty.',
            cy: "Felly, byddwch chi'n talu £500 mewn Treth Stamp.",
          },
        },

        {
          type: 'list',
          preamble: {
            en: 'A first-time buyer is someone who:',
            cy: 'Mae prynwr tro cyntaf yn rhywun sydd:',
          },
          items: [
            {
              en: 'is buying their first home, and  ',
              cy: 'yn prynu eu cartref cyntaf, ac',
            },
            {
              en: 'has never owned a residential property in the UK or any other country.',
              cy: 'erioed wedi bod yn berchen ar eiddo preswyl yn y DU nac unrhyw wlad arall.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'You’re eligible for a reduced rate of Stamp Duty if you, and anyone you’re buying with, are first-time buyers. If you’re buying with someone else and they aren’t a first-time buyer, you won’t be able to claim first-time buyers’ relief.',
            cy: "Rydych chi'n gymwys i gael cyfradd ostyngedig o Dreth Stamp os ydych chi, ac unrhyw un rydych chi'n prynu gyda nhw, yn brynwyr tro cyntaf. Os ydych chi'n prynu gyda rhywun arall ac nad ydyn nhw'n brynwr tro cyntaf, ni fyddwch yn gallu hawlio rhyddhad prynwyr tro cyntaf.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'First-time buyers purchasing property for more than £500,000 are not eligible for relief and pay SDLT at the standard rates.',
            cy: "Nid yw prynwyr tro cyntaf sy'n prynu eiddo am fwy na £500,000 yn gymwys i gael rhyddhad a byddant yn talu SDLT ar y cyfraddau safonol.",
          },
        },

        {
          type: 'table',
          heading: {
            en: 'Standard rates of Stamp Duty are shown below:',
            cy: 'Dangosir cyfraddau safonol y Dreth Stamp isod:',
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Stamp Duty'],
            cy: ['Pris prynu eiddo', 'Cyfradd y Dreth Stamp'],
          },
          data: [
            ['£0 - £125,000', '0%'],
            ['£125,001 - £250,000', '2%'],
            ['£250,001 - £925,000', '5%'],
            ['£925,001 - £1,500,000', '10%'],
            ['£1,500,001+', '12%'],
          ],
        },
      ],
    },
    {
      startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
      endDate: parse('31/03/2025', 'dd/MM/yyyy', new Date()),
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Stamp Duty Land Tax (SDLT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Dir y Dreth Stamp (SDLT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'When buying your first home, you won’t need to pay SDLT on the first £425,000. This is called ‘first-time buyers’ relief’. There won’t be any Stamp Duty Land Tax due if you buy your home for less than £425,000. ',
            cy: "Wrth brynu eich cartref cyntaf, ni fydd angen i chi dalu SDLT ar y £425,000 cyntaf. Gelwir hyn yn 'rhyddhad prynwyr tro cyntaf'. Ni fydd unrhyw Dreth Dir y Dreth Stamp yn ddyledus gennych os byddwch yn prynu eich cartref am lai na £425,000.",
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of Stamp Duty an eligible{' '}
                <strong>first-time buyer</strong> would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos cyfraddau Treth Stamp y byddai{' '}
                <strong>prynwr tro cyntaf cymwys</strong> yn ei dalu. Cyfradd y
                Dreth Stamp Cyfradd y Dreth Stamp{' '}
              </>
            ),
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Stamp Duty'],
            cy: ['Cyfradd y Dreth Stamp', 'Cyfradd y Dreth Stamp'],
          },
          data: [
            ['£0 - £425,000', '0%'],
            ['£425,001 - £625,000', '5%'],
          ],
        },
        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy your first home for £435,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu eich cartref cyntaf am £435,000, bydd y canlynol yn ddyledus gennych:",
          },
          items: [
            {
              en: '0% on the first £425,000 = £0',
              cy: '0% ar y £425,000 cyntaf = £0',
            },
            {
              en: '5% on the remaining £10,000 = £500',
              cy: "5% ar y £10,000 sy'n weddill = £500 ",
            },
          ],
        },

        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £500 in Stamp Duty.',
            cy: "Felly, byddwch chi'n talu £500 mewn Treth Stamp.",
          },
        },
        {
          type: 'list',
          preamble: {
            en: 'A first-time buyer is someone who:',
            cy: 'Mae prynwr tro cyntaf yn rhywun sydd:',
          },
          items: [
            {
              en: 'is buying their first home, and  ',
              cy: 'yn prynu eu cartref cyntaf, ac ',
            },
            {
              en: 'has never owned a residential property in the UK or any other country.',
              cy: 'erioed wedi bod yn berchen ar eiddo preswyl yn y DU nac unrhyw wlad arall.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'You’re eligible for a reduced rate of Stamp Duty if you, and anyone you’re buying with, are first-time buyers. If you’re buying with someone else and they aren’t a first-time buyer, you won’t be able to claim first-time buyers’ relief.',
            cy: "Rydych chi'n gymwys i gael cyfradd ostyngedig o Dreth Stamp os ydych chi, ac unrhyw un rydych chi'n prynu gyda nhw, yn brynwyr tro cyntaf. Os ydych chi'n prynu gyda rhywun arall ac nad ydyn nhw'n brynwr tro cyntaf, ni fyddwch yn gallu hawlio rhyddhad prynwyr tro cyntaf. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'First-time buyers purchasing property for more than £625,000 are not eligible for relief and pay SDLT at the standard rates.',
            cy: "Nid yw prynwyr tro cyntaf sy'n prynu eiddo am fwy na £625,000 yn gymwys i gael rhyddhad a byddant yn talu SDLT ar y cyfraddau safonol.",
          },
        },

        {
          type: 'table',
          heading: {
            en: 'Standard rates of Stamp Duty are shown below:',
            cy: 'Dangosir cyfraddau safonol y Dreth Stamp isod:',
          },
          columns: {
            en: ['Purchase price of property', 'Rate of Stamp Duty'],
            cy: ['Pris prynu eiddo', 'Cyfradd y Dreth Stamp'],
          },
          data: [
            ['£0 - £250,000', '0%'],
            ['£250,001 - £925,000', '5%'],
            ['£925,001 - £1,500,000', '10%'],
            ['£1,500,001+', '12%'],
          ],
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
      startDate: parse('01/04/2025', 'dd/MM/yyyy', new Date()),
      endDate: null,
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Stamp Duty Land Tax (SDLT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Dir y Dreth Stamp (SDLT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'You won’t need to pay SDLT on the first £125,000, unless the purchase means you’ll own more than one home. ',
            cy: "Ni fydd angen i chi dalu SDLT ar y £125,000 cyntaf, oni bai bod y pryniant yn golygu y byddwch chi'n berchen ar fwy nag un tŷ.",
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of Stamp Duty someone{' '}
                <strong>buying their next home</strong> would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos cyfraddau Treth Stamp y byddai rhywun
                sy'n <strong>prynu eu cartref nesaf</strong> yn ei dalu.{' '}
              </>
            ),
          },
          columns: {
            en: [
              'Purchase price of property',
              'Rate of stamp duty',
              'Additional Property Rate',
            ],
            cy: [
              'Pris prynu eiddo',
              'Cyfradd y Dreth Stamp',
              'Cyfradd Eiddo Ychwanegol',
            ],
          },
          data: [
            ['£0 - £125,000', '0%', '5%'],
            ['£125,001 - £250,000', '2%', '7%'],
            ['£250,001 - £925,000', '5%', '10%'],
            ['£925,001 - £1,500,000', '10%', '15%'],
            ['£1,500,001+', '12%', '17%'],
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
              en: '0% on the first £125,000 = £0',
              cy: '0% ar y £125,000 cyntaf = £0',
            },
            {
              en: '2% on the next £125,000 = £2,500',
              cy: '2% ar y £125,000 nesaf = £2,500',
            },
            {
              en: '5% on the remaining £50,000 = £2,500',
              cy: "5% ar y £50,000 sy'n weddill = £2,500",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £5,000 in Stamp Duty. ',
            cy: 'Felly, byddwch yn talu £5,000 mewn Treth Stamp.',
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'If you buy a new main residence but there’s a delay in selling your previous home, you might have to pay the higher rates of Stamp Duty as you’ll now own two properties. This is called the ‘Additional Property Rate’. ',
            cy: "Os ydych chi'n prynu prif breswylfa newydd ond bod oedi wrth werthu eich cartref blaenorol, efallai y bydd yn rhaid i chi dalu'r cyfraddau uwch o Dreth Stamp gan y byddwch bellach yn berchen ar ddau eiddo. Gelwir hyn yn 'Gyfradd Eiddo Ychwanegol'.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: (
              <>
                However, if you sell your previous main home within three years
                of buying a new one, you might be able to{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  apply for a refund
                </Link>{' '}
                of the higher SDLT rates you paid.
              </>
            ),
            cy: (
              <>
                Fodd bynnag, os ydych chi'n gwerthu eich prif gartref blaenorol
                o fewn tair blynedd o brynu un newydd, efallai y byddwch yn
                gallu{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  gwneud cais am ad-daliad
                </Link>{' '}
                o'r cyfraddau SDLT uwch a dalwyd gennych.
              </>
            ),
          },
        },
        {
          type: 'list',
          preamble: {
            en: 'You can request a refund for the amount above the normal Stamp Duty rates if:',
            cy: "Gallwch ofyn am ad-daliad am y swm sy'n uwch na'r cyfraddau Treth Stamp arferol os:",
          },
          items: [
            {
              en: 'you sell your previous main residence within three years, and you claim the refund within 12 months of the sale, or ',
              cy: "ydych chi'n gwerthu eich prif breswylfa flaenorol o fewn tair blynedd, a'ch bod yn hawlio'r ad-daliad o fewn 12 mis i'r gwerthiant, neu",
            },
            {
              en: 'within 12 months of the filing date of your SDLT tax return, whichever comes later.',
              cy: 'o fewn 12 mis o ddyddiad ffeilio eich ffurflen dreth SDLT, pa un bynnag a ddaw hwyraf.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'The Additional Property Rate only applies to properties bought for £40,000 or more, but it doesn’t apply to caravans, mobile homes or houseboats.',
            cy: "Mae'r Gyfradd Eiddo Ychwanegol yn berthnasol i eiddo a brynwyd am £40,000 neu fwy yn unig, ond nid yw'n berthnasol i garafanau, cartrefi symudol neu gychod preswyl.",
          },
        },
      ],
    },
    {
      startDate: parse('06/04/2023', 'dd/MM/yyyy', new Date()),
      endDate: parse('31/03/2025', 'dd/MM/yyyy', new Date()),
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Stamp Duty Land Tax (SDLT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Dir y Dreth Stamp (SDLT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'You won’t need to pay SDLT on the first £250,000, unless the purchase means you’ll own more than one home.',
            cy: 'Ni fydd angen i chi dalu SDLT ar y £250,000 cyntaf, oni bai bod y pryniant yn golygu y byddwch yn berchen ar fwy nag un cartref.',
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of Stamp Duty someone{' '}
                <strong>buying their next home</strong> would pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos cyfraddau Treth Stamp y byddai rhywun
                sy'n <strong>prynu eu cartref nesaf</strong> yn ei dalu.{' '}
              </>
            ),
          },
          columns: {
            en: [
              'Purchase price of property',
              'Rate of stamp duty',
              'Additional Property Rate',
            ],
            cy: [
              'Pris prynu eiddo',
              'Cyfradd y Dreth Stamp',
              'Cyfradd Eiddo Ychwanegol',
            ],
          },
          data: [
            ['£0 - £250,000', '0%', '5%'],
            ['£250,001 - £925,000', '5%', '10%'],
            ['£925,001 - £1,500,000', '10%', '15%'],
            ['£1,500,001+', '12%', '17%'],
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
              en: '0% on the first £250,000 = £0',
              cy: '0% ar y £250,000 cyntaf = £0',
            },
            {
              en: '5% on the remaining £50,000 = £2,500',
              cy: "5% ar y £50,000 sy'n weddill = £2,500",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £2,500 in Stamp Duty. ',
            cy: "Felly, byddwch chi'n talu £2,500 mewn Treth Stamp",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'If you buy a new main residence but there’s a delay in selling your previous home, you might have to pay the higher rates of Stamp Duty as you’ll now own two properties. This is called the ‘Additional Property Rate’.',
            cy: "Os ydych chi'n prynu prif breswylfa newydd ond bod oedi wrth werthu eich cartref blaenorol, efallai y bydd yn rhaid i chi dalu'r cyfraddau uwch o Dreth Stamp gan y byddwch bellach yn berchen ar ddau eiddo. Gelwir hyn yn 'Gyfradd Eiddo Ychwanegol'.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: (
              <>
                However, if you sell your previous main home within three years
                of buying a new one, you might be able to{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  apply for a refund
                </Link>{' '}
                of the higher SDLT rates you paid.
              </>
            ),
            cy: (
              <>
                Fodd bynnag, os ydych chi'n gwerthu eich prif gartref blaenorol
                o fewn tair blynedd o brynu un newydd, efallai y byddwch yn
                gallu{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  gwneud cais am ad-daliad
                </Link>{' '}
                o'r cyfraddau SDLT uwch a dalwyd gennych.
              </>
            ),
          },
        },
        {
          type: 'list',
          preamble: {
            en: 'You can request a refund for the amount above the normal Stamp Duty rates if:',
            cy: "Gallwch ofyn am ad-daliad am y swm sy'n uwch na'r cyfraddau Treth Stamp arferol os:",
          },
          items: [
            {
              en: 'you sell your previous main residence within three years, and you claim the refund within 12 months of the sale, or ',
              cy: "rydych chi'n gwerthu eich prif breswylfa flaenorol o fewn tair blynedd, a'ch bod yn hawlio'r ad-daliad o fewn 12 mis i'r gwerthiant, neu ",
            },
            {
              en: 'within 12 months of the filing date of your SDLT tax return, whichever comes later.',
              cy: 'o fewn 12 mis o ddyddiad ffeilio eich ffurflen dreth SDLT, pa un bynnag a ddaw hwyfach.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'The Additional Property Rate only applies to properties bought for £40,000 or more, but it doesn’t apply to caravans, mobile homes or houseboats.',
            cy: "Mae'r Gyfradd Eiddo Ychwanegol yn berthnasol i eiddo a brynwyd am £40,000 neu fwy yn unig, ond nid yw'n berthnasol i garafanau, cartrefi symudol neu gychod preswyl.",
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
      startDate: parse('01/04/2025', 'dd/MM/yyyy', new Date()),
      endDate: null,
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Stamp Duty Land Tax (SDLT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Dir y Dreth Stamp (SDLT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol.",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'If you’re buying an additional property, such as a second home, you’ll pay an extra 5% Stamp Duty on top of the standard rates. This is called the ‘Additional Property Rate’.  ',
            cy: "Os ydych chi'n prynu eiddo ychwanegol, fel ail gartref, byddwch yn talu Treth Stamp ychwanegol o 5% ar ben y cyfraddau safonol. Gelwir hyn yn 'Gyfradd Eiddo Ychwanegol'.",
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of Stamp Duty for someone buying{' '}
                <strong>an additional property or second home</strong> would
                pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau Treth Stamp fyddai rhywun
                sy'n prynu <strong>eiddo ychwanegol neu ail gartref</strong> yn
                ei dalu.{' '}
              </>
            ),
          },
          columns: {
            en: [
              'Purchase price of property',
              'Rate of stamp duty',
              'Additional Property Rate',
            ],
            cy: [
              "Pris prynu'r eiddo",
              'Cyfradd y Dreth Stamp',
              'Treth Stamp gan gynnwys Cyfradd Eiddo Ychwanegol',
            ],
          },
          data: [
            ['£0 - £125,000', '0%', '5%'],
            ['£125,001 - £250,000', '2%', '7%'],
            ['£250,001 - £925,000', '5%', '10%'],
            ['£925,001 - £1,500,000', '10%', '15%'],
            ['£1,500,001+', '12%', '17%'],
          ],
        },
        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy an additional property for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu ail gartref am £300,000, byddwch yn talu'r Gyfradd Eiddo Ychwanegol:",
          },
          items: [
            {
              en: '5% on the first £125,000 = £6,250',
              cy: '5% ar y £125,000 cyntaf = £6,250',
            },
            {
              en: '7% on the next £125,000 = £8,750',
              cy: '7% ar y £125,000 nesaf = £8,750',
            },
            {
              en: '10% on the remaining £50,000 = £5,000',
              cy: "10% ar y £50,000 sy'n weddill = £5,000",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £20,000 in Stamp Duty.',
            cy: 'Felly, byddwch yn talu £20,000 mewn Treth Stamp.',
          },
        },

        {
          type: 'paragraph',
          content: {
            en: (
              <>
                However, if you sell your previous main home within three years
                of buying your new home you might be able to{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  apply for a refund
                </Link>{' '}
                of the higher SDLT rates you paid.
              </>
            ),
            cy: (
              <>
                Fodd bynnag, os ydych chi'n gwerthu eich prif gartref blaenorol
                o fewn tair blynedd o brynu un newydd, efallai y byddwch yn
                gallu{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  gwneud cais am ad-daliad
                </Link>{' '}
                o'r cyfraddau SDLT uwch a dalwyd gennych.
              </>
            ),
          },
        },
        {
          type: 'list',
          preamble: {
            en: 'You can request a refund for the amount above the normal Stamp Duty rates if:',
            cy: "Gallwch ofyn am ad-daliad am y swm sy'n uwch na'r cyfraddau Treth Stamp arferol os: ",
          },
          items: [
            {
              en: 'you sell your previous main residence within three years, and you claim the refund within 12 months of the sale, or ',
              cy: "ydych chi'n gwerthu eich prif breswylfa flaenorol o fewn tair blynedd, a'ch bod yn hawlio'r ad-daliad o fewn 12 mis i'r gwerthiant, neu",
            },
            {
              en: 'within 12 months of the filing date of your SDLT tax return, whichever comes later.',
              cy: 'o fewn 12 mis o ddyddiad ffeilio eich ffurflen dreth SDLT, pa un bynnag a ddaw hwyraf.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'The Additional Property Rate only applies to properties bought for £40,000 or more, but it doesn’t apply to caravans, mobile homes or houseboats. ',
            cy: "Mae'r Gyfradd Eiddo Ychwanegol yn berthnasol i eiddo a brynwyd am £40,000 neu fwy yn unig, ond nid yw'n berthnasol i garafanau, cartrefi symudol neu gychod preswyl.",
          },
        },
      ],
    },
    {
      startDate: parse('31/10/2024', 'dd/MM/yyyy', new Date()),
      endDate: parse('31/03/2025', 'dd/MM/yyyy', new Date()),
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Stamp Duty Land Tax (SDLT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Dir y Dreth Stamp (SDLT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'If you’re buying an additional property, such as a second home, you’ll pay an extra 5% Stamp Duty on top of the standard rates. This is called the ‘Additional Property Rate’.',
            cy: "Os ydych chi'n prynu eiddo ychwanegol, fel ail gartref, byddwch yn talu Treth Stamp ychwanegol o 5% ar ben y cyfraddau safonol. Gelwir hyn yn 'Gyfradd Eiddo Ychwanegol'.",
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of Stamp Duty for someone buying{' '}
                <strong>an additional property or second home</strong> would
                pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau Treth Stamp fyddai
                unrhywun sy'n prynu{' '}
                <strong>eiddo ychwanegol neu ail gartref</strong> yn ei dalu.
              </>
            ),
          },
          columns: {
            en: [
              'Purchase price of property',
              'Rate of stamp duty',
              'Additional Property Rate',
            ],
            cy: [
              'Pris prynu eiddo',
              'Cyfradd y Dreth Stamp',
              'Treth Stamp gan gynnwys Cyfradd Eiddo Ychwanegol',
            ],
          },
          data: [
            ['£0 - £250,000', '0%', '5%'],
            ['£250,001 - £925,000', '5%', '10%'],
            ['£925,001 - £1,500,000', '10%', '15%'],
            ['£1,500,001+', '12%', '17%'],
          ],
        },
        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy an additional property for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu ail gartref am £300,000, byddwch yn talu'r Gyfradd Eiddo Ychwanegol:",
          },
          items: [
            {
              en: '5% on the first £250,000 = £12,500',
              cy: '5% ar y £250,000 cyntaf = £12,500',
            },

            {
              en: '10% on the remaining £50,000 = £5,000',
              cy: "10% ar y £50,000 sy'n weddill = £5,000",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £17,500 in Stamp Duty. ',
            cy: 'Felly, byddwch yn talu £17,500 mewn Treth Stamp.',
          },
        },

        {
          type: 'paragraph',
          content: {
            en: (
              <>
                However, if you sell your previous main home within three years
                of buying your new home you might be able to{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  apply for a refund
                </Link>{' '}
                of the higher SDLT rates you paid.
              </>
            ),
            cy: (
              <>
                Fodd bynnag, os ydych chi'n gwerthu eich prif gartref blaenorol
                o fewn tair blynedd o brynu un newydd, efallai y byddwch yn
                gallu{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  gwneud cais am ad-daliad
                </Link>{' '}
                o'r cyfraddau SDLT uwch a dalwyd gennych.
              </>
            ),
          },
        },
        {
          type: 'list',
          preamble: {
            en: 'You can request a refund for the amount above the normal Stamp Duty rates if:',
            cy: "Gallwch ofyn am ad-daliad am y swm sy'n uwch na'r cyfraddau Treth Stamp arferol os:",
          },
          items: [
            {
              en: 'you sell your previous main residence within three years, and you claim the refund within 12 months of the sale, or ',
              cy: "ydych chi'n gwerthu eich prif breswylfa flaenorol o fewn tair blynedd, a'ch bod yn hawlio'r ad-daliad o fewn 12 mis i'r gwerthiant, neu ",
            },
            {
              en: 'within 12 months of the filing date of your SDLT tax return, whichever comes later. ',
              cy: 'o fewn 12 mis o ddyddiad ffeilio eich ffurflen dreth SDLT, pa un bynnag a ddaw hwyraf.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'The Additional Property Rate only applies to properties bought for £40,000 or more, but it doesn’t apply to caravans, mobile homes or houseboats. ',
            cy: "Mae'r Gyfradd Eiddo Ychwanegol yn berthnasol i eiddo a brynwyd am £40,000 neu fwy, ond nid yw'n berthnasol i garafanau, cartrefi symudol neu gychod preswyl. ",
          },
        },
      ],
    },
    {
      startDate: parse('06/01/2023', 'dd/MM/yyyy', new Date()),
      endDate: parse('30/10/2024', 'dd/MM/yyyy', new Date()),
      contentBlocks: [
        {
          type: 'paragraph',
          content: {
            en: 'You usually pay Stamp Duty Land Tax (SDLT) when you buy a residential property over a certain price. Different property values have different tax rates – but each rate only applies to the part of the property price within its band.',
            cy: "Fel arfer, rydych chi'n talu Treth Dir y Dreth Stamp (SDLT) pan fyddwch chi'n prynu eiddo preswyl dros bris penodol. Mae gan wahanol werthoedd eiddo gyfraddau treth gwahanol - ond dim ond i'r rhan o'r pris eiddo o fewn ei band y mae pob cyfradd yn berthnasol. ",
          },
        },
        {
          type: 'paragraph',
          content: {
            en: 'If you’re buying an additional property, such as a second home, you’ll pay an extra 3% Stamp Duty on top of the standard rates. This is called the ‘Additional Property Rate’.',
            cy: "Os ydych chi'n prynu eiddo ychwanegol, fel ail gartref, byddwch yn talu Treth Stamp ychwanegol o 3% ar ben y cyfraddau safonol. Gelwir hyn yn 'Gyfradd Eiddo Ychwanegol'.",
          },
        },
        {
          type: 'table',
          heading: {
            en: (
              <>
                The table below shows the rates of Stamp Duty for someone buying{' '}
                <strong>an additional property or second home</strong> would
                pay.
              </>
            ),
            cy: (
              <>
                Mae'r tabl isod yn dangos y cyfraddau Treth Stamp fyddai rhywun
                sy'n prynu <strong>eiddo ychwanegol neu ail gartref</strong> yn
                ei dalu.
              </>
            ),
          },
          columns: {
            en: [
              'Purchase price of property',
              'Rate of stamp duty',
              'Additional Property Rate',
            ],
            cy: [
              'Pris prynu eiddo',
              'Cyfradd y Dreth Stamp',
              'Treth Stamp gan gynnwys Cyfradd Eiddo Ychwanegol',
            ],
          },
          data: [
            ['£0 - £250,000', '0%', '3%'],
            ['£250,001 - £925,000', '5%', '8%'],
            ['£925,001 - £1,500,000', '10%', '13%'],
            ['£1,500,001+', '12%', '15%'],
          ],
        },
        {
          type: 'list',
          preamble: {
            en: 'For example, if you buy an additional property for £300,000, you will owe:',
            cy: "Er enghraifft, os ydych chi'n prynu eich ail gartref am £300,000, byddwch yn talu'r Gyfradd Eiddo Ychwanegol:",
          },
          items: [
            {
              en: '3% on the first £250,000 = £7,500',
              cy: '3% ar y £250,000 cyntaf = £7,500',
            },

            {
              en: '8% on the remaining £50,000 = £4,000',
              cy: "8% ar y £50,000 sy'n weddill = £4,000 ",
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'So, you’ll pay £11,500 in Stamp Duty. ',
            cy: 'Felly, byddwch yn talu £11,500 mewn Treth Stamp.',
          },
        },

        {
          type: 'paragraph',
          content: {
            en: (
              <>
                However, if you sell your previous main home within three years
                of buying your new home you might be able to{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  apply for a refund
                </Link>{' '}
                of the higher SDLT rates you paid.
              </>
            ),
            cy: (
              <>
                Fodd bynnag, os ydych chi'n gwerthu eich prif gartref blaenorol
                o fewn tair blynedd o brynu un newydd, efallai y byddwch yn
                gallu{' '}
                <Link
                  href="https://www.gov.uk/guidance/apply-for-a-refund-of-the-higher-rates-of-stamp-duty-land-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  asInlineText
                  withIcon={false}
                >
                  gwneud cais am ad-daliad
                </Link>{' '}
                o'r cyfraddau SDLT uwch a dalwyd gennych.
              </>
            ),
          },
        },
        {
          type: 'list',
          preamble: {
            en: 'You can request a refund for the amount above the normal Stamp Duty rates if:',
            cy: "Gallwch ofyn am ad-daliad am y swm sy'n uwch na'r cyfraddau Treth Stamp arferol os: ",
          },
          items: [
            {
              en: 'you sell your previous main residence within three years, and you claim the refund within 12 months of the sale, or ',
              cy: "ydych chi'n gwerthu eich prif breswylfa flaenorol o fewn tair blynedd, a'ch bod yn hawlio'r ad-daliad o fewn 12 mis i'r gwerthiant, neu ",
            },
            {
              en: 'within 12 months of the filing date of your SDLT tax return, whichever comes later. ',
              cy: 'o fewn 12 mis o ddyddiad ffeilio eich ffurflen dreth SDLT, pa un bynnag a ddaw hwyraf.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: {
            en: 'The Additional Property Rate only applies to properties bought for £40,000 or more, but it doesn’t apply to caravans, mobile homes or houseboats. ',
            cy: "Mae'r Gyfradd Eiddo Ychwanegol yn berthnasol i eiddo a brynwyd am £40,000 neu fwy, ond nid yw'n berthnasol i garafanau, cartrefi symudol neu gychod preswyl.",
          },
        },
      ],
    },
  ],
};

export const SDLT: BuyerContentConfig[] = [
  FIRST_TIME_BUYER_CONTENT,
  NEXT_HOME_CONTENT,
  ADDITIONAL_HOME_CONTENT,
];
