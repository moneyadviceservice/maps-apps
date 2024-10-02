import { NextPage } from 'next';
import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { PensionsDashboardLayout } from '../../layouts/PensionsDashboardLayout';
import { SITE_TITLE } from '../../lib/constants';

const Page: NextPage = () => {
  return (
    <PensionsDashboardLayout showCommonLinks={true}>
      <div className="left-1/2 right-1/2 -ml-half-screen -mr-half-screen relative w-screen bg-gray-200">
        <Container className="py-12">
          <Heading level="h1" className="mb-8 text-blue-800">
            {SITE_TITLE}
          </Heading>
          <Paragraph className="lg:w-2/3 xl:1/2 text-xl">
            Find your lost pensions, including the state pension, with our free
            and secure government-backed service.
          </Paragraph>
        </Container>
      </div>

      <div className="lg:w-2/3 py-24">
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

        <Paragraph className="mb-0 font-bold">
          1. Confirm your identity with GOV.UK One Login.
        </Paragraph>
        <Paragraph>
          We make sure it&apos;s really you by using GOV.UK One Login, a
          government service that keeps things safe and secure. Just sign up or
          log in if you already have an account.
        </Paragraph>
        <Paragraph className="mb-0 font-bold">
          2. Provide your National Insurance number so we can find your
          pensions.
        </Paragraph>
        <Paragraph>
          Some information will be automatically entered from the GOV.UK One
          Login account, but we would also like you to enter your National
          Insurance number if you have one to make sure we find more of your
          pensions.
        </Paragraph>
        <Paragraph className="mb-0 font-bold">
          3. We find your pensions.
        </Paragraph>
        <Paragraph>
          See all your pensions in one place on a dashboard, even ones you might
          not be aware of. If you&apos;re unsure, we&apos;ll guide you on how to
          check with the provider.
        </Paragraph>

        <form action="/api/post-redirect" method="POST">
          <Button variant="primary" type="submit" className="w-72 mt-12">
            Start
          </Button>
        </form>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;
