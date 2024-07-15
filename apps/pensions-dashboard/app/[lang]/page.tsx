import { Metadata, NextPage } from 'next';
import { headers } from 'next/headers';
import { PensionsDashboardLayout } from '../../layouts/PensionsDashboardLayout';
import { PROTOCOL, SITE_TITLE } from '../../utils/constants';
import { Container } from '@maps-digital/ui/components/Container';
import { Heading } from '@maps-digital/ui/components/Heading';
import { Link } from '@maps-digital/ui/components/Link';
import { ListElement } from '@maps-digital/ui/components/ListElement';
import { Paragraph } from '@maps-digital/ui/components/Paragraph';

const title = SITE_TITLE;

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title,
  };
};

const Page: NextPage = async () => {
  const host = headers().get('host');

  return (
    <PensionsDashboardLayout showCommonLinks={true}>
      <div className="relative left-1/2 right-1/2 w-screen -ml-half-screen -mr-half-screen bg-gray-200">
        <Container className="py-12">
          <Heading level="h1" className="mb-8 text-blue-800">
            {title}
          </Heading>
          <Paragraph className="text-xl lg:w-2/3 xl:1/2">
            Find your lost pensions, including the state pension, with our free
            and secure government-backed service.
          </Paragraph>
        </Container>
      </div>
      <div className="py-24 lg:w-2/3">
        <Heading level="h3" className="text-[#c82a87] mt-8 mb-4">
          You can :
        </Heading>

        <ListElement
          items={[
            'search for your pensions',
            'find lost pensions',
            'view all your pensions together, including your state pension',
            'find out the value of your pensions now, and the income you may get in retirement',
          ]}
          variant="unordered"
          color="magenta"
          className="ml-8"
        />

        <Heading level="h3" className="text-[#c82a87] mt-8 mb-4">
          How it works
        </Heading>

        <Paragraph className="font-bold mb-0">
          1. Confirm your identity with GOV.UK One Login.
        </Paragraph>
        <Paragraph>
          We make sure it&apos;s really you by using GOV.UK One Login, a
          government service that keeps things safe and secure. Just sign up or
          log in if you already have an account.
        </Paragraph>
        <Paragraph className="font-bold mb-0">
          2. Provide your National Insurance number so we can find your
          pensions.
        </Paragraph>
        <Paragraph>
          Some information will be automatically entered from the GOV.UK One
          Login account, but we would also like you to enter your National
          Insurance number if you have one to make sure we find more of your
          pensions.
        </Paragraph>
        <Paragraph className="font-bold mb-0">
          3. We find your pensions.
        </Paragraph>
        <Paragraph>
          See all your pensions in one place on a dashboard, even ones you might
          not be aware of. If you&apos;re unsure, we&apos;ll guide you on how to
          check with the provider.
        </Paragraph>

        <Link
          href={`${process.env.MHPD_CDA_EMULATOR}?redirect_uri=${PROTOCOL}${host}/en/loading`}
          className="mt-12 px-3 py-2 w-72 font-semibold rounded outline-none !no-underline shadow-bottom-gray inline-flex justify-center bg-[#c82a87] !text-white hover:bg-[#ae0060]"
        >
          Start
        </Link>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;
