import ResetCalculator from 'components/ResetCalculator/ResetCalculator';
import { resetDialogContent } from 'data/budget-planner';

import BudgetPlanner, { getServerSidePropsDefault, Props } from '.';

export default function ResetCalculatorPage(props: Readonly<Props>) {
  return (
    <BudgetPlanner {...props}>
      <ResetCalculator
        title={resetDialogContent.title}
        description={resetDialogContent.description}
        confirmLabel={resetDialogContent.confirmButtonLabel}
        cancelLabel={resetDialogContent.cancelButtonLabel}
        confirmAction={resetDialogContent.confirmAction}
        cancelAction={resetDialogContent.cancelAction}
      />
    </BudgetPlanner>
  );
}

export const getServerSideProps = getServerSidePropsDefault;
