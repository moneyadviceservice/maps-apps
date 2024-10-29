import { Button } from '@maps-react/common/components/Button';
import { Container } from '@maps-react/core/components/Container';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { TOOL_PATH } from 'CONSTANTS';
import { H1, Link, Paragraph } from '@maps-digital/shared/ui';
import { BackLink } from '@maps-react/common/components/BackLink';
import { getServerSidePropsDefault, MoneyAdviserNetwork } from '.';
import { ToolLinks } from 'utils/generateToolLinks';

type Props = {
  links: ToolLinks;
};

const DebtAdviceLocator = ({ links }: Props) => {
  const { z } = useTranslation();

  const backLink = links.question.goToQuestionTwo;

  return (
    <MoneyAdviserNetwork step="refer">
      <Container className="pb-16">
        <BackLink href={backLink}>
          {z({
            en: 'Back',
            cy: 'Yn ôl',
          })}
        </BackLink>
        <div className={twMerge('lg:max-w-[840px] space-y-8')}>
          <H1>
            {z({
              en: 'Refer the customer to the debt advice locator',
              cy: 'Atgyfeiro y cwsmer at y lleolwr cyngor ar ddyledion',
            })}
          </H1>
          <Paragraph>
            {z({
              en: 'The Money Adviser Network helps people living in England only. ',
              cy: "Mae'r Rhwydwaith Cynghorwyr Arian yn helpu pobl sy'n byw yn Lloegr yn unig.",
            })}
          </Paragraph>
          <Paragraph>
            {z({
              en: 'Ask the customer to use the debt advice locator tool:',
              cy: "Gofynnwch i'r cwsmer ddefnyddio'r teclyn lleolwr cyngor ar ddyledion:",
            })}
          </Paragraph>
          <Paragraph>
            <Link
              href={z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
              })}
            >
              {z({
                en: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
                cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
              })}
            </Link>
          </Paragraph>
          <Paragraph>
            <Button
              variant="link"
              className="gap-0"
              onClick={() => console.warn('Add copy link functionlity')}
            >
              {z({
                en: 'Copy this link',
                cy: 'Copïwch y ddolen hon',
              })}
            </Button>
          </Paragraph>
          <div className="space-y-4 space-x-8">
            <Button
              variant="primary"
              type="button"
              as="a"
              href={`${TOOL_PATH}/1`}
              data-testid="landing-page-button"
              data-cy="landing-page-button"
              className="w-full sm:w-auto"
            >
              {z({
                en: 'Sign out',
                cy: 'Allgofnodi',
              })}
            </Button>
            <Button
              variant="secondary"
              type="button"
              as="a"
              href={`${TOOL_PATH}/1`}
              data-testid="landing-page-button"
              data-cy="landing-page-button"
              className="w-full sm:w-auto"
            >
              {z({
                en: 'Make another referral',
                cy: 'Gwneud atgyfeiriad arall',
              })}
            </Button>
          </div>
        </div>
      </Container>
    </MoneyAdviserNetwork>
  );
};

export default DebtAdviceLocator;

export const getServerSideProps = getServerSidePropsDefault;
