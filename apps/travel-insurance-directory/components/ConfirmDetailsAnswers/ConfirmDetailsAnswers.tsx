import { PageData } from 'data/pages/register/types';

import { Button } from '@maps-react/common/components/Button';

type Props = {
  questions: PageData;
  answers: Record<string, string> | null;
  pagePath: string;
};

const CHANGE_ANSWER_API = '/api/register/change-answer';

export const ConfirmDetailsAnswers = ({
  questions,
  answers,
  pagePath,
}: Props) => {
  return (
    <ul className="pt-2 pb-6 md:pt-4 md:pb-8">
      {Object.entries(questions).map(([id, data]) => {
        const inputKey = data?.radioInput?.key ?? id;
        const rawAnswer = answers?.[inputKey];

        const selectedOption = data?.radioInput?.options?.find(
          (opt) => opt.value === rawAnswer,
        );

        const displayLabel = selectedOption?.label ?? rawAnswer;
        if (data.hideOnDetailsPage) return;

        return (
          <li key={inputKey}>
            <form method="POST">
              <input
                type="hidden"
                name="pagePath"
                value={pagePath}
                data-testid={`pagePath-${inputKey}`}
              />
              <input
                type="hidden"
                name="pageStep"
                value={id}
                data-testid={`pageStep-${id}`}
              />
              <dl className="grid grid-cols-1 pb-6 md:grid-cols-8 gap-x-7 md:border-b-1 border-slate-400 md:pb-2 md:mt-2">
                <dt
                  id={`dt-${inputKey}`}
                  className="col-span-1 mb-2 text-base font-bold md:col-span-4"
                  data-testid={`dt-${inputKey}`}
                >
                  {data?.heading}
                </dt>

                <dd
                  className="col-span-1 mb-2 md:col-span-3 obfuscate"
                  data-testid={`dd-${inputKey}`}
                >
                  {displayLabel}
                </dd>

                <dd className="col-span-1">
                  <Button
                    className="gap-0 align-top"
                    variant="link"
                    formAction={`${CHANGE_ANSWER_API}?change=true`}
                    aria-describedby={`dt-${inputKey}`}
                    data-testid={`change-question-${inputKey}`}
                  >
                    Change
                  </Button>
                </dd>
              </dl>
            </form>
          </li>
        );
      })}
    </ul>
  );
};
