import { H2 } from '@maps-react/common/components/Heading';

type PensionDetailHeadingProps = {
  title: string;
};

export const PensionDetailHeading = ({ title }: PensionDetailHeadingProps) => {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-4">
      <div className="lg:col-span-8 2xl:col-span-7">
        <H2
          data-testid="heading"
          className="mt-2 md:text-5xl"
          id="details-heading"
          tabIndex={-1}
        >
          {title}
        </H2>
      </div>
    </div>
  );
};
