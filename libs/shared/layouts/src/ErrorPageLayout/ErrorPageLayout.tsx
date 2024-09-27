import { Heading } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '../EmbedPageLayout';
import { ToolPageLayout } from '../ToolPageLayout';

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
        cy: `Mae'n ddrwg gennym ni allem ddod o hyd i'r dudalen rydych yn chwilio amdani`,
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
                cy: `Efallai nad yw'n bodoli mwyach, neu roedd y ddolen yn cynnwys gwall.`,
              })}
            </p>
          </div>
          <div className="py-7">
            <Heading fontWeight="semi-bold" level="h3" component="h2">
              {z({
                en: 'What you can do',
                cy: 'Beth allwch chi ei wneud',
              })}
            </Heading>
          </div>
          <div>
            <ul className="list-disc pl-10 space-y-1">
              <li>
                {z({
                  en: "If you typed the URL in the address bar, check it's correct.",
                  cy: `Os ydych wedi teipio'r URL yn y bar cyfeiriad, gwiriwch ei fod yn gywir.`,
                })}
              </li>
              <li>
                {z({
                  en: 'You can also ',
                  cy: 'Gallwch hefyd ',
                })}
                <a
                  href={z({
                    en: 'https://www.moneyhelper.org.uk/en',
                    cy: 'https://www.moneyhelper.org.uk/cy',
                  })}
                  className="underline text-purple-500"
                >
                  {z({
                    en: 'browse from our homepage ',
                    cy: 'bori ein hafan ',
                  })}
                </a>
                {z({
                  en: 'for the information you need.',
                  cy: 'am y wybodaeth sydd ei hangen arnoch.',
                })}
              </li>
              <li>
                {z({
                  en: "Try clicking the Back button in your browser to check if you're in the right place.",
                  cy: 'Ceisiwch glicio ar y botwm Yn ôl yn eich porwr i wirio a ydych yn y lle iawn.',
                })}
              </li>
              <li>
                {z({
                  en: 'Or use the search box, above, to find what you were looking for.',
                  cy: `Neu defnyddiwch y blwch chwilio, uchod, i ddod o hyd i'r hyn roeddech yn chwilio amdano.`,
                })}
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};
