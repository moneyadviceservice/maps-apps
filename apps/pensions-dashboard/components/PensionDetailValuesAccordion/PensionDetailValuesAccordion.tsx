import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type PensionDetailValuesAccordionProps = {
  contentKey: 'summary' | 'income-and-values';
  className?: string;
  testId?: string;
};

export const PensionDetailValuesAccordion = ({
  contentKey,
  className,
  testId = `pension-detail-values-accordion-${contentKey}`,
}: PensionDetailValuesAccordionProps) => {
  const { t, tList } = useTranslation();
  const content = tList(
    `pages.pension-details.value-illustration-date.${contentKey}.content`,
  );

  return (
    <ExpandableSection
      variant="hyperlink"
      title={t(
        `pages.pension-details.value-illustration-date.${contentKey}.title`,
      )}
      contentTestClassName="leading-[1.6]"
      className={twMerge('mb-6', className)}
      testId={testId}
    >
      {content.map((item: string, index: number) => (
        <Markdown key={index} content={item} />
      ))}
    </ExpandableSection>
  );
};
