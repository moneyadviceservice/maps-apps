import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const StatePensionEligibilitySGR7 = () => {
  const { t } = useTranslation();

  return (
    <ExpandableSection
      title={t('results.staticGuidance.statePensionEligibilitySGR7.title')}
      variant="mainLeftIcon"
      className="border-b-1"
      testId="state-pension-eligibility-sgr7-section"
      contentId="state-pension-eligibility-sgr7-content"
    >
      <Markdown
        content={t(
          'results.staticGuidance.statePensionEligibilitySGR7.paragraph1',
        )}
        withIcon={false}
      />
      <Markdown
        content={t(
          'results.staticGuidance.statePensionEligibilitySGR7.paragraph2',
        )}
        withIcon={false}
      />
      <Markdown
        content={t(
          'results.staticGuidance.statePensionEligibilitySGR7.paragraph3',
        )}
      />
      <ul className="mb-4 ml-6 list-disc">
        <li className="mt-1 mb-1">
          <div className="[&_p]:my-0">
            <Markdown
              content={t(
                'results.staticGuidance.statePensionEligibilitySGR7.list1',
              )}
              withIcon={false}
            />
          </div>
        </li>
        <li className="mt-1 mb-1">
          <div className="[&_p]:my-0">
            <Markdown
              content={t(
                'results.staticGuidance.statePensionEligibilitySGR7.list2',
              )}
              withIcon={false}
            />
          </div>
        </li>
      </ul>
      <Markdown
        content={t(
          'results.staticGuidance.statePensionEligibilitySGR7.paragraph4',
        )}
      />
      <Markdown
        content={t(
          'results.staticGuidance.statePensionEligibilitySGR7.paragraph5',
        )}
      />
      <Markdown
        content={t(
          'results.staticGuidance.statePensionEligibilitySGR7.paragraph6',
        )}
        withIcon={false}
      />
    </ExpandableSection>
  );
};
