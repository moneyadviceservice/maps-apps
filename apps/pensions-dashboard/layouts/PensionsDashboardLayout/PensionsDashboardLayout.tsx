import { twMerge } from 'tailwind-merge';
import { CommonLinks } from '../../components/CommonLinks';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Breadcrumb, Crumb } from '@maps-digital/ui/components/Breadcrumb';
import { Container } from '@maps-digital/ui/components/Container';
import { Heading } from '@maps-digital/ui/components/Heading';

export type PensionsDashboardLayoutProps = {
  title?: string;
  breadcrumb?: Crumb[];
  showCommonLinks?: boolean;
  children: React.ReactNode;
};

export const PensionsDashboardLayout = ({
  title,
  breadcrumb,
  showCommonLinks = false,
  children,
}: PensionsDashboardLayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Container className="mt-16">
        {breadcrumb && (
          <div className="ml-[-1rem]">
            <Breadcrumb crumbs={breadcrumb} />
          </div>
        )}
        {title && (
          <Heading
            level="h1"
            className={twMerge('mb-6 text-blue-800', breadcrumb && 'mt-8')}
          >
            {title}
          </Heading>
        )}
      </Container>

      <main className="flex-grow mb-16">
        <Container>{children}</Container>
      </main>

      {showCommonLinks && <CommonLinks />}

      <Footer />
    </div>
  );
};
