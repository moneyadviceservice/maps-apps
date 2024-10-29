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

const MoneyManagementRefer = ({ links }: Props) => {
  const { z } = useTranslation();
  const backLink = links.question.goToQuestionOne;

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
              en: 'Refer the customer to the following links',
              cy: 'Atgyfeirio y cwsmer at y dolenni canlynol',
            })}
          </H1>
          <Paragraph className="font-bold">
            {z({
              en: 'Please inform the customer of the following:',
              cy: "Rhowch wybod i'r cwsmer am y canlynol:",
            })}
          </Paragraph>
          <Paragraph>
            {z({
              en: 'There is information on the MoneyHelper website that you might find helpful. It offers free and impartial guidance for dealing with money troubles:',
              cy: "Mae yna wybodaeth ar wefan HelpwrArian y gallai fod o gymorth i chi. Mae'n cynnig arweiniad diduedd ac am ddim ar gyfer delio â thrafferthion ariannol.",
            })}
          </Paragraph>
          <Paragraph>
            {z({
              en: 'Would you like me to send you more details via email or text or you can just visit MoneyHelper.org.uk?',
              cy: 'A hoffech i mi anfon mwy o fanylion atoch drwy e-bost neu neges destun neu gallwch ymweld â MoneyHelper.org.uk/cy?',
            })}
          </Paragraph>
          <Paragraph>
            {z({
              en: (
                <>
                  There is a helpful section on benefits{' '}
                  <Link href="https://www.moneyhelper.org.uk/en/benefits">
                    https://www.moneyhelper.org.uk/en/benefits
                  </Link>
                </>
              ),
              cy: (
                <>
                  Mae yna adran ddefnyddiol ar fudd-daliadau{' '}
                  <Link href="https://www.moneyhelper.org.uk/cy/benefits">
                    https://www.moneyhelper.org.uk/cy/benefits
                  </Link>
                </>
              ),
            })}
          </Paragraph>
          <Paragraph>
            {z({
              en: (
                <>
                  The &quot;Money troubles&quot; section has useful information
                  to help with cost of living{' '}
                  <Link href="https://www.moneyhelper.org.uk/en/money-troubles">
                    https://www.moneyhelper.org.uk/en/money-troubles
                  </Link>
                </>
              ),
              cy: (
                <>
                  Mae gan yr adran &quot;problemau ariannol&quot; wybodaeth
                  ddefnyddiol i helpu gyda chostau byw{' '}
                  <Link href="https://www.moneyhelper.org.uk/cy/money-troubles">
                    https://www.moneyhelper.org.uk/cy/money-troubles
                  </Link>
                </>
              ),
            })}
          </Paragraph>
          <Paragraph>
            {z({
              en: (
                <>
                  Search for budget planner for a really useful tool that will
                  help you create a budget and see where your money is going{' '}
                  <Link href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner">
                    https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner
                  </Link>
                </>
              ),
              cy: (
                <>
                  Chwilio am cynlluniwr cyllideb am declyn defnyddiol iawn a
                  fydd yn eich helpu i greu cyllideb a gweld ble mae&apos;ch
                  arian yn mynd{' '}
                  <Link href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner">
                    https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner
                  </Link>
                </>
              ),
            })}
          </Paragraph>
          <Paragraph>
            <Button
              variant="link"
              className="gap-0"
              onClick={() => console.warn('Add copy link functionlity')}
            >
              {z({
                en: 'Copy these links',
                cy: 'Copïwch y dolenni hyn',
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

export default MoneyManagementRefer;

export const getServerSideProps = getServerSidePropsDefault;
