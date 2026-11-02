import {
  emptyPot,
  type PotsOfMoneyData,
  type PotsOfMoneyErrors,
} from 'types/pensions';
import { potFieldId } from 'utils/pensionFieldIds';

export const addPot = (data: PotsOfMoneyData): PotsOfMoneyData => ({
  ...data,
  pots: [...data.pots, emptyPot()],
});

export const removePot = (
  data: PotsOfMoneyData,
  index: number,
): PotsOfMoneyData => {
  if (data.pots.length <= 1) return data;
  return {
    ...data,
    pots: data.pots.filter((_, itemIndex) => itemIndex !== index),
  };
};

const pattern = /^pension-pot-(\d+)-(name|currentValue|taxFreeCash)$/;
export const errorsAfterRemovingPot = (
  errors: PotsOfMoneyErrors,
  removedIndex: number,
) => {
  const next: PotsOfMoneyErrors = {};
  Object.entries(errors).forEach(([key, messages]) => {
    const match = pattern.exec(key);
    if (!match) {
      next[key] = messages;
      return;
    }
    const index = Number(match[1]);
    if (index === removedIndex) return;
    next[
      potFieldId(
        index > removedIndex ? index - 1 : index,
        match[2] as 'name' | 'currentValue' | 'taxFreeCash',
      )
    ] = messages;
  });
  return next;
};
