import { twMerge } from 'tailwind-merge';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type Props = {
  children: JSX.Element;
  backLink?: string;
  lang?: string | string[];
  data?: string;
  action?: string;
  buttonText?: string;
  dataPath?: string;
  isEmbed?: boolean;
  buttonClassName?: string;
  currentStep?: number;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const StepContainer = ({
  children,
  backLink,
  lang,
  data,
  action,
  buttonText,
  dataPath,
  isEmbed,
  buttonClassName,
  currentStep,
  onSubmit,
}: Props) => {
  const { z } = useTranslation();

  return (
    <Container>
      <>
        {backLink && (!isEmbed || currentStep !== 1) && (
          <BackLink href={backLink}>{z({ en: 'Back', cy: 'Yn ôl' })}</BackLink>
        )}
        {action ? (
          <form data-testid="form" method="POST" onSubmit={onSubmit}>
            <input
              type="hidden"
              name="isEmbed"
              value={isEmbed ? 'true' : 'false'}
            />
            <input type="hidden" name="language" value={lang} />
            <input type="hidden" name="savedData" value={data} />
            <input type="hidden" name="dataPath" value={dataPath} />
            {children}
            <Button
              className={twMerge('mt-8', buttonClassName)}
              variant="primary"
              formAction={action}
              data-testid={'step-container-submit-button'}
            >
              {buttonText}
            </Button>
          </form>
        ) : (
          children
        )}
      </>
    </Container>
  );
};
