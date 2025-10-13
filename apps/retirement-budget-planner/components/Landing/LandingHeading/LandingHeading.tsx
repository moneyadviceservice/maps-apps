import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export const LandingHeading = ({ nextPageLink }: { nextPageLink: string }) => {
  return (
    <section data-testid="landing-heading">
      <Heading level="h1" variant="secondary" className="text-[38px] mb-8 mt-2">
        Retirement budget planner
      </Heading>
      <Paragraph variant="secondary" className="text-xl">
        Find out how much money you might need for a comfortable retirement with
        our free online tool.
      </Paragraph>
      <Link
        data-testid="rbp-link-from-heading"
        className="my-4"
        asButtonVariant="primary"
        id="submit"
        href={nextPageLink}
      >
        Start Retirement Budget Planner
      </Link>
    </section>
  );
};
