import { BasePageLayout } from '@maps-digital/ui/layouts/BasePageLayout';

export const dynamic = 'force-dynamic';

export const metadata = {
  icons: {
    icon: ['/icons/favicon-16x16.png', '/icons/favicon-32x32.png'],
    apple: ['/icons/apple-touch-icon-180x180.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <BasePageLayout>{children}</BasePageLayout>
      </body>
    </html>
  );
}
