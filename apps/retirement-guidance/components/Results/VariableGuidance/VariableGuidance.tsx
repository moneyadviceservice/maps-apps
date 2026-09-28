import { VisibleSection } from 'components/VisibleSection';
import {
  CONSOLIDATION_1_CONTENT,
  CONSOLIDATION_1A_CONTENT,
  CONSOLIDATION_1B_CONTENT,
  CONSOLIDATION_1C_CONTENT,
  DEBT_23_CONTENT,
  DEBT_23A_CONTENT,
  EMPLOYMENT_02_CONTENT,
  EMPLOYMENT_02A_CONTENT,
  EMPLOYMENT_02B_CONTENT,
  EMPLOYMENT_03_CONTENT,
  EMPLOYMENT_04_CONTENT,
  EMPLOYMENT_05_CONTENT,
  EMPLOYMENT_06_CONTENT,
  EMPLOYMENT_07_CONTENT,
  FIND_YOUR_PENSION_TYPE_22_CONTENT,
  HOUSING_09_CONTENT,
  HOUSING_09A_CONTENT,
  HOUSING_10_CONTENT,
  HOUSING_10A_CONTENT,
  HOUSING_11_CONTENT,
  HOUSING_12_CONTENT,
  HOUSING_12A_CONTENT,
  HOUSING_13_CONTENT,
  HOUSING_14_CONTENT,
  HOUSING_14A_CONTENT,
  HOUSING_14B_CONTENT,
  HOUSING_15_CONTENT,
  HOUSING_15A_CONTENT,
  HOUSING_16_CONTENT,
  HOUSING_16A_CONTENT,
  HOUSING_16B_CONTENT,
  HOW_MUCH_MONEY_NEEDED_FOR_RETIREMENT_25A_CONTENT,
  HOW_MUCH_MONEY_NEEDED_FOR_RETIREMENT_25B_CONTENT,
  HOW_TO_GROW_MY_PENSION_ALREADY_RETIRED_26_CONTENT,
  OVERSEAS_8_CONTENT,
  OVERSEAS_8A_CONTENT,
  OVERSEAS_8B_CONTENT,
  PRIMARY_GOAL_22A_CONTENT,
  PRIMARY_GOAL_HOW_MUCH_MONEY_NEEDED_FOR_RETIREMENT_25_CONTENT,
  WHEN_AND_HOW_CAN_I_TAKE_MY_PENSION_24_CONTENT,
  WHEN_AND_HOW_CAN_I_TAKE_MY_PENSION_24B_CONTENT,
  WHEN_AND_HOW_CAN_I_TAKE_MY_PENSION_24C_CONTENT,
  WHEN_AND_HOW_CAN_I_TAKE_MY_PENSION_ALREADY_RETIRED_24A_CONTENT,
} from 'data/variableGuidance';
import {
  getConsolidationOutcome,
  getDebtAdviceStatusFlags,
  getDivorceStatusFlags,
  getEmploymentOutcome,
  getHousingOutcome,
  getPensionOutcome,
  getPrimaryGoalOutcome,
} from 'lib/results';

import { Heading } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { Divorce17 } from './Divorce/Divorce17';
import { GuidanceSection } from './GuidanceSection';

