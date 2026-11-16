import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { CopyUrlButton } from '@maps-react/pension-tools/components/CopyUrlButton';

export type ResultsCTAsProps = {
  changeAnswerLink: string;
};

export const ResultsCTAs = ({ changeAnswerLink }: ResultsCTAsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <CopyUrlButton
        label={t('results.copyResultsLink.default')}
        labelConfirmation={t('results.copyResultsLink.confirmation')}
      />

      <Link
        asButtonVariant="secondary"
        href={changeAnswerLink}
        data-testid="change-answers-link"
      >
        <span className="block w-full text-center">
          {t('results.changeAnswersButton')}
        </span>
      </Link>
    </div>
  );
};
