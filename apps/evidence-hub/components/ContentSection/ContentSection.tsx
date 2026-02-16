import { ReactNode } from 'react';

import { BackToTop } from 'components/BackToTop';

import { Heading } from '@maps-react/common/components/Heading';

type Props = {
  heading: string;
  content: ReactNode;
};

export const ContentSection = ({ heading, content }: Props) => {
  const anchorLink = heading.toLowerCase().replaceAll(' ', '-');

  return (
    <div className="mb-8" id={anchorLink} data-testid="content-section">
      <Heading level={'h2'} component={'h2'} className="mb-4">
        {heading}
      </Heading>
      <div className="mb-4">{content}</div>
      <div className="flex justify-start justify-items-start">
        <BackToTop />
      </div>
    </div>
  );
};
