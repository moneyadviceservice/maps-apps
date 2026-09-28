import React, { ReactNode } from 'react';

type VisibleSectionProps = {
  visible: boolean;
  children: ReactNode;
};

export const VisibleSection: React.FC<VisibleSectionProps> = ({
  visible,
  children,
}) => {
  if (!visible) return null;
  return <>{children}</>;
};
