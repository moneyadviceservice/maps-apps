import { JOURNEY_PAGES, type JourneyAction } from 'data/journey';
import { journeyPath, saveJourneyPath } from 'utils/journeyPath';

type Result = {
  redirectPath: string;
  valid: boolean;
};

export const handleRetirementIncomeAction = ({
  action,
  language,
  sessionId,
}: {
  action: JourneyAction;
  language: string;
  sessionId: string;
}): Result => {
  const redirectPath =
    action === 'save'
      ? saveJourneyPath(language, JOURNEY_PAGES.RETIREMENT_INCOME, sessionId)
      : journeyPath(language, JOURNEY_PAGES.CHECK_YOUR_ANSWERS, sessionId);

  return { redirectPath, valid: true };
};
