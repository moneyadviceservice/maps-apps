import { ReactNode } from 'react';

import { Heading } from '@maps-react/common/components/Heading';

import { Nav } from '../Nav';

import '@maps-react/common/styles/globals.scss';

export type BasePageLayoutProps = {
  children: ReactNode;
  title: string;
  isComposer?: boolean;
};

export const BasePageLayout = ({
  children,
  title,
  isComposer = false,
}: BasePageLayoutProps) => {
  return (
    <>
      <Heading
        level="h1"
        className="px-4 py-6 mb-12 xl:p-12 xl:py-10 bg-gray-95"
        data-testid="base-page-layout-title"
      >
        {title}
      </Heading>
      {isComposer ? <Nav /> : null}
      <main
        id="main"
        className="p-4 pt-0 text-gray-800 test-base xl:p-12 xl:pt-0"
      >
        {children}
      </main>
    </>
  );
};
