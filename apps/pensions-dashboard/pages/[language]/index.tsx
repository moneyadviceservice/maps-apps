import { NextPage } from 'next';
import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PensionsDashboardLayout } from '../../layouts/PensionsDashboardLayout';
import { Markdown } from '@maps-react/vendor/components/Markdown';

const Page: NextPage = () => {
  const { t, locale } = useTranslation();

  const howItWorksItems = [
    t('pages.start.section-how-it-works.step-1'),
    t('pages.start.section-how-it-works.step-2'),
    t('pages.start.section-how-it-works.step-3'),
    t('pages.start.section-how-it-works.step-4'),
  ].map((item, index) => <Markdown key={index} content={item} />);

  return (
    <PensionsDashboardLayout showCommonLinks={true}>
      <div className="relative w-screen bg-gray-200 left-1/2 right-1/2 -ml-half-screen -mr-half-screen">
        <Container className="py-12">
          <Heading level="h1" className="mb-8 text-blue-800">
            {t('site.title')}
          </Heading>
          <Paragraph className="mt-12 text-xl lg:w-2/3 xl:1/2">
            {t('pages.start.hero-text')}
          </Paragraph>
        </Container>
      </div>

      <div className="py-24 lg:w-2/3">
        <Heading level="h3" className="text-[#c82a87] mt-8 mb-4">
          {t('pages.start.section-you-can.title')}
        </Heading>

        <ListElement
          items={[
            t('pages.start.section-you-can.item-1'),
            t('pages.start.section-you-can.item-2'),
          ]}
          variant="unordered"
          color="dark"
          className="ml-8"
        />

        <Heading level="h3" className="text-[#c82a87] mt-8 mb-4">
          {t('pages.start.section-how-it-works.title')}
        </Heading>

        <ListElement
          items={howItWorksItems}
          variant="ordered"
          color="dark"
          className="ml-8"
        />

        <Heading level="h3" className="text-[#c82a87] mt-8 mb-4">
          {t('pages.start.section-you-need.title')}
        </Heading>

        <ListElement
          items={[
            t('pages.start.section-you-need.item-1'),
            t('pages.start.section-you-need.item-2'),
            t('pages.start.section-you-need.item-3'),
          ]}
          variant="unordered"
          color="dark"
          className="ml-8"
        />

        <form action="/api/post-redirect" method="POST">
          <input type="hidden" name="lang" value={locale} />
          <Button variant="primary" type="submit" className="mt-12 w-72">
            {t('pages.start.form-button')}
          </Button>
        </form>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;
