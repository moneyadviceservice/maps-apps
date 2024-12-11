import Link from 'next/link';

import { LastPageWrapper } from 'components/LastPageWrapper';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '..';

const CustomerConsent = ({ links }: BaseProps) => {
  const { z } = useTranslation();

  const heading = z({
    en: `You need the customer's consent to make a referral`,
    cy: 'Mae angen caniatâd y cwsmer arnoch i wneud atgyfeiriad ',
  });

  const copyLink = z({
    en: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
    cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
  });

  return (
    <MoneyAdviserNetwork step="refer">
      <LastPageWrapper
        heading={heading}
        backLink={links.question.backLink}
        copyText={copyLink}
        copyButtonLabel={z({
          en: 'Copy this link',
          cy: 'Copïwch y ddolen hon',
        })}
      >
        <ul className="pl-4 mt-8 list-disc md:pl-6">
          <li key="consent" className="text-[18px] mb-4 pl-1 md:pl-2">
            {z({
              en: 'Advise the customer that it is not possible to proceed without consent',
              cy: `Rhoi gwybod i'r cwsmer nad yw'n bosibl symud ymlaen heb gydsyniad`,
            })}
          </li>
          <li key="adviser-network" className="text-[18px] mb-8 pl-1 md:pl-2">
            {z({
              en: 'Tell the customer they can still access help outside the Money Adviser Network:',
              cy: `Dywedwch wrth y cwsmer y gallant barhau i gael help y tu allan i'r Rhwydwaith Cynghorwyr Arian:`,
            })}
            <Link
              className="block mt-2 text-pink-600 underline"
              href={copyLink}
              target="_blank"
            >
              {copyLink}
            </Link>
          </li>
        </ul>
      </LastPageWrapper>
    </MoneyAdviserNetwork>
  );
};

export default CustomerConsent;

export const getServerSideProps = getServerSidePropsDefault;
