import { ChangeEvent, useState } from 'react';
import { Checkbox } from 'components/Checkbox';
import { useTranslation } from '@maps-digital/shared/hooks';
import { Answer } from 'types';

type CheckBoxGroupProps = {
  answerRecord: Answer[];
  storedAnswer: Array<string>;
};

export const GroupCheckbox = ({
  answerRecord,
  storedAnswer,
}: CheckBoxGroupProps) => {
  const { z } = useTranslation();
  const initChecked = Array.from(Array(answerRecord.length), (v, i) => {
    return storedAnswer?.some((el) => Number(el) === i) || false;
  });

  const [checked, setChecked] = useState<boolean[]>(initChecked);

  const handleCheckBoxChange = (
    e: ChangeEvent<HTMLInputElement>,
    clearAll: boolean,
    i: number,
  ) => {
    const isChecked = e.target.checked;

    const resetAndSet =
      checked.some((value, index) => value && answerRecord[index].clearAll) ||
      (clearAll && isChecked);

    if (resetAndSet) {
      setChecked(initChecked.map((_, index) => index === i));
    } else {
      setChecked((prevChecked) => {
        return prevChecked.map((value, index) =>
          index === i ? isChecked : value,
        );
      });
    }
  };

  return (
    <>
      {answerRecord.map((s, index) => {
        return (
          <div
            key={`group-c-${s.text}`}
            className="space-y-4"
            data-testid={`group-checkbox-${index}`}
          >
            {s.clearAll && (
              <div className="text-base w-7 h-7 text-center">
                {' '}
                {z({ en: 'or', cy: 'Neu' })}{' '}
              </div>
            )}
            <div>
              <input
                type="hidden"
                name="unselectedScore"
                value={s.unselectedScore}
              />
              {s.score ?? (
                <input type="hidden" name={'score'} value={s.score} />
              )}
              <input
                type="hidden"
                name={'clearAll'}
                value={s.clearAll ? 'true' : 'false'}
              />

              <Checkbox
                name={'answer-' + index}
                checked={checked[index]}
                value={index}
                onChange={(e) => handleCheckBoxChange(e, s.clearAll!, index)}
                aria-describedby={`hint-${index}`}
              >
                {s.text}
              </Checkbox>
              <p className="text-gray-400 ml-[60px]" id={`hint-${index}`}>
                {s.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};
