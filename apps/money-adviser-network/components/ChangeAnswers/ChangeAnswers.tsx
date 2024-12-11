import { v4 as uuidv4 } from 'uuid';

import { Button } from '@maps-react/common/components/Button';
import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { StepContainer } from '@maps-react/form/components/StepContainer';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { ConfirmQuestions } from '../../utils/getConfirmQuestions/getConfirmQuestions';
import { getCurrentPath } from '../../utils/getCurrentPath';
import { getPrefix } from '../../utils/getPrefix';
import { FLOW } from '../../utils/getQuestions';

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
}: Props) => {
  const { z } = useTranslation();

  const displayImmediateCallbackNotification =
    currentFlow === FLOW.TELEPHONE && storedData?.['t-4'] === 0;

  return (
    <StepContainer backLink={backLink} dataPath={currentFlow}>
      <>
        <div className="lg:max-w-[950px]">
          <H2>{z({ en: 'Confirm Details', cy: 'Cadarnhau manylion' })}</H2>
          <Paragraph>{text}</Paragraph>
          <ul className="pt-2 md:pt-4 pb-6 md:pb-8">
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
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-x-7 md:border-b-1 border-slate-400 pb-6 md:pb-2 md:mt-2">
                      <Paragraph
                        id={`${prefix}${questionNbr}`}
                        className="text-base font-bold col-span-1 md:col-span-4 mb-2"
                        data-testid={`${prefix}${questionNbr}`}
                      >
                        {question}
                      </Paragraph>
                      <Paragraph
                        className="col-span-1 md:col-span-3 mb-2"
                        data-testid={`a-${questionNbr}`}
                      >
                        {answer}
                      </Paragraph>
                      <div className="col-span-1">
                        <Button
                          className="align-top gap-0"
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
          <form method="POST">
            <input type="hidden" name="urlData" value={urlData} />
            <input type="hidden" name="cookieData" value={cookieData} />
            <input type="hidden" name="language" value={lang} />
            <input type="hidden" name="currentFlow" value={currentFlow} />
            <Button
              className="w-full justify-center md:w-auto md:justify-start m-auto"
              formAction={SUBMIT_API}
              data-testid={'submit-form'}
            >
              {actionText}
            </Button>
          </form>
        </div>
      </>
    </StepContainer>
  );
};
