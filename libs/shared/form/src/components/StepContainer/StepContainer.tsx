import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Container } from '@maps-react/core/components/Container';
import { twMerge } from 'tailwind-merge';
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
}: Props) => {
  const { z } = useTranslation();

  return (
    <Container>
      <div className="space-y-9 pb-7">
        {backLink && (!isEmbed || currentStep !== 1) && (
          <BackLink href={backLink}>{z({ en: 'Back', cy: 'Yn ôl' })}</BackLink>
        )}
        {action ? (
          <form method="POST">
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
            >
              {buttonText}
            </Button>
          </form>
        ) : (
          children
        )}
      </div>
    </Container>
  );
};
