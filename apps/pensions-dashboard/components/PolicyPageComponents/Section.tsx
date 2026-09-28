import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

type SectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export const Section = ({ id, title, children }: SectionProps) => {
  const { t } = useTranslation();
  return (
    <section
      data-testid={`section${id}`}
      id={`section${id}`}
      className="mb-10 focus-visible:outline-none"
    >
      <Heading
        data-testid={`section-heading${id}`}
        level="h2"
        color="text-blue-700 mb-4 md:mb-12 md:text-5xl flex"
      >
        <span className="mr-2 md:mr-6">{id}.</span> <span>{title}</span>
      </Heading>
      {children}
      <Link
        data-testid={`section-back-to-top${id}`}
        className="mt-6 text-base"
        href="#quick-links"
      >
        {t('site.back-to-top')}
        <Icon type={IconType.ARROW_UP} className="mt-[2px]" />
      </Link>
    </section>
  );
};
