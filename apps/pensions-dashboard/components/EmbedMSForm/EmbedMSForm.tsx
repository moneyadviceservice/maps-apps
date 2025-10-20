import { twMerge } from 'tailwind-merge';

import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';

type Props = {
  src: string;
  title: string;
  testId?: string;
  id?: string;
  classNames?: string;
  minHeight?: number;
};

export const EmbedMSForm = ({
  src,
  title,
  testId = 'embedded-ms-form',
  id = 'embedded-ms-form',
  classNames,
  minHeight = 400,
}: Props) => {
  return (
    <EmbedPageLayout>
      <iframe
        src={src}
        title={title}
        data-testid={testId}
        id={id}
        loading="lazy"
        className={twMerge('w-full border-0', classNames)}
        style={{ minHeight: `${minHeight}px` }}
      />
    </EmbedPageLayout>
  );
};
