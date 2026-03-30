import { ReactNode } from 'react';

import { GetServerSideProps } from 'next';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const backLinkElement = (router: AppRouterInstance, backLink?: string) => {
  if (backLink) {
    return <BackLink href={backLink}>Back</BackLink>;
  } else {
    return (
      <div className="flex items-center text-magenta-500 group">
        <Icon
          type={IconType.CHEVRON_LEFT}
          className="text-magenta-500 group-hover:text-pink-800 w-[8px] h-[15px]"
          aria-hidden="true"
        />
        <Button
          variant="link"
          className="underline tool-nav-prev group-hover:cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          Back
        </Button>
      </div>
    );
  }
};

type Props = {
  browserTitle: string;
  backLink?: string;
  displayBacklink?: boolean;
  heading: string;
  showLanguageSwitcher?: boolean;
  topInfoSection?: ReactNode;
  errorSummarySection?: ReactNode;
  children: ReactNode;
};

export const TravelInsuranceDirectory = ({
  browserTitle,
  backLink,
  displayBacklink = true,
  heading,
  showLanguageSwitcher = true,
  topInfoSection,
  errorSummarySection,
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const router = useRouter();
  const title = appTitle(z);

  return (
    <ToolPageLayout
      pageTitle={pageTitle(browserTitle, z)}
      title={title}
      titleTag={'span'}
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
      showLanguageSwitcher={showLanguageSwitcher}
      topInfoSection={topInfoSection}
    >
      <Container>
        <div className="lg:max-w-[980px] space-y-8">
          {displayBacklink && backLinkElement(router, backLink)}

          {errorSummarySection}
          <Heading level="h1">{heading}</Heading>
          {children}
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export default TravelInsuranceDirectory;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: `/en`,
      permanent: false,
    },
  };
};

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
}) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  return {
    props: {
      lang,
    },
  };
};
