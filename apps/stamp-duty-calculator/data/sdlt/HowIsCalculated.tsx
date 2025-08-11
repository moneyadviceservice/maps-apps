import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Table } from '@maps-react/common/components/Table';
import useTranslation from '@maps-react/hooks/useTranslation';

import { List } from '../../components/List';

export const HowIsItCalculated = ({
  buyerType,
}: {
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
}) => {
  const { z } = useTranslation();

  if (buyerType === 'firstTimeBuyer') {
    return z({
      en: (
        <>
          <Paragraph>
            You usually pay Stamp Duty Land Tax (SDLT) on the portion of the
            property price that’s within the relevant band when you buy a
            residential property.
          </Paragraph>
          <Paragraph>
            The table below shows the rates of stamp duty an eligible{' '}
            <strong>first-time buyer</strong> would pay.
          </Paragraph>
          <Table
            columnHeadings={[
              'Purchase price of property',
              'Rate of Stamp Duty',
            ]}
            data={[
              ['£0 - £300,000', '0%'],
              ['£300,001 - £500,000', '5%'],
            ]}
          />
          <Paragraph>
            Eligible first-time buyers paying between £300,000 and £500,000 will
            pay SDLT at 5% on the amount of the purchase price more than
            £300,000.
          </Paragraph>
          <Paragraph>
            Homes costing less than £300,000 will pay no stamp duty at all.
          </Paragraph>
          <Paragraph>
            First-time buyers purchasing property for more than £500,000 will
            not be entitled to any relief and will pay SDLT at the standard
            rates.
          </Paragraph>
          <Paragraph>The relief must be claimed in an SDLT return.</Paragraph>
          <Paragraph>
            A first-time buyer is defined as an individual or individuals who
            have never owned an interest in a residential property in the United
            Kingdom or anywhere else in the world and who intends to occupy the
            property as their main residence. This includes acquisitions by
            inheritance or gift.
          </Paragraph>
          <Paragraph>
            You are eligible if you and anyone else you are buying with are
            first-time buyers.
          </Paragraph>
          <Paragraph>Standard rates of Stamp Duty are shown below:</Paragraph>
          <Table
            columnHeadings={[
              'Purchase price of property',
              'Rate of Stamp Duty',
            ]}
            data={[
              ['£0 - £125,000', '0%'],
              ['£125,001 - £250,000', '2%'],
              ['£250,001 - £925,000', '5%'],
              ['£925,001 - £1,500,000', '10%'],
              ['Over £1.5 million', '12%'],
            ]}
          />
        </>
      ),
      cy: (
        <>
          <Paragraph>
            Fel arfer byddwch yn talu Treth Tir Treth Stamp (SDLT) ar y gyfran o
            bris yr eiddo pan fyddwch yn prynu eiddo preswyl.
          </Paragraph>
          <Paragraph>
            Mae’r tabl isod yn dangos y cyfraddau treth stamp y byddai rhywun
            sy’n <strong>prynu cartref am y tro cyntaf</strong> yn ei dalu.
          </Paragraph>
          <Table
            columnHeadings={["Pris prynu'r eiddo", 'Cyfradd Treth Stamp']}
            data={[
              ['£0 - £300,000', '0%'],
              ['£300,001 - £500,000', '5%'],
            ]}
          />
          <Paragraph>
            Bydd prynwyr tro cyntaf cymwys sy’n talu rhwng £300,000 a £500,000
            yn talu SDLT ar 5% ar swm y pris pryniant dros £300,000.
          </Paragraph>
          <Paragraph>
            Ni fydd tai sydd yn costio llai na £300,000 yn talu treth stamp.
          </Paragraph>
          <Paragraph>
            Ni fydd prynwyr tro cyntaf sy’n prynu eiddo am dros £500,000 yn
            gymwys am unrhyw ryddhad a byddant yn talu SDLT ar y cyfraddau
            arferol.
          </Paragraph>
          <Paragraph>Rhaid hawlio’r rhyddhad mewn ffurflen SDLT.</Paragraph>
          <Paragraph>
            Diffinnir prynwr tro cyntaf fel unigolyn neu unigolion sydd erioed
            wedi perchen ar fuddiant mewn eiddo preswyl yn y Deyrnas Unedig nac
            unrhyw le arall yn y byd ac sy’n bwriadu byw yn yr eiddo fel eu prif
            breswylfa. Mae hwn yn cynnwys caffaeliadau trwy etifeddiaeth neu
            rodd.
          </Paragraph>
          <Paragraph>
            Rydych yn gymwys os ydych chi ac unrhyw un arall rydych yn ei brynu
            gyda nhw yn brynwyr tro cyntaf.
          </Paragraph>
          <Paragraph>Dangosir cyfraddau safonol Treth Stamp isod:</Paragraph>
          <Table
            columnHeadings={[
              "Pris prynu'r eiddo",
              'Cyfradd safonol Treth Stamp',
            ]}
            data={[
              ['£0 - £250,000', '0%'],
              ['£250,001 - £925,000', '5%'],
              ['£925,001 - £1,500,000', '10%'],
              ['Dros £1.5 miliwn', '12%'],
            ]}
          />
        </>
      ),
    });
  } else if (buyerType === 'nextHome') {
    return z({
      en: (
        <>
          <Paragraph>
            You usually pay Stamp Duty Land Tax (SDLT) on the portion of the
            property price that’s within the relevant band when you buy a
            residential property.
          </Paragraph>
          <Paragraph>
            The table below shows the rates of stamp duty someone{' '}
            <strong>buying their next home</strong> would pay.
          </Paragraph>
          <Table
            columnHeadings={[
              'Purchase price of property',
              'Rate of stamp duty',
              'Additional Property Rate*',
            ]}
            data={[
              ['£0 - £125,000', '0%', '5%'],
              ['£125,001 - £250,000', '2%', '7%'],
              ['£250,001 - £925,000', '5%', '10%'],
              ['£925,001 - £1,500,000', '10%', '15%'],
              ['Over £1.5 million', '12%', '17%'],
            ]}
          />
          <Paragraph>
            You will pay Stamp Duty on residential properties costing more than
            £125,000 unless you qualify for first-time buyers’ relief.
          </Paragraph>
          <Paragraph>
            If you buy a new main residence but there’s a delay in selling your
            previous main residence, you might have to pay the higher rates of
            Stamp Duty as you’ll now own two properties.
          </Paragraph>
          <Paragraph>
            However, if you sell your previous main home within three years of
            buying your new home you might be able to{' '}
            <Link href="https://www.gov.uk/government/publications/stamp-duty-land-tax-apply-for-a-repayment-of-the-higher-rates-for-additional-properties">
              apply for a refund
            </Link>{' '}
            of the higher SDLT rates you paid when you purchased your new home.
          </Paragraph>
          <List
            type="unordered"
            preamble="You can request a refund for the amount above the normal Stamp Duty rates if:"
            items={[
              {
                text: 'you sell your previous main residence within three years, and you claim the refund within 12 months of the sale of your previous main residence, or',
              },
              {
                text: 'within 12 months of the filing date of your SDLT tax return, whichever comes later.',
              },
            ]}
          />
        </>
      ),
      cy: (
        <>
          <Paragraph>
            Fel arfer byddwch yn talu Treth Tir Treth Stamp (SDLT) ar y gyfran o
            bris yr eiddo pan fyddwch yn prynu eiddo preswyl.
          </Paragraph>
          <Paragraph>
            Mae’r tabl isod yn dangos y cyfraddau treth stamp y byddai rhywun
            sy’n <strong>prynu eu cartref nesaf</strong> yn ei dalu.
          </Paragraph>
          <Table
            columnHeadings={[
              "Pris prynu'r eiddo",
              'Cyfradd safonol Treth Stamp',
              'Cyfradd Eiddo Ychwanegol*',
            ]}
            data={[
              ['£0 - £125,000', '0%', '5%'],
              ['£125,001 - £250,000', '2%', '7%'],
              ['£250,001 - £925,000', '5%', '10%'],
              ['£925,001 - £1,500,000', '10%', '15%'],
              ['Dros £1.5 miliwn', '12%', '15%'],
            ]}
          />
          <Paragraph>
            Byddwch yn talu Treth Stamp ar eiddo preswyl sy’n costio mwy na
            £125,000 oni bai eich bod yn gymwys i gael ryddhad prynwr tro
            cyntaf.
          </Paragraph>
          <Paragraph>
            Os ydych yn prynu prif breswylfa newydd ond mae oedi wrth werthu
            eich prif breswylfa flaenorol, efallai y bydd angen i chi dalu’r
            cyfraddau uwch o Dreth Stamp gan eich bod nawr yn berchen ar ddau
            eiddo.
          </Paragraph>
          <Paragraph>
            Fodd bynnag, os ydych yn gwerthu eich prif gartref blaenorol o fewn
            tair blynedd o brynu eich cartref newydd efallai y gallwch{' '}
            <Link href="https://www.gov.uk/government/publications/stamp-duty-land-tax-apply-for-a-repayment-of-the-higher-rates-for-additional-properties">
              wneud cais am ad-daliad
            </Link>{' '}
            o’r cyfraddau SDLT uwch a daloch pan brynoch eich cartref newydd.
          </Paragraph>
          <List
            type="unordered"
            preamble="Gallwch wneud cais am ad-daliad am y swm dros y cyfraddau safonol Treth Stamp os:"
            items={[
              {
                text: 'ydych yn gwerthu eich prif breswylfa flaenorol o fewn tair blynedd, a’ch bod yn hawlio’r ad-daliad o fewn 12 mis o werthu eich prif breswylfa flaenorol, neu',
              },
              {
                text: "ydych o fewn 12 mis o ddyddiad cyflwyno eich ffurflen dreth SDLT, pa un bynnag a ddaw'n ddiweddarach.",
              },
            ]}
          />
        </>
      ),
    });
  } else if (buyerType === 'additionalHome') {
    return z({
      en: (
        <>
          <Paragraph>
            You usually pay Stamp Duty Land Tax (SDLT) on the portion of the
            property price when you buy a residential property.
          </Paragraph>
          <Paragraph>
            The table below shows the rates of stamp duty for someone buying{' '}
            <strong>an additional property or second home</strong> would pay.
          </Paragraph>
          <Table
            columnHeadings={[
              'Purchase price of property',
              'Rate of stamp duty',
              'Additional Property Rate*',
            ]}
            data={[
              ['£0 - £125,000', '0%', '5%'],
              ['£125,001 - 250,000', '2%', '7%'],
              ['£250,001 - £925,000', '5%', '10%'],
              ['£925,001 - £1,500,000', '10%', '15%'],
              ['Over £1.5 million', '12%', '17%'],
            ]}
          />
          <Paragraph>
            If you’re buying an additional property, such as a second home
            you’ll have to pay an extra 5% in Stamp Duty on top of the standard
            rates.
          </Paragraph>
          <Paragraph>
            This increased rate applies to properties bought for £40,000 or
            more.
          </Paragraph>
          <Paragraph>
            It doesn’t apply to caravans, mobile homes or houseboats.
          </Paragraph>
          <Paragraph>
            If you buy a new main residence but there’s a delay in selling your
            previous main residence, you might have to pay the higher rates of
            Stamp Duty as you’ll now own two properties.
          </Paragraph>
          <Paragraph>
            However, if you sell your previous main home within three years of
            buying your new home you might be able to apply for a refund of the
            higher SDLT rates you paid when you purchased your new home.
          </Paragraph>
          <List
            type="unordered"
            preamble="You can request a refund for the amount above the normal Stamp Duty rates if:"
            items={[
              {
                text: 'you sell your previous main residence within three years, and you claim the refund within 12 months of the sale of your previous main residence, or',
              },
              {
                text: 'within 12 months of the filing date of your SDLT tax return, whichever comes later.',
              },
            ]}
          />
        </>
      ),
      cy: (
        <>
          <Paragraph>
            Fel arfer byddwch yn talu Treth Tir Treth Stamp (SDLT) ar y gyfran o
            bris yr eiddo pan fyddwch yn prynu eiddo preswyl.
          </Paragraph>
          <Paragraph>
            Mae’r tabl isod yn dangos y cyfraddau treth stamp y byddai rhywun
            sy’n prynu{' '}
            <strong>eiddo ychwanegol neu ail gartref yn ei dalu.</strong>
          </Paragraph>
          <Table
            columnHeadings={[
              "Pris prynu'r eiddo",
              'Cyfradd safonol Treth Stamp',
              'Cyfradd Eiddo Ychwanegol*',
            ]}
            data={[
              ['£0 - £125,000', '0%', '5%'],
              ['£125,001 - 250,000', '2%', '7%'],
              ['£250,001 - £925,000', '5%', '10%'],
              ['£925,001 - £1,500,000', '10%', '15%'],
              ['Dros £1.5 miliwn', '12%', '15%'],
            ]}
          />
          <Paragraph>
            Os ydych yn prynu eiddo ychwanegol, fel ail gartref bydd rhaid talu
            3% ychwanegol yn y Dreth Stamp ar ben y cyfraddau safonol.
          </Paragraph>
          <Paragraph>
            Mae’r gyfradd ychwanegol hon yn ymwneud ag eiddo a brynwyd am
            £40,000 neu’n fwy.
          </Paragraph>
          <Paragraph>
            Nid yw hwn yn berthnasol i garafanau, cartrefi symudol neu gychod
            preswyl.
          </Paragraph>
          <Paragraph>
            Os ydych yn prynu prif breswylfa newydd ond mae oedi wrth werthu
            eich prif breswylfa flaenorol, efallai y bydd yn rhaid i chi dalu
            cyfraddau uwch y Dreth Stamp gan eich bod nawr yn berchen ar ddau
            eiddo.
          </Paragraph>
          <Paragraph>
            Fodd bynnag, os ydych yn gwerthu eich prif gartref blaenorol o fewn
            tair blynedd o brynu eich cartref newydd efallai y gallwch wneud
            cais am ad-daliad o’r cyfraddau SDLT uwch a daloch pan brynoch eich
            cartref newydd.
          </Paragraph>
          <List
            type="unordered"
            preamble="Gallwch wneud cais am ad-daliad am y swm dros y cyfraddau safonol Treth Stamp os:"
            items={[
              {
                text: 'ydych yn gwerthu eich prif breswylfa flaenorol o fewn tair blynedd, fallwch hawlio ad-daliad o fewn 12 mis o werthiant eich prif breswylfa flaenorol, neu',
              },
              {
                text: "ydych o fewn 12 mis o ddyddiad cyflwyno eich ffurflen dreth SDLT, pa un bynnag a ddaw'n ddiweddarach.",
              },
            ]}
          />
        </>
      ),
    });
  }

  return null;
};
