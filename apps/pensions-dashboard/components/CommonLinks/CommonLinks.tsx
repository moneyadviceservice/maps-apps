import { Link } from '@maps-react/common/components/Link';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Container } from '@maps-react/core/components/Container';

type CommonLinksProps = {
  title: string;
  links: {
    title: string;
    href: string;
    icon?: IconType;
  }[];
};

export const CommonLinks = ({ title, links }: CommonLinksProps) => (
  <div className="border-t-1 py-16">
    <Container className="">
      <Heading level="h2" className="mb-4">
        {title}
      </Heading>
      <ul className="[&>*:last-child]:border-b-1">
        {links.map(({ title, href, icon }) => (
          <li key={title} className="py-2 border-t-1 border-slate-400">
            <Link href={href} className="text-base text-slate-600">
              {icon && <Icon type={icon} />}
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  </div>
);
