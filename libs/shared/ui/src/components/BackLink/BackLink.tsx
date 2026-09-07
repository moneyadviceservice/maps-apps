import { Icon, IconType } from '../Icon';
import { Link, type LinkComponentProps } from '../Link';

export type BackLinkProps = Pick<
  LinkComponentProps,
  'href' | 'title' | 'target' | 'rel' | 'scroll' | 'onClick'
> &
  Required<Pick<LinkComponentProps, 'children'>>;

export const BackLink = ({
  href,
  children,
  title,
  target,
  rel,
  scroll,
  onClick,
}: BackLinkProps) => {
  return (
    <Link
      href={href}
      title={title}
      data-testid="tool-nav-prev"
      target={target}
      rel={rel}
      scroll={scroll}
      onClick={onClick}
      className="inline-flex items-center"
    >
      <Icon
        type={IconType.CHEVRON_LEFT}
        className="w-[8px] h-[15px]"
        aria-hidden="true"
      />
      <span>{children}</span>
    </Link>
  );
};
