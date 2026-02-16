import { GetServerSideProps } from 'next';

import { DebtAdvisorDetailsCard } from 'components/DebtAdvisorDetailsCard/DebtAdvisorDetailsCard';
import { debtAdviceLocatorAnalytics } from 'data/form-content/analytics';
import { content } from 'data/refer-type';
import {
  getLocalData,
  getProviders,
  ProviderType,
} from 'utils/getOrgData/getData';

import { BackLink } from '@maps-react/common/components/BackLink';
import { H1 } from '@maps-react/common/components/Heading';
import { Analytics } from '@maps-react/core/components/Analytics';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import DebtAdviceLocator, { getServerSidePropsData } from '.';
import data from '../../public/json/organisations-tel-online.json';

type Props = {
  links: ToolLinks;
  lang: string;
  storedData: DataFromQuery;
  providers: ProviderType[];
  isEmbed: boolean;
};

const AdviceOnline = ({
  links,
  lang,
  providers,
  storedData,
  isEmbed,
}: Props) => {
  const { z } = useTranslation();

  const { title, intro } = content(z, links.question.goToQuestionThree)[
    storedData['q-3']
  ];
  const type = storedData['q-3'] === '0' ? 'online' : 'telephone';

  return (
    <DebtAdviceLocator step={type} isEmbed={isEmbed}>
      <Analytics
        analyticsData={debtAdviceLocatorAnalytics(z, type)}
        currentStep={type}
        formData={storedData}
        lastStep={type}
        trackDefaults={{
          pageLoad: true,
          toolStartRestart: false,
          toolCompletion: true,
          errorMessage: false,
          emptyToolCompletion: false,
        }}
      >
        <Container className="lg:container-auto">
          <BackLink href={links.question.goToQuestionThree}>
            {z({
              en: 'Back',
              cy: 'Yn ôl',
            })}
          </BackLink>
          <div className="max-w-[840px]">
            <H1 className="mt-8 mb-10 text-gray-800">{title}</H1>
            <div className="mt-6">{intro}</div>
            {providers.map((provider: ProviderType) => (
              <DebtAdvisorDetailsCard
                key={provider.name}
                provider={provider}
                lang={lang}
                attributes={{
                  showAddress: storedData['q-3'] !== '1',
                  showPhone: storedData['q-3'] !== '0',
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

export default AdviceOnline;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const defaultProps = await getServerSidePropsData(params, query);
  const providers = await getLocalData(data);
  const allProviders = await getProviders(providers);

  const providersFiltered = allProviders.filterByCountryAndType(
    defaultProps.props.storedData['q-1'] ?? '',
    defaultProps.props.storedData['q-3'] ?? '',
  );

  return {
    props: {
      ...defaultProps.props,
      providers: providersFiltered,
    },
  };
};
