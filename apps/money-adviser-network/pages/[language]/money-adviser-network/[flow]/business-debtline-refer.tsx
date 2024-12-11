import { LastPageWrapper } from 'components/LastPageWrapper';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const BusinessDebtlineRefer = ({ links }: BaseProps) => {
  const { z } = useTranslation();

  const backLink = links.question.goToQuestionThree;
  const heading = z({
    en: 'Refer the customer to Business Debtline',
    cy: 'Atgyfeirio y cwsmer at Business Debtline',
  });

  const debtlineUrl = 'https://www.businessdebtline.org';
  const copyText = z({
    en: `${debtlineUrl}\nTel: 0800 197 6026\nMonday to Friday: 9am - 8pm`,
    cy: `${debtlineUrl}\nFfôn: 0800 197 6026\nDydd Llun i ddydd Gwener: 9am - 8pm`,
  });

  return (
    <MoneyAdviserNetwork step="refer">
      <LastPageWrapper
        heading={heading}
        backLink={backLink}
        copyText={copyText}
        copyButtonLabel={z({
          en: 'Copy these details',
          cy: 'Copïwch y manylion hyn',
        })}
      >
        <>
          <Paragraph>
            {z({
              en: 'Ask self-employed customers, business owners or company directors to use Business Debtline - a free service where they can get impartial, non-judgmental help from business debt advice experts.',
              cy: 'Gofynnwch i gwsmeriaid hunangyflogedig, perchnogion busnes neu gyfarwyddwyr cwmni ddefnyddio Busnes Debtline - gwasanaeth am ddim lle gallant gael cymorth diduedd, anfarnol gan arbenigwyr cyngor ar ddyledion busnes.',
            })}
          </Paragraph>
          <Paragraph>
            <Link href={debtlineUrl} target="_blank" asInlineText>
              {debtlineUrl}
            </Link>
          </Paragraph>
          <Paragraph>
            {z({
              en: (
                <span>
                  Tel: 0800 197 6026 <br /> Monday to Friday: 9am - 8pm
                </span>
              ),
              cy: (
                <span>
                  Ffôn: 0800 197 6026 <br /> Dydd Llun i ddydd Gwener: 9am - 8pm
                </span>
              ),
            })}
          </Paragraph>
        </>
      </LastPageWrapper>
    </MoneyAdviserNetwork>
  );
};

export default BusinessDebtlineRefer;

export const getServerSideProps = getServerSidePropsDefault;
