import { BackLink } from 'components/BackLink';
import { Container, Button } from '@maps-digital/shared/ui';
import classNames from 'classnames';
import { useTranslation } from '@maps-digital/shared/hooks';
import { DataPath } from 'types';

export type Props = {
  children: JSX.Element;
  backLink?: string;
  lang?: string | string[];
  data?: string;
  action?: string;
  buttonText?: string;
  dataPath?: DataPath;
  isEmbed?: boolean;
  buttonClassName?: string;
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
}: Props) => {
  const { z } = useTranslation();

  return (
    <Container>
      <div className="space-y-9 pb-7">
        {backLink && (
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
              className={classNames('mt-9', buttonClassName)}
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
