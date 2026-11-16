import { ReactNode } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';

type FormPageProps = {
  submitAction: (e: React.SubmitEvent<HTMLFormElement>) => void;
  nonJsSubmitFallback: string;
  isPending?: boolean;
  className?: string;
  formName?: string;
  showSaveButton?: boolean;
  submitButtonLabel?: string;
  hiddenFields?: ReactNode;
  children: ReactNode;
};

export const FormPage = ({
  submitAction,
  nonJsSubmitFallback,
  isPending,
  className,
  formName,
  showSaveButton,
  submitButtonLabel = 'Continue',
  hiddenFields,
  children,
}: FormPageProps) => (
  <form
    action={nonJsSubmitFallback}
    noValidate
    method="POST"
    className={className}
    id={formName}
    onSubmit={submitAction}
    data-testid={formName}
  >
    {hiddenFields}
    {children}

    <div className="flex flex-col items-center justify-start md:gap-4 md:flex-row mt-12">
      <Button type="submit" disabled={isPending} data-testid="submit-button">
        {submitButtonLabel}
      </Button>
      {showSaveButton && (
        <Button
          className="flex items-center mt-6 md:mt-0"
          variant="link"
          type="submit"
          form={formName}
          name="action"
          value="save"
          data-testid="save-button"
          iconLeft={<Icon type={IconType.BOOKMARK} />}
        >
          {'Save and come back later'}
        </Button>
      )}
    </div>
  </form>
);
