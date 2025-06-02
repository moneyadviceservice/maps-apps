import { twMerge } from 'tailwind-merge';

type Props = {
  src: string;
  title: string;
  testId?: string;
  id?: string;
  classNames?: string;
};

export const EmbedMSForm = ({
  src,
  title,
  testId = 'embedded-ms-form',
  id = 'emebedded-ms-form',
  classNames,
}: Props) => {
  return (
    <iframe
      src={src + '&embed=true'}
      title={title}
      data-testid={testId}
      id={id}
      className={twMerge('w-full', classNames)}
    />
  );
};
