import { Landing } from 'components/Landing';
import { Link, Paragraph, ListElement } from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addEmbedQuery } from 'utils/addEmbedQuery';

type Props = {
  lang: string;
  isEmbed?: boolean;
};

const LandingContent = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();
  return (
    <>
      {' '}
      <Paragraph>
        {z({
          en: "There are many reasons you could have been declined, like having a poor (or no) credit history and not passing the lender's identity or affordability checks.",
          cy: '',
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: "Only the lender will know why, so it's worth asking their customer services for the exact reason(s) before you start. But be aware that they don't have to tell you. Don't worry if you can't get an answer, you can still use this tool.",
          cy: '',
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: 'To help, you can use this tool to:',
          cy: '',
        })}
      </Paragraph>
      <ListElement
        variant="unordered"
        color="blue"
        className="ml-7"
        items={[
          <>
            {z({
              en: 'identify potential reasons why you were declined',
              cy: '',
            })}
          </>,
          <>
            {z({
              en: 'see an action plan with things you can fix',
              cy: '',
            })}
          </>,
          <>
            {z({
              en: "find out what to do when you're ready to apply again.",
              cy: '',
            })}
          </>,
        ]}
      />
      <Paragraph>
        {z({
          en: (
            <span>
              {"This tool won't help if you've been refused a mortgage. See "}
              <Link
                href={`https://www.moneyhelper.org.uk/${lang}/homes/buying-a-home/why-mortgage-applications-are-declined`}
                target={isEmbed ? '_blank' : '_top'}
                asInlineText={true}
              >
                {
                  'Why mortgage applications are declined and what to do next instead'
                }
              </Link>
              .
            </span>
          ),
          cy: '',
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: "We will ask a few simple questions that will help us understand what you may need to do to fix things. You won't need any documents or extra information.",
          cy: '',
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: "Your answers will be confidential. We don't store or share them with anyone else.",
          cy: '',
        })}
      </Paragraph>
    </>
  );
};

const CreditRejectionLanding = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();

  return (
    <Landing
      intro={z({
        en: "If you've been turned down for credit, like a loan, overdraft or credit card, this tool will give you an action plan to improve your chances of being accepted.",
        cy: '',
      })}
      timeToComplete={z({
        en: '2 minutes to complete',
        cy: '',
      })}
      content={<LandingContent lang={lang} isEmbed={isEmbed} />}
      actionLink={`/${lang}/credit-rejection/question-1${addEmbedQuery(
        !!isEmbed,
        '?',
      )}`}
      actionText={z({
        en: 'Start now',
        cy: '',
      })}
      additionalInformation={z({
        en: (
          <span>
            <b>{"If you're dealing with problem debt"}</b>
            {
              ', get help as soon as possible. You can find free debt advice using our '
            }
            <Link
              href={`https://www.moneyhelper.org.uk/${lang}/money-troubles/dealing-with-debt/debt-advice-locator`}
              target={isEmbed ? '_blank' : '_top'}
              asInlineText={true}
            >
              Debt advice locator tool
            </Link>
          </span>
        ),
        cy: '',
      })}
    />
  );
};

export default CreditRejectionLanding;