type Props = {
  data: DataFromQuery;
};
export const VariableGuidance = ({ data }: Props) => {
  const { t } = useTranslation();

  const [hadDebtAdvice, hasNeverHadDebtAdvice] = getDebtAdviceStatusFlags(data);
  const { goingThroughDivorce } = getDivorceStatusFlags(data);

  const { showSection8a, showSection8b, showSection8 } =
    getPensionOutcome(data);

  const {
    showConsolidation1,
    showConsolidation1a,
    showConsolidation1b,
    showConsolidation1c,
    showFindYourPensionType22,
  } = getConsolidationOutcome(data);
  const {
    showEmployment02,
    showEmployment02a,
    showEmployment02b,
    showEmployment03,
    showEmployment04,
    showEmployment05,
    showEmployment06,
    showEmployment07,
  } = getEmploymentOutcome(data);
  const {
    showHousing09,
    showHousing09a,
    showHousing10,
    showHousing10a,
    showHousing11,
    showHousing12,
    showHousing12a,
    showHousing13,
    showHousing14,
    showHousing14a,
    showHousing14b,
    showHousing15,
    showHousing15a,
    showHousing16,
    showHousing16a,
    showHousing16b,
  } = getHousingOutcome(data);
  const {
    showPrimaryGoal22,
    showPrimaryGoal22a,
    showPrimaryGoal25,
    showPrimaryGoal25a,
    showPrimaryGoal25b,
    showPrimaryGoal24,
    showPrimaryGoal24a,
    showPrimaryGoal24b,
    showPrimaryGoal24c,
    showPrimaryGoal26,
  } = getPrimaryGoalOutcome(data);
  return (
    <div key="variable-guidance-intro" className="no-underline ">
      <Heading level="h3" variant="primary">
        {t('results.variableGuidance.heading')}
      </Heading>
      {/* Guidance sections Debt advice */}
      <VisibleSection visible={hadDebtAdvice}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.debt23a"
          testId="debt-23a-section"
          contentId="debt-23a-content"
          content={DEBT_23A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={hasNeverHadDebtAdvice}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.debt23"
          testId="debt-23-section"
          contentId="debt-23-content"
          content={DEBT_23_CONTENT}
        />
      </VisibleSection>
      {/* Guidance sections primary goal */}
      <VisibleSection visible={showPrimaryGoal22a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.howMyPensionWorks22a"
          testId="primary-goal-22a-section"
          contentId="primary-goal-22a-content"
          content={PRIMARY_GOAL_22A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showPrimaryGoal25}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.howMuchMoneyNeededForRetirement25"
          testId="primary-goal-25-section"
          contentId="primary-goal-25-content"
          content={PRIMARY_GOAL_HOW_MUCH_MONEY_NEEDED_FOR_RETIREMENT_25_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showPrimaryGoal25a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.howMuchMoneyNeededForRetirement25a"
          testId="primary-goal-25a-section"
          contentId="primary-goal-25a-content"
          content={HOW_MUCH_MONEY_NEEDED_FOR_RETIREMENT_25A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showPrimaryGoal25b}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.howMuchMoneyNeededForRetirement25b"
          testId="primary-goal-25b-section"
          contentId="primary-goal-25b-content"
          content={HOW_MUCH_MONEY_NEEDED_FOR_RETIREMENT_25B_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showPrimaryGoal24}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.whenAndHowCanITakeMyPension24"
          testId="primary-goal-24-section"
          contentId="primary-goal-24-content"
          content={WHEN_AND_HOW_CAN_I_TAKE_MY_PENSION_24_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showPrimaryGoal24b}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.whenAndHowCanITakeMyPension24b"
          testId="primary-goal-24b-section"
          contentId="primary-goal-24b-content"
          content={WHEN_AND_HOW_CAN_I_TAKE_MY_PENSION_24B_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showPrimaryGoal24c}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.whenAndHowCanITakeMyPension24c"
          testId="primary-goal-24c-section"
          contentId="primary-goal-24c-content"
          content={WHEN_AND_HOW_CAN_I_TAKE_MY_PENSION_24C_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showPrimaryGoal24a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.whenAndHowCanITakeMyPensionAlreadyRetired24a"
          testId="primary-goal-24a-section"
          contentId="primary-goal-24a-content"
          content={
            WHEN_AND_HOW_CAN_I_TAKE_MY_PENSION_ALREADY_RETIRED_24A_CONTENT
          }
        />
      </VisibleSection>
      <VisibleSection visible={showPrimaryGoal26}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.howToGrowMyPensionAlreadyRetired26"
          testId="primary-goal-26-section"
          contentId="primary-goal-26-content"
          content={HOW_TO_GROW_MY_PENSION_ALREADY_RETIRED_26_CONTENT}
        />
      </VisibleSection>
      {/* Guidance sections Divorce */}
      <VisibleSection visible={goingThroughDivorce}>
        <Divorce17 />
      </VisibleSection>
      {/* Common Guidance section consolidation and primary goal*/}
      <VisibleSection visible={showFindYourPensionType22 || showPrimaryGoal22}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.findYourPensionType22"
          testId="find-your-pension-type-22-section"
          contentId="find-your-pension-type-22-content"
          content={FIND_YOUR_PENSION_TYPE_22_CONTENT}
        />
      </VisibleSection>
      {/* Guidance sections consolidation */}
      <VisibleSection visible={showConsolidation1}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.consolidation1"
          testId="consolidation-1-section"
          contentId="consolidation-1-content"
          content={CONSOLIDATION_1_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showConsolidation1a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.consolidation1a"
          testId="consolidation-1a-section"
          contentId="consolidation-1a-content"
          content={CONSOLIDATION_1A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showConsolidation1b}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.consolidation1b"
          testId="consolidation-1b-section"
          contentId="consolidation-1b-content"
          content={CONSOLIDATION_1B_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showConsolidation1c}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.consolidation1c"
          testId="consolidation-1c-section"
          contentId="consolidation-1c-content"
          content={CONSOLIDATION_1C_CONTENT}
        />
      </VisibleSection>
      {/* Guidance sections overseas */}
      <VisibleSection visible={showSection8}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.overseas8"
          testId="overseas-8-section"
          contentId="overseas-8-content"
          content={OVERSEAS_8_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showSection8a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.overseas8a"
          testId="overseas-8a-section"
          contentId="overseas-8a-content"
          content={OVERSEAS_8A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showSection8b}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.overseas8b"
          testId="overseas-8b-section"
          contentId="overseas-8b-content"
          content={OVERSEAS_8B_CONTENT}
        />
      </VisibleSection>
      {/* Guidance sections contributions (employment) */}
      <VisibleSection visible={showEmployment02}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.employment02"
          testId="employment-02-section"
          contentId="employment-02-content"
          content={EMPLOYMENT_02_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showEmployment02a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.employment02a"
          testId="employment-02a-section"
          contentId="employment-02a-content"
          content={EMPLOYMENT_02A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showEmployment02b}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.employment02b"
          testId="employment-02b-section"
          contentId="employment-02b-content"
          content={EMPLOYMENT_02B_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showEmployment03}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.employment03"
          testId="employment-03-section"
          contentId="employment-03-content"
          content={EMPLOYMENT_03_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showEmployment04}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.employment04"
          testId="employment-04-section"
          contentId="employment-04-content"
          content={EMPLOYMENT_04_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showEmployment05}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.employment05"
          testId="employment-05-section"
          contentId="employment-05-content"
          content={EMPLOYMENT_05_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showEmployment06}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.employment06"
          testId="employment-06-section"
          contentId="employment-06-content"
          content={EMPLOYMENT_06_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showEmployment07}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.employment07"
          testId="employment-07-section"
          contentId="employment-07-content"
          content={EMPLOYMENT_07_CONTENT}
        />
      </VisibleSection>
      {/* Guidance sections housing */}
      <VisibleSection visible={showHousing09}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing09"
          testId="housing-09-section"
          contentId="housing-09-content"
          content={HOUSING_09_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing09a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing09a"
          testId="housing-09a-section"
          contentId="housing-09a-content"
          content={HOUSING_09A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing10}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing10"
          testId="housing-10-section"
          contentId="housing-10-content"
          content={HOUSING_10_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing10a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing10a"
          testId="housing-10a-section"
          contentId="housing-10a-content"
          content={HOUSING_10A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing11}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing11"
          testId="housing-11-section"
          contentId="housing-11-content"
          content={HOUSING_11_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing12}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing12"
          testId="housing-12-section"
          contentId="housing-12-content"
          content={HOUSING_12_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing12a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing12a"
          testId="housing-12a-section"
          contentId="housing-12a-content"
          content={HOUSING_12A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing13}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing13"
          testId="housing-13-section"
          contentId="housing-13-content"
          content={HOUSING_13_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing14}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing14"
          testId="housing-14-section"
          contentId="housing-14-content"
          content={HOUSING_14_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing14a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing14a"
          testId="housing-14a-section"
          contentId="housing-14a-content"
          content={HOUSING_14A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing14b}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing14b"
          testId="housing-14b-section"
          contentId="housing-14b-content"
          content={HOUSING_14B_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing15}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing15"
          testId="housing-15-section"
          contentId="housing-15-content"
          content={HOUSING_15_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing15a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing15a"
          testId="housing-15a-section"
          contentId="housing-15a-content"
          content={HOUSING_15A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing16}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing16"
          testId="housing-16-section"
          contentId="housing-16-content"
          content={HOUSING_16_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing16a}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing16a"
          testId="housing-16a-section"
          contentId="housing-16a-content"
          content={HOUSING_16A_CONTENT}
        />
      </VisibleSection>
      <VisibleSection visible={showHousing16b}>
        <GuidanceSection
          translationPrefix="results.variableGuidance.housing16b"
          testId="housing-16b-section"
          contentId="housing-16b-content"
          content={HOUSING_16B_CONTENT}
        />
      </VisibleSection>
    </div>
  );
};
