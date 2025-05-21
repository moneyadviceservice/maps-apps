import { BabyCostsAnalytics } from 'components/Analytics/BabyCostsAnalytics';
import { saveAndContinuePageContent as content } from 'data/baby-costs-calculator/save-content';
import { ParsedUrlQuery } from 'querystring';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormData } from '@maps-react/pension-tools/types/forms';

import {
  BabyCostCalculator,
  Errors as ErrorType,
  getServerSidePropsDefault,
  HiddenFields,
} from '.';

export interface SaveDataProps {
  isEmbed: boolean;
  query: ParsedUrlQuery;
  toolBaseUrl: string;
  lang: string;
  formData: FormData;
  currentTab: number;
}

export const Save = ({
  isEmbed,
  query,
  toolBaseUrl,
  lang,
  formData,
  currentTab,
}: SaveDataProps) => {
  const { z } = useTranslation();

  const lastTab = query['tab'];
  const isSaved = query['saved'];
  const error = query['error'];
  let emailErrors: ErrorType = null;
  let analyticsError;

  const { z: enTranslation } = useTranslation('en');
  if (error) {
    if (error === 'email') {
      emailErrors = { email: [z(content.emailErrorMessage)] };
      analyticsError = enTranslation(content.emailErrorMessage);
    } else if (error === 'save-api') {
      emailErrors = { email: [z(content.apiSaveErrorMessage)] };
      analyticsError = enTranslation(content.apiSaveErrorMessage);
    }
  }

  return (
    <BabyCostCalculator step="save" isEmbed={isEmbed} errors={emailErrors}>
      <BabyCostsAnalytics
        currentTab={isSaved ? 'saved' : 'save'}
        formData={formData}
        error={analyticsError}
      >
        <Container className="pt-8">
          <div className="max-w-[840px] mb-16">
            <Link
              href={{
                pathname: `${toolBaseUrl}${lastTab || 1}`,
                query: query,
              }}
            >
              <Icon type={IconType.CHEVRON_LEFT} />
              {z({ en: 'Back', cy: 'Yn ôl' })}
            </Link>

            <H1 className="my-8">
              {isSaved ? z(content.savedTitle) : z(content.title)}
            </H1>
            <p className="mb-8">
              {isSaved ? z(content.savedSubHeading) : z(content.subHeading)}
            </p>
            {isSaved ? (
              <Link
                href={{
                  pathname: `${toolBaseUrl}${lastTab || 1}`,
                  query: query,
                }}
                asButtonVariant="primary"
              >
                {z({
                  en: 'Continue baby costs calculator now',
                  cy: 'Parhau i gweithiwch allan eich Cyllideb Babi',
                })}
              </Link>
            ) : (
              <form
                method="POST"
                noValidate
                className="mb-8 space-y-6 max-w-[495px]"
              >
                <HiddenFields
                  isEmbed={isEmbed}
                  lang={lang}
                  toolBaseUrl={toolBaseUrl}
                  currentTab={currentTab}
                  formData={formData}
                />

                <Errors errors={emailErrors?.['email'] ?? []}>
                  <label className="block mb-1 text-lg" htmlFor="email">
                    {z(content.inputLabel)}
                  </label>
                  <p id="email-hint" className="mb-1 text-gray-400">
                    {z(content.inputHint)}
                  </p>
                  {emailErrors && (
                    <p id="email" className="mb-1 text-red-700">
                      Error: {emailErrors['email']}
                    </p>
                  )}

                  <input
                    className={`${
                      emailErrors ? 'border-red-700' : 'border-gray-400'
                    } border rounded focus:outline-purple-700 focus:shadow-focus-outline h-10 m-px mt-1 px-3 w-full md:w-80`}
                    id="email"
                    name="email"
                    type="email"
                    aria-describedby={`email-hint ${
                      emailErrors ? 'email-error' : ''
                    }`}
                  />
                </Errors>

                <Button
                  className="w-full mt-8 md:w-auto"
                  formAction={content.action}
                  data-testid="save-and-return"
                >
                  {z({
                    en: 'Save and send email',
                    cy: 'Arbed ac anfon e-bost',
                  })}
                </Button>
              </form>
            )}
          </div>
        </Container>
      </BabyCostsAnalytics>
    </BabyCostCalculator>
  );
};

export default Save;

export const getServerSideProps = getServerSidePropsDefault;
