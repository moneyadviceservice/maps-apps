import { ReactNode } from 'react';
import '@maps-react/common/styles/globals.scss';

export type BasePageLayoutProps = {
  children: ReactNode;
};

export const BasePageLayout = ({ children }: BasePageLayoutProps) => children;
