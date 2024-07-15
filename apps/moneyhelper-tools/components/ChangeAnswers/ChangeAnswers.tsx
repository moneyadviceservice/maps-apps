import { Button, H2, H3, Link, Paragraph } from '@maps-digital/shared/ui';
import { StepContainer } from 'components/StepContainer';
import { QUESTION_PREFIX } from 'CONSTANTS';
import { useTranslation } from '@maps-digital/shared/hooks';
import { DataPath, Question } from 'types';
import { DataFromQuery } from 'utils/pageFilter';

type Props = {
  storedData: DataFromQuery;
  data: string;
  questions: Question[];
  dataPath: DataPath;
  text: string;
  nextLink: string;
  actionText: string;
  CHANGE_ANSWER_API: string;
  backLink: string;
  lang: string;
  isEmbed: boolean;
};

export const ChangeAnswers = ({
  storedData,
  data,
  questions,
  dataPath,
  text,
  nextLink,
  actionText,
  CHANGE_ANSWER_API,
  backLink,
  lang,
  isEmbed,
}: Props) => {
  const { z } = useTranslation();

  return (
    <StepContainer backLink={backLink} isEmbed={isEmbed}>
      <div className="space-y-10 lg:max-w-[840px]">
        <div className="space-y-4">
          <H2>
            {z({ en: 'Check your answers', cy: 'Edrychwch dros eich atebion' })}
          </H2>
          <Paragraph>{text}</Paragraph>

          <ul className="pt-4">
            {questions.map((t, index) => {
              const savedAnswer =
                storedData[QUESTION_PREFIX + String(t.questionNbr)]?.split(',');

              if (savedAnswer) {
                return (
                  <li key={`list-question-${t.questionNbr}`}>
                    <form method="POST">
                      <div className="grid grid-cols-8 gap-x-7 border-b-1 border-slate-400 pb-2 mt-2">
                        <input
                          type="hidden"
                          name="isEmbed"
                          value={isEmbed ? 'true' : 'false'}
                        />
                        <input
                          type="hidden"
                          name="questionNbr"
                          value={t.questionNbr}
                        />
                        <input type="hidden" name="savedData" value={data} />
                        <input type="hidden" name="language" value={lang} />
                        <input type="hidden" name="dataPath" value={dataPath} />
                        <H3
                          id={`q-${t.questionNbr}`}
                          className="text-base font-bold lg:col-span-4 col-span-3"
                          data-testid={`q-${t.questionNbr}`}
                        >
                          {t.title}
                        </H3>
                        <Paragraph className="col-span-3">
                          {t.type === 'moneyInput'
                            ? storedData[
                                QUESTION_PREFIX + String(t.questionNbr)
                              ]
                            : savedAnswer.map((s: number, i: number) => {
                                return (
                                  <span key={i}>
                                    {t.answers[s]?.text}
                                    <br />
                                  </span>
                                );
                              })}
                        </Paragraph>
                        <div className="lg:col-span-1 col-span-2">
                          <Button
                            className="align-top"
                            variant="link"
                            formAction={CHANGE_ANSWER_API}
                            aria-describedby={`q-${t.questionNbr}`}
                            data-testid={`change-question-${t.questionNbr}`}
                          >
                            {z({ en: 'Change', cy: 'Newid' })}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <div>
          {' '}
          <Link
            asButtonVariant="primary"
            href={nextLink}
            className="w-full justify-center md:w-auto md:justify-start"
            data-testid="next-page-button"
          >
            <span>{actionText}</span>
          </Link>
        </div>
      </div>
    </StepContainer>
  );
};
