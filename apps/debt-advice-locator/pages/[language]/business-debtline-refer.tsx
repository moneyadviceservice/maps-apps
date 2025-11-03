import { DebtAdvisorDetailsCard } from 'components/DebtAdvisorDetailsCard/DebtAdvisorDetailsCard';
import { content, filterBusinessByCountry } from 'data/business-refer';
import { debtAdviceLocatorAnalytics } from 'data/form-content/analytics';
import { ProviderType } from 'utils/getOrgData/getData';
import { ToolLinks } from 'utils/getToolLinks';

import { BackLink } from '@maps-react/common/components/BackLink';
import { H1 } from '@maps-react/common/components/Heading';
import { Analytics } from '@maps-react/core/components/Analytics';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import DebtAdviceLocator, { getServerSidePropsDefault } from '.';

type Props = {
  links: ToolLinks;
  lang: string;
  storedData: DataFromQuery;
  isEmbed: boolean;
};

const BusinessDebtRef = ({ links, lang, storedData, isEmbed }: Props) => {
  const { z } = useTranslation();
  const { title, intro } = content(z);
  const businessProviders = filterBusinessByCountry(storedData['q-1'] ?? '', z);

  return (
    <DebtAdviceLocator step={'business'} isEmbed={isEmbed}>
      <Analytics
        analyticsData={debtAdviceLocatorAnalytics(z, 'business')}
        currentStep={'business'}
        lastStep={'business'}
        formData={storedData}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: false,
          toolCompletion: true,
          errorMessage: false,
          emptyToolCompletion: false,
        }}
      >
        <Container className="lg:container-auto">
          <BackLink href={links.question.goToQuestionTwo}>
            {z({
              en: 'Back',
              cy: 'Yn ôl',
            })}
          </BackLink>
          <div className="max-w-[840px]">
            <H1 className="mt-8 mb-10 text-gray-800">{title}</H1>
            <div className="mt-6">{intro}</div>
            {businessProviders.map((provider: ProviderType) => (
              <DebtAdvisorDetailsCard
                key={provider.name}
                provider={provider}
                lang={lang}
                attributes={{
                  showAddress: true,
                  showPhone: true,
                  showWebsite: true,
                }}
              />
            ))}
          </div>
        </Container>
      </Analytics>
    </DebtAdviceLocator>
  );
};

export default BusinessDebtRef;

export const getServerSideProps = getServerSidePropsDefault;
