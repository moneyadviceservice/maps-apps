import { Link } from '../Link';
import { Icon, IconType } from '../Icon';
import { useTranslation } from '@maps-digital/shared/hooks';

type HrefProps = {
  pathname: string;
  query?: Record<string, string> | string;
};

export type SaveReturnLinkProps = {
  href: HrefProps;
  className?: string;
  testId?: string;
};

export const SaveReturnLink = ({
  href,
  className,
  testId = 'save-and-return',
}: SaveReturnLinkProps) => {
  const { z } = useTranslation();

  return (
    <Link className={className} href={href} data-testid={testId}>
      <Icon type={IconType.BOOKMARK} />{' '}
      {z({
        en: 'Save and come back later',
        cy: 'Arbedwch a dewch yn ôl wedyn',
      })}
    </Link>
  );
};
