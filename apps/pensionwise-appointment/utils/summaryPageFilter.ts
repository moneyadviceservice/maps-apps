import {
  PensionOption,
  PensionOptionDataType,
  ToDoCard,
  ToDoItem,
} from './types';

export const filterToDoCards = (
  query: Record<string, string>,
  basicPlanningToDoCards: ToDoCard[],
  optionalBasicPlanningToDoCards: ToDoCard[],
) => {
  const toDoCards = [...basicPlanningToDoCards];

  const todos = {
    // Pension basics
    4: query.t1q1 === '2' || query.t1q1 === '3',
    5: query.t1q2 === '1' || query.t1q2 === '3',
    // Income and savings
    6: query.t2q1 === '2',
    7: query.t2q2 === '2',
    8: query.t2q3 === '1',
    9: query.t2q3 === '3',
    // Debts and repayments
    10: query.t3q1 === '1' || query.t3q1 === '3',
    // Your home
    11: query.t4q1 === '1',
    // Health and family
    12: query.t5q1 === '2',
    13: query.t5q2 === '2',
  };

  Object.entries(todos).forEach(([id, hasTodo]) => {
    if (hasTodo) {
      const foundItem = optionalBasicPlanningToDoCards.find(
        (item: ToDoItem) => item.id === id,
      );

      if (foundItem) {
        toDoCards.push(foundItem);
      }
    }
  });

  return toDoCards;
};

export const filterInterestList = (
  query: Record<string, string>,
  data: Record<string, PensionOptionDataType>,
) => {
  const interestList: PensionOption[] = [];
  const {
    retireLater,
    guaranteedIncome,
    flexibleIncome,
    lumpSum,
    potInOneGo,
    mixinOptions,
  } = data;
  query.t6q1 === '1' &&
    interestList.push({
      title: retireLater.title,
      items: retireLater.items,
      testId: 'retire-later-list',
    });
  query.t7q1 === '1' &&
    interestList.push({
      title: guaranteedIncome.title,
      items: guaranteedIncome.items,
      testId: 'guaranteed-income-list',
    });
  query.t8q1 === '1' &&
    interestList.push({
      title: flexibleIncome.title,
      items: flexibleIncome.items,
      testId: 'flexible-income-list',
    });
  query.t9q1 === '1' &&
    interestList.push({
      title: lumpSum.title,
      items: lumpSum.items,
      testId: 'lump-sum-list',
    });
  query.t10q1 === '1' &&
    interestList.push({
      title: potInOneGo.title,
      items: potInOneGo.items,
      testId: 'pot-in-one-go-list',
    });
  query.t11q1 === '1' &&
    interestList.push({
      title: mixinOptions.title,
      items: mixinOptions.items,
      testId: 'mix-options-list',
    });

  return interestList;
};
