import { Heading } from '../../components/Heading';
import { Container } from '../../components/Container';
import { EmbedPageLayout } from '../../layouts/EmbedPageLayout';
import { ToolPageLayout } from '../../layouts/ToolPageLayout';
import { useTranslation } from '@maps-digital/shared/hooks';

export type ErrorPageLayoutProps = {
  isEmbedded: boolean;
};

export const ErrorPageLayout = ({ isEmbedded }: ErrorPageLayoutProps) => {
  const { z } = useTranslation();

  const PageWrapper: typeof EmbedPageLayout | typeof ToolPageLayout = isEmbedded
    ? EmbedPageLayout
    : ToolPageLayout;

  return (
    <PageWrapper
      title={z({
        en: "Sorry we couldn't find the page you're looking for",
        cy: 'TBC',
      })}
      breadcrumbs={
        !isEmbedded
          ? [
              {
                label: z({ en: 'Home', cy: 'Hafan' }),
                link: z({
                  en: 'https://www.moneyhelper.org.uk/en',
                  cy: 'https://www.moneyhelper.org.uk/cy',
                }),
              },
            ]
          : undefined
      }
    >
      <Container>
        <div className="flex flex-col justify-start text-left">
          <div>
            <p>
              {z({
                en: 'It may no longer exist, or the link contained an error',
                cy: 'TBC',
              })}
            </p>
          </div>
          <div className="py-7">
            <Heading fontWeight="semi-bold" level="h3" component="h2">
              {z({
                en: 'What you can do',
                cy: 'TBC',
              })}
            </Heading>
          </div>
          <div>
            <ul className="list-disc pl-10 space-y-1">
              <li>
                {z({
                  en: "If you typed the URL in the addrerss bar, check it's correct.",
                  cy: 'TBC',
                })}
              </li>
              <li>
                {z({
                  en: 'You can also ',
                  cy: 'TBC',
                })}
                <a
                  href="https://www.moneyhelper.org.uk/en"
                  className="underline text-purple-500"
                >
                  {z({
                    en: 'browse from our homepage ',
                    cy: 'TBC',
                  })}
                </a>
                {z({
                  en: 'for the information you need.',
                  cy: 'TBC',
                })}
              </li>
              <li>
                {z({
                  en: "Try clicking the Back button in your browser to check if you're in the right place.",
                  cy: 'TBC',
                })}
              </li>
              <li>
                {z({
                  en: 'Or use the search box, above, to find what you were looking for.',
                  cy: 'TBC',
                })}
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};
