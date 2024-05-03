import { ReactNode } from 'react';
import '../../styles/globals.scss';

export type BasePageLayoutProps = {
  children: ReactNode;
};

export const BasePageLayout = ({ children }: BasePageLayoutProps) => children;
