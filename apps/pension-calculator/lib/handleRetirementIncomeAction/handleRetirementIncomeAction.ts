import { JOURNEY_PAGES, type JourneyAction } from 'data/journey';
import { journeyPath } from 'utils/journeyPath';

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
      ? journeyPath(language, JOURNEY_PAGES.SAVE, sessionId)
      : journeyPath(language, JOURNEY_PAGES.RETIREMENT_INCOME, sessionId);

  return { redirectPath, valid: true };
};
