import { useRef, useState } from 'react';

import { ConfirmQuestions } from 'utils/getConfirmQuestions/getConfirmQuestions';
import { getCurrentPath } from 'utils/getCurrentPath';
import { getPrefix } from 'utils/getPrefix';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@maps-react/common/components/Button';
import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { StepContainer } from '@maps-react/form/components/StepContainer';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type Props = {
  storedData: DataFromQuery;
  urlData: string;
  cookieData: string;
  questions: ConfirmQuestions;
  text: string;
  actionText: string;
  CHANGE_ANSWER_API: string;
  SUBMIT_API: string;
  backLink: string;
  lang: string;
  currentFlow: string;
  displayImmediateCallbackNotification?: boolean;
  csrfToken?: string;
};

export const ChangeAnswers = ({
  storedData,
  urlData,
  cookieData,
  questions,
  text,
  actionText,
  CHANGE_ANSWER_API,
  SUBMIT_API,
  backLink,
  lang,
  currentFlow,
  displayImmediateCallbackNotification,
  csrfToken,
}: Props) => {
  const { z } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);

  const [formSubmitting, setFormSubmitting] = useState(false);

  const error = storedData?.error;

  const handleClick = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!formSubmitting && formRef.current) {
      setFormSubmitting(true);

      formRef.current.submit();
    }
  };

  return (
    <StepContainer backLink={backLink} dataPath={currentFlow}>
      <>
        <div className="lg:max-w-[950px]">
          {error && (
            <ErrorSummary
              title={z({
                en: 'There is a problem',
                cy: 'Mae yna broblem',
              })}
              errors={{ error }}
              classNames="my-8"
              titleLevel={'h2'}
            />
          )}
          <Heading level="h2" component="h1">
            {z({ en: 'Confirm Details', cy: 'Cadarnhau manylion' })}
          </Heading>
          <Paragraph>{text}</Paragraph>
          <ul className="pt-2 pb-6 md:pt-4 md:pb-8">
            {questions.map(({ flow, questionNbr, answer, question }) => {
              const prefix = getPrefix(flow);
              return (
                <li key={uuidv4()}>
                  <form method="POST">
                    <input
                      type="hidden"
                      name="urlData"
                      value={urlData}
                      data-testid={`urlData-${questionNbr}`}
                    />
                    <input
                      type="hidden"
                      name="language"
                      value={lang}
                      data-testid={`language-${questionNbr}`}
                    />
                    <input
                      type="hidden"
                      name="pagePath"
                      value={`${getCurrentPath(flow)}/${prefix}${questionNbr}`}
                      data-testid={`pagePath-${questionNbr}`}
                    />
                    <input
                      type="hidden"
                      name="prefix"
                      value={prefix}
                      data-testid={`prefix-${questionNbr}`}
                    />
                    <div className="grid grid-cols-1 pb-6 md:grid-cols-8 gap-x-7 md:border-b-1 border-slate-400 md:pb-2 md:mt-2">
                      <Paragraph
                        id={`${prefix}${questionNbr}`}
                        className="col-span-1 mb-2 text-base font-bold md:col-span-4"
                        data-testid={`${prefix}${questionNbr}`}
                      >
                        {question}
                      </Paragraph>
                      <Paragraph
                        className="col-span-1 mb-2 md:col-span-3"
                        data-testid={`a-${questionNbr}`}
                      >
                        {answer}
                      </Paragraph>
                      <div className="col-span-1">
                        <Button
                          className="gap-0 align-top"
                          variant="link"
                          formAction={CHANGE_ANSWER_API}
                          aria-describedby={`${prefix}${questionNbr}`}
                          data-testid={`change-question-${questionNbr}`}
                          name="questionNbr"
                          value={questionNbr}
                        >
                          {z({ en: 'Change', cy: 'Newid' })}
                        </Button>
                      </div>
                    </div>
                  </form>
                </li>
              );
            })}
          </ul>

          {displayImmediateCallbackNotification && (
            <Callout
              variant={CalloutVariant.WARNING}
              className="mb-8"
              testId="telephone-confirm-warning"
            >
              {z({
                en: (
                  <span>
                    Once you click the button below, a call to the customer will
                    be made immediately. That&apos;s why it&apos;s very
                    important that you{' '}
                    <span className="font-bold">
                      end your conversation with the customer
                    </span>
                    .
                  </span>
                ),
                cy: (
                  <span>
                    Unwaith y byddwch yn clicio ar y botwm isod, bydd galwad
                    i&apos;r cwsmer yn cael ei wneud ar unwaith. Dyna pam ei bod
                    yn bwysig iawn eich bod chi&apos;n{' '}
                    <span className="font-bold">
                      gorffen eich sgwrs gyda&apos;r cwsmer
                    </span>
                    .
                  </span>
                ),
              })}
            </Callout>
          )}
        </div>

        <div>
          <form method="POST" action={SUBMIT_API} ref={formRef}>
            <input type="hidden" name="urlData" value={urlData} />
            <input type="hidden" name="cookieData" value={cookieData} />
            <input type="hidden" name="language" value={lang} />
            <input type="hidden" name="currentFlow" value={currentFlow} />
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <Button
              className="justify-center w-full m-auto md:w-auto md:justify-start"
              data-testid={'submit-form'}
              onClick={handleClick}
              disabled={formSubmitting}
            >
              {actionText}
            </Button>
          </form>
        </div>
      </>
    </StepContainer>
  );
};
