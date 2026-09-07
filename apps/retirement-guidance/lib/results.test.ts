import { DataFromQuery } from '@maps-react/utils/pageFilter/pageFilter';
import {
  getRetirementStatusFlags,
  getDebtAdviceStatusFlags,
  getPensionOutcome,
  getConsolidationOutcome,
  getPrimaryGoalOutcome,
  getEmploymentOutcome,
  getHousingOutcome,
} from './results';

describe('getRetirementStatusFlags', () => {
  it.each([
    ['q-2 is "0"', { 'q-2': '0' }, true, false, true, false],
    ['q-2 is "1"', { 'q-2': '1' }, false, true, true, false],
    ['q-2 is "2"', { 'q-2': '2' }, false, false, false, true],
    ['q-2 is undefined', {}, false, false, false, false],
    ['q-2 is an empty string', { 'q-2': '' }, false, false, false, false],
  ])(
    'should return correct flags when %s',
    (
      _,
      data,
      expectedRetireInNext10Years,
      expectedNotRetireInNext10Years,
      expectedNotRetired,
      expectedAlreadyRetired,
    ) => {
      expect(getRetirementStatusFlags(data as DataFromQuery)).toEqual([
        expectedRetireInNext10Years,
        expectedNotRetireInNext10Years,
        expectedNotRetired,
        expectedAlreadyRetired,
      ]);
    },
  );
});

describe('getDebtAdviceStatusFlags', () => {
  it.each([
    ['q-11 is "0"', { 'q-11': '0' }, true, false],
    ['q-11 is "1"', { 'q-11': '1' }, false, true],
    ['q-11 is undefined', {}, false, false],
    ['q-11 is an empty string', { 'q-11': '' }, false, false],
  ])(
    'should return correct flags when %s',
    (_, data, expectedHadDebtAdvice, expectedHasNeverHadDebtAdvice) => {
      expect(getDebtAdviceStatusFlags(data as DataFromQuery)).toEqual([
        expectedHadDebtAdvice,
        expectedHasNeverHadDebtAdvice,
      ]);
    },
  );
});

describe('getPensionOutcome', () => {
  it('should return true for showSection8a when only state pension selected and has plan to retire outside the UK', () => {
    const data: DataFromQuery = { 'q-5': '2', 'q-7': '0' };
    const outcome = getPensionOutcome(data);

    expect(outcome.showSection8a).toBe(true);
    expect(outcome.showSection8b).toBe(false);
    expect(outcome.showSection8).toBe(false);
  });

  it('should return true for showSection8b when state pension and other pensions selected and not sure about retiring outside the UK', () => {
    const data: DataFromQuery = { 'q-5': '0,1,2,3', 'q-7': '2' };
    const outcome = getPensionOutcome(data);

    expect(outcome.showSection8a).toBe(false);
    expect(outcome.showSection8b).toBe(true);
    expect(outcome.showSection8).toBe(false);
  });
});

describe('getConsolidationOutcome', () => {
  const noGuidance = {
    showConsolidation1: false,
    showConsolidation1a: false,
    showConsolidation1b: false,
    showConsolidation1c: false,
    showFindYourPensionType22: false,
  };

  it.each`
    description                                       | q5             | q6     | outcomeOverrides
    ${'State Pension only + Yes'}                     | ${'2'}         | ${'0'} | ${{}}
    ${'State Pension only + No'}                      | ${'2'}         | ${'1'} | ${{}}
    ${'State Pension only + Not sure'}                | ${'2'}         | ${'2'} | ${{}}
    ${'DB only + Yes'}                                | ${'1'}         | ${'0'} | ${{ showConsolidation1a: true }}
    ${'DB only + Not sure'}                           | ${'1'}         | ${'2'} | ${{ showConsolidation1a: true }}
    ${'DB only + No'}                                 | ${'1'}         | ${'1'} | ${{}}
    ${'DC only + Yes'}                                | ${'0'}         | ${'0'} | ${{ showConsolidation1: true }}
    ${'DC only + Not sure'}                           | ${'0'}         | ${'2'} | ${{ showConsolidation1: true }}
    ${'DC only + No'}                                 | ${'0'}         | ${'1'} | ${{}}
    ${'Other only + Yes'}                             | ${'3'}         | ${'0'} | ${{ showConsolidation1: true }}
    ${'Other only + No'}                              | ${'3'}         | ${'1'} | ${{}}
    ${'Other only + Not sure'}                        | ${'3'}         | ${'2'} | ${{ showConsolidation1: true }}
    ${'Not sure pension type only + Yes'}             | ${'4'}         | ${'0'} | ${{ showFindYourPensionType22: true }}
    ${'Not sure pension type only + No'}              | ${'4'}         | ${'1'} | ${{ showFindYourPensionType22: true }}
    ${'Not sure pension type only + Not sure'}        | ${'4'}         | ${'2'} | ${{ showFindYourPensionType22: true }}
    ${'DB and State + Yes'}                           | ${'1,2'}       | ${'0'} | ${{ showConsolidation1a: true }}
    ${'DB and Other + Yes'}                           | ${'1,3'}       | ${'0'} | ${{ showConsolidation1a: true }}
    ${'DB and Not sure + Yes'}                        | ${'1,4'}       | ${'0'} | ${{ showConsolidation1a: true }}
    ${'DB, State and Other + Yes'}                    | ${'1,2,3'}     | ${'0'} | ${{ showConsolidation1a: true }}
    ${'DB, State and Not sure + Yes'}                 | ${'1,2,4'}     | ${'0'} | ${{ showConsolidation1a: true }}
    ${'DB, Other and Not sure + Yes'}                 | ${'1,3,4'}     | ${'0'} | ${{ showConsolidation1a: true }}
    ${'DB, State, Other and Not sure + Yes'}          | ${'1,2,3,4'}   | ${'0'} | ${{ showConsolidation1a: true }}
    ${'DB and State + Not sure'}                      | ${'1,2'}       | ${'2'} | ${{ showConsolidation1a: true }}
    ${'DB and Other + Not sure'}                      | ${'1,3'}       | ${'2'} | ${{ showConsolidation1a: true }}
    ${'DB and Not sure + Not sure'}                   | ${'1,4'}       | ${'2'} | ${{ showConsolidation1a: true }}
    ${'DB, State and Other + Not sure'}               | ${'1,2,3'}     | ${'2'} | ${{ showConsolidation1a: true }}
    ${'DB, State and Not sure + Not sure'}            | ${'1,2,4'}     | ${'2'} | ${{ showConsolidation1a: true }}
    ${'DB, Other and Not sure + Not sure'}            | ${'1,3,4'}     | ${'2'} | ${{ showConsolidation1a: true }}
    ${'DB, State, Other and Not sure + Not sure'}     | ${'1,2,3,4'}   | ${'2'} | ${{ showConsolidation1a: true }}
    ${'DB and DC + Yes'}                              | ${'0,1'}       | ${'0'} | ${{ showConsolidation1c: true }}
    ${'DB, DC and State + Yes'}                       | ${'0,1,2'}     | ${'0'} | ${{ showConsolidation1c: true }}
    ${'DB, DC and Other + Yes'}                       | ${'0,1,3'}     | ${'0'} | ${{ showConsolidation1c: true }}
    ${'DB, DC and Not sure + Yes'}                    | ${'0,1,4'}     | ${'0'} | ${{ showConsolidation1c: true }}
    ${'DB, DC, State and Other + Yes'}                | ${'0,1,2,3'}   | ${'0'} | ${{ showConsolidation1c: true }}
    ${'DB, DC, State and Not sure + Yes'}             | ${'0,1,2,4'}   | ${'0'} | ${{ showConsolidation1c: true }}
    ${'DB, DC, Other and Not sure + Yes'}             | ${'0,1,3,4'}   | ${'0'} | ${{ showConsolidation1c: true }}
    ${'All pension types + Yes'}                      | ${'0,1,2,3,4'} | ${'0'} | ${{ showConsolidation1c: true }}
    ${'DB and DC + Not sure'}                         | ${'0,1'}       | ${'2'} | ${{ showConsolidation1c: true }}
    ${'DB, DC and State + Not sure'}                  | ${'0,1,2'}     | ${'2'} | ${{ showConsolidation1c: true }}
    ${'DB, DC and Other + Not sure'}                  | ${'0,1,3'}     | ${'2'} | ${{ showConsolidation1c: true }}
    ${'DB, DC and Not sure + Not sure'}               | ${'0,1,4'}     | ${'2'} | ${{ showConsolidation1c: true }}
    ${'DB, DC, State and Other + Not sure'}           | ${'0,1,2,3'}   | ${'2'} | ${{ showConsolidation1c: true }}
    ${'DB, DC, State and Not sure + Not sure'}        | ${'0,1,2,4'}   | ${'2'} | ${{ showConsolidation1c: true }}
    ${'DB, DC, Other and Not sure + Not sure'}        | ${'0,1,3,4'}   | ${'2'} | ${{ showConsolidation1c: true }}
    ${'DB, DC, State, Other and Not sure + Not sure'} | ${'0,1,2,3,4'} | ${'2'} | ${{ showConsolidation1c: true }}
    ${'State and Not sure + Yes'}                     | ${'2,4'}       | ${'0'} | ${{ showConsolidation1: true }}
    ${'State and DC + Yes'}                           | ${'0,2'}       | ${'0'} | ${{ showConsolidation1: true }}
    ${'State and Other + Yes'}                        | ${'2,3'}       | ${'0'} | ${{ showConsolidation1: true }}
    ${'DC and Other + Yes'}                           | ${'0,3'}       | ${'0'} | ${{ showConsolidation1: true }}
    ${'DC and Not sure + Yes'}                        | ${'0,4'}       | ${'0'} | ${{ showConsolidation1: true }}
    ${'Other and Not sure + Yes'}                     | ${'3,4'}       | ${'0'} | ${{ showConsolidation1: true }}
    ${'State, DC and Other + Yes'}                    | ${'0,2,3'}     | ${'0'} | ${{ showConsolidation1: true }}
    ${'State, DC and Not sure + Yes'}                 | ${'0,2,4'}     | ${'0'} | ${{ showConsolidation1: true }}
    ${'State, Other and Not sure + Yes'}              | ${'2,3,4'}     | ${'0'} | ${{ showConsolidation1: true }}
    ${'DC, Other and Not sure + Yes'}                 | ${'0,3,4'}     | ${'0'} | ${{ showConsolidation1: true }}
    ${'State, DC, Other and Not sure + Yes'}          | ${'0,2,3,4'}   | ${'0'} | ${{ showConsolidation1: true }}
    ${'State and DC + Not sure'}                      | ${'0,2'}       | ${'2'} | ${{ showConsolidation1: true }}
    ${'State and Other + Not sure'}                   | ${'2,3'}       | ${'2'} | ${{ showConsolidation1: true }}
    ${'State and Not sure + Not sure'}                | ${'2,4'}       | ${'2'} | ${{ showConsolidation1: true }}
    ${'DC and Other + Not sure'}                      | ${'0,3'}       | ${'2'} | ${{ showConsolidation1: true }}
    ${'DC and Not sure + Not sure'}                   | ${'0,4'}       | ${'2'} | ${{ showConsolidation1: true }}
    ${'Other and Not sure + Not sure'}                | ${'3,4'}       | ${'2'} | ${{ showConsolidation1: true }}
    ${'State, DC and Other + Not sure'}               | ${'0,2,3'}     | ${'2'} | ${{ showConsolidation1: true }}
    ${'State, DC and Not sure + Not sure'}            | ${'0,2,4'}     | ${'2'} | ${{ showConsolidation1: true }}
    ${'State, Other and Not sure + Not sure'}         | ${'2,3,4'}     | ${'2'} | ${{ showConsolidation1: true }}
    ${'DC, Other and Not sure + Not sure'}            | ${'0,3,4'}     | ${'2'} | ${{ showConsolidation1: true }}
    ${'State, DC, Other and Not sure + Not sure'}     | ${'0,2,3,4'}   | ${'2'} | ${{ showConsolidation1: true }}
    ${'State and DB + No'}                            | ${'1,2'}       | ${'1'} | ${{}}
    ${'State and DC + No'}                            | ${'0,2'}       | ${'1'} | ${{}}
    ${'State and Other + No'}                         | ${'2,3'}       | ${'1'} | ${{}}
    ${'State and Not sure + No'}                      | ${'2,4'}       | ${'1'} | ${{}}
    ${'DB and DC + No'}                               | ${'0,1'}       | ${'1'} | ${{}}
    ${'DB and Other + No'}                            | ${'1,3'}       | ${'1'} | ${{}}
    ${'DB and Not sure + No'}                         | ${'1,4'}       | ${'1'} | ${{}}
    ${'DC and Other + No'}                            | ${'0,3'}       | ${'1'} | ${{}}
    ${'DC and Not sure + No'}                         | ${'0,4'}       | ${'1'} | ${{}}
    ${'Other and Not sure + No'}                      | ${'3,4'}       | ${'1'} | ${{}}
    ${'State, DB and DC + No'}                        | ${'0,1,2'}     | ${'1'} | ${{}}
    ${'State, DB and Other + No'}                     | ${'1,2,3'}     | ${'1'} | ${{}}
    ${'State, DB and Not sure + No'}                  | ${'1,2,4'}     | ${'1'} | ${{}}
    ${'State, DC and Other + No'}                     | ${'0,2,3'}     | ${'1'} | ${{}}
    ${'State, DC and Not sure + No'}                  | ${'0,2,4'}     | ${'1'} | ${{}}
    ${'State, Other and Not sure + No'}               | ${'2,3,4'}     | ${'1'} | ${{}}
    ${'DB, DC and Other + No'}                        | ${'0,1,3'}     | ${'1'} | ${{}}
    ${'DB, DC and Not sure + No'}                     | ${'0,1,4'}     | ${'1'} | ${{}}
    ${'DB, Other and Not sure + No'}                  | ${'1,3,4'}     | ${'1'} | ${{}}
    ${'DC, Other and Not sure + No'}                  | ${'0,3,4'}     | ${'1'} | ${{}}
    ${'State, DB, DC and Other + No'}                 | ${'0,1,2,3'}   | ${'1'} | ${{}}
    ${'State, DB, DC and Not sure + No'}              | ${'0,1,2,4'}   | ${'1'} | ${{}}
    ${'State, DB, Other and Not sure + No'}           | ${'1,2,3,4'}   | ${'1'} | ${{}}
    ${'State, DC, Other and Not sure + No'}           | ${'0,2,3,4'}   | ${'1'} | ${{}}
    ${'DB, DC, Other and Not sure + No'}              | ${'0,1,3,4'}   | ${'1'} | ${{}}
    ${'All pension types + No'}                       | ${'0,1,2,3,4'} | ${'1'} | ${{}}
  `(
    'should show the correct package for $description',
    ({ q5, q6, outcomeOverrides }) => {
      const data: DataFromQuery = { 'q-5': q5, 'q-6': q6 };

      expect(getConsolidationOutcome(data)).toEqual({
        ...noGuidance,
        ...outcomeOverrides,
      });
    },
  );
});

describe('getPrimaryGoalOutcome', () => {
  it("should return true for showPrimaryGoal22 when q-1 is '0' (How my pension works) and q-2 is '0' (Retire in next 10 years)", () => {
    let data: DataFromQuery = { 'q-1': '0', 'q-2': '0' };
    let outcome = getPrimaryGoalOutcome(data);

    expect(outcome.showPrimaryGoal22).toBe(true);
    data = { ...data, 'q-1': '0', 'q-2': '2' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal22a).toBe(true);
    data = { ...data, 'q-1': '1', 'q-2': '1' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal25).toBe(true);
    data = { ...data, 'q-1': '1', 'q-2': '0' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal25a).toBe(true);
    data = { ...data, 'q-1': '1', 'q-2': '2' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal25b).toBe(true);

    // No DC pension (q-5 absent) + less than 10 years → 24c
    data = { ...data, 'q-1': '4', 'q-2': '0' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal24c).toBe(true);

    // DC pension + less than 10 years → 24b
    data = { ...data, 'q-5': '0' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal24b).toBe(true);

    // More than 10 years (any pension type) → 24c
    data = { ...data, 'q-2': '1' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal24c).toBe(true);

    // Already retired → 24a
    data = { ...data, 'q-2': '2' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal24a).toBe(true);

    data = { ...data, 'q-1': '2', 'q-2': '2' };
    outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal26).toBe(true);
  });

  it('should show 24c when pension type is non-DC and less than 10 years', () => {
    // DB only + less than 10 years → 24c
    const data: DataFromQuery = { 'q-1': '4', 'q-2': '0', 'q-5': '1' };
    const outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal24c).toBe(true);
    expect(outcome.showPrimaryGoal24b).toBe(false);
  });

  it('should show 24b when combination includes DC and less than 10 years', () => {
    // DC + DB combination + less than 10 years → 24b
    const data: DataFromQuery = { 'q-1': '4', 'q-2': '0', 'q-5': '0,1' };
    const outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal24b).toBe(true);
    expect(outcome.showPrimaryGoal24c).toBe(false);
  });

  it('should keep showPrimaryGoal24 as false (retained for MVP+)', () => {
    const data: DataFromQuery = { 'q-1': '4', 'q-2': '0', 'q-5': '0' };
    const outcome = getPrimaryGoalOutcome(data);
    expect(outcome.showPrimaryGoal24).toBe(false);
  });
});

// q-3: 0=hasEmployer, 1=selfEmployed, 2=notEmployed
// q-4: 0=paysIntoPension, 1=notPaying, 2=notSure
// q-5: 0=DC, 1=DB, 2=StatePension, 3=Other, 4=NotSure

describe('getEmploymentOutcome', () => {
  const noGuidance = {
    showEmployment02: false,
    showEmployment02a: false,
    showEmployment02b: false,
    showEmployment03: false,
    showEmployment04: false,
    showEmployment05: false,
    showEmployment06: false,
    showEmployment07: false,
  };

  describe('has employer (q-3=0) and pays into pension (q-4=0)', () => {
    it.each([
      ['State Pension only (q-5=2)', '2', { showEmployment03: true }],
      ['Defined Benefit only (q-5=1)', '1', { showEmployment02a: true }],
      [
        'DB in combination with DC (q-5=0,1)',
        '0,1',
        { showEmployment02b: true },
      ],
      [
        'DB in combination with State Pension (q-5=1,2)',
        '1,2',
        { showEmployment02b: true },
      ],
      ['not sure about pension type (q-5=4)', '4', { showEmployment02b: true }],
      ['DC only (q-5=0)', '0', { showEmployment02: true }],
      ['combination without DB (q-5=0,2)', '0,2', { showEmployment02: true }],
    ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
      const data: DataFromQuery = { 'q-3': '0', 'q-4': '0', 'q-5': q5 };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        ...outcomeOverrides,
      });
    });
  });

  describe('has employer (q-3=0) and does not pay into pension', () => {
    it('should show package 03 when not paying into pension (q-4=1)', () => {
      const data: DataFromQuery = { 'q-3': '0', 'q-4': '1', 'q-5': '0' };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        showEmployment03: true,
      });
    });

    it('should show package 03 when not sure about pension contributions (q-4=2)', () => {
      const data: DataFromQuery = { 'q-3': '0', 'q-4': '2', 'q-5': '1' };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        showEmployment03: true,
      });
    });
  });

  describe('self-employed (q-3=1) and pays into pension (q-4=0)', () => {
    it.each([
      ['DC only (q-5=0)', '0', { showEmployment04: true }],
      ['not sure about pension type (q-5=4)', '4', { showEmployment04: true }],
      ['combination without DB (q-5=0,2)', '0,2', { showEmployment04: true }],
      ['DB only (q-5=1)', '1', {}],
    ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
      const data: DataFromQuery = { 'q-3': '1', 'q-4': '0', 'q-5': q5 };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        ...outcomeOverrides,
      });
    });
  });

  describe('self-employed (q-3=1) and does not pay into pension', () => {
    it('should show package 05 when not paying into pension (q-4=1)', () => {
      const data: DataFromQuery = { 'q-3': '1', 'q-4': '1', 'q-5': '0' };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        showEmployment05: true,
      });
    });

    it('should show package 05 when not sure about pension contributions (q-4=2)', () => {
      const data: DataFromQuery = { 'q-3': '1', 'q-4': '2', 'q-5': '2' };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        showEmployment05: true,
      });
    });
  });

  describe('not employed (q-3=2) and pays into pension (q-4=0)', () => {
    it.each([
      ['DC only (q-5=0)', '0', { showEmployment06: true }],
      ['not sure about pension type (q-5=4)', '4', { showEmployment06: true }],
      ['combination without DB (q-5=0,3)', '0,3', { showEmployment06: true }],
      ['DB only (q-5=1)', '1', {}],
    ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
      const data: DataFromQuery = { 'q-3': '2', 'q-4': '0', 'q-5': q5 };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        ...outcomeOverrides,
      });
    });
  });

  describe('not employed (q-3=2) and does not pay into pension', () => {
    it('should show package 07 when not paying into pension (q-4=1)', () => {
      const data: DataFromQuery = { 'q-3': '2', 'q-4': '1', 'q-5': '2' };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        showEmployment07: true,
      });
    });

    it('should show package 07 when not sure about pension contributions (q-4=2)', () => {
      const data: DataFromQuery = { 'q-3': '2', 'q-4': '2', 'q-5': '0' };
      expect(getEmploymentOutcome(data)).toEqual({
        ...noGuidance,
        showEmployment07: true,
      });
    });
  });

  describe('edge cases', () => {
    it('should return no guidance when employment status is not set', () => {
      const data: DataFromQuery = { 'q-4': '0', 'q-5': '0' };
      expect(getEmploymentOutcome(data)).toEqual(noGuidance);
    });

    it('should return no guidance when all answers are undefined', () => {
      const data: DataFromQuery = {};
      expect(getEmploymentOutcome(data)).toEqual(noGuidance);
    });
  });
});

// q-2: 0=lessThan10Years, 1=moreThan10Years, 2=alreadyRetired
// q-5: 0=DC, 1=DB, 2=StatePension, 3=Other, 4=NotSure
// q-9: 0=rentPrivate, 1=rentSocial, 2=mortgage, 3=none

describe('getHousingOutcome', () => {
  const noHousing = {
    showHousing09: false,
    showHousing09a: false,
    showHousing10: false,
    showHousing10a: false,
    showHousing11: false,
    showHousing12: false,
    showHousing12a: false,
    showHousing13: false,
    showHousing14: false,
    showHousing14a: false,
    showHousing14b: false,
    showHousing15: false,
    showHousing15a: false,
    showHousing16: false,
    showHousing16a: false,
    showHousing16b: false,
  };

  describe('more than 10 years from retirement (q-2=1)', () => {
    describe('Rent – private landlord (q-9=0)', () => {
      it.each([
        ['State Pension only (q-5=2)', '2', { showHousing15a: true }],
        ['DC only (q-5=0)', '0', { showHousing15: true }],
        ['DB only (q-5=1)', '1', { showHousing15: true }],
        ['not sure (q-5=4)', '4', { showHousing15: true }],
        [
          'combination of pension types (q-5=0,2)',
          '0,2',
          { showHousing15: true },
        ],
      ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
        const data: DataFromQuery = { 'q-2': '1', 'q-5': q5, 'q-9': '0' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          ...outcomeOverrides,
        });
      });
    });

    describe('Rent – social housing (q-9=1)', () => {
      it('should show package 13 for any pension type (q-5=0)', () => {
        const data: DataFromQuery = { 'q-2': '1', 'q-5': '0', 'q-9': '1' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          showHousing13: true,
        });
      });

      it('should show package 13 for State Pension only (q-5=2)', () => {
        const data: DataFromQuery = { 'q-2': '1', 'q-5': '2', 'q-9': '1' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          showHousing13: true,
        });
      });
    });

    describe('Mortgage (q-9=2)', () => {
      it('should show package 11 for any pension type (q-5=0)', () => {
        const data: DataFromQuery = { 'q-2': '1', 'q-5': '0', 'q-9': '2' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          showHousing11: true,
        });
      });

      it('should show package 11 for State Pension only (q-5=2)', () => {
        const data: DataFromQuery = { 'q-2': '1', 'q-5': '2', 'q-9': '2' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          showHousing11: true,
        });
      });
    });

    describe('None (q-9=3)', () => {
      it.each([
        ['State Pension only (q-5=2)', '2', { showHousing09a: true }],
        ['DC only (q-5=0)', '0', { showHousing09: true }],
        ['not sure (q-5=4)', '4', { showHousing09: true }],
        [
          'combination of pension types (q-5=0,1)',
          '0,1',
          { showHousing09: true },
        ],
      ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
        const data: DataFromQuery = { 'q-2': '1', 'q-5': q5, 'q-9': '3' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          ...outcomeOverrides,
        });
      });
    });
  });

  describe('less than 10 years from retirement (q-2=0)', () => {
    describe('Rent – private landlord (q-9=0)', () => {
      it.each([
        ['State Pension only (q-5=2)', '2', { showHousing16b: true }],
        ['DB only (q-5=1)', '1', { showHousing16a: true }],
        [
          'DB in combination with DC (q-5=0,1)',
          '0,1',
          { showHousing16a: true },
        ],
        [
          'DB in combination with State Pension (q-5=1,2)',
          '1,2',
          { showHousing16a: true },
        ],
        ['DC only (q-5=0)', '0', { showHousing16: true }],
        ['not sure (q-5=4)', '4', { showHousing16: true }],
        ['combination without DB (q-5=0,2)', '0,2', { showHousing16: true }],
      ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
        const data: DataFromQuery = { 'q-2': '0', 'q-5': q5, 'q-9': '0' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          ...outcomeOverrides,
        });
      });
    });

    describe('Rent – social housing (q-9=1)', () => {
      it.each([
        ['State Pension only (q-5=2)', '2', { showHousing14a: true }],
        ['DB only (q-5=1)', '1', { showHousing14b: true }],
        ['DB in combination (q-5=1,2)', '1,2', { showHousing14b: true }],
        ['DC only (q-5=0)', '0', { showHousing14: true }],
        ['not sure (q-5=4)', '4', { showHousing14: true }],
        ['combination without DB (q-5=0,2)', '0,2', { showHousing14: true }],
      ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
        const data: DataFromQuery = { 'q-2': '0', 'q-5': q5, 'q-9': '1' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          ...outcomeOverrides,
        });
      });
    });

    describe('Mortgage (q-9=2)', () => {
      it.each([
        ['State Pension only (q-5=2)', '2', { showHousing12a: true }],
        ['DC only (q-5=0)', '0', { showHousing12: true }],
        ['not sure (q-5=4)', '4', { showHousing12: true }],
        ['combination (q-5=0,1)', '0,1', { showHousing12: true }],
      ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
        const data: DataFromQuery = { 'q-2': '0', 'q-5': q5, 'q-9': '2' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          ...outcomeOverrides,
        });
      });
    });

    describe('None (q-9=3)', () => {
      it.each([
        ['State Pension only (q-5=2)', '2', { showHousing10a: true }],
        ['DC only (q-5=0)', '0', { showHousing10: true }],
        ['not sure (q-5=4)', '4', { showHousing10: true }],
        ['combination (q-5=0,2)', '0,2', { showHousing10: true }],
      ])('should show correct package when %s', (_, q5, outcomeOverrides) => {
        const data: DataFromQuery = { 'q-2': '0', 'q-5': q5, 'q-9': '3' };
        expect(getHousingOutcome(data)).toEqual({
          ...noHousing,
          ...outcomeOverrides,
        });
      });
    });
  });

  describe('already retired (q-2=2) – same packages as less than 10 years', () => {
    it.each([
      ['rent private + State Pension only', '2', '0', { showHousing16b: true }],
      ['rent private + DB only', '1', '0', { showHousing16a: true }],
      ['rent social + State Pension only', '2', '1', { showHousing14a: true }],
      ['mortgage + State Pension only', '2', '2', { showHousing12a: true }],
      ['none/other + State Pension only', '2', '3', { showHousing10a: true }],
    ])('should show correct package for %s', (_, q5, q9, outcomeOverrides) => {
      const data: DataFromQuery = { 'q-2': '2', 'q-5': q5, 'q-9': q9 };
      expect(getHousingOutcome(data)).toEqual({
        ...noHousing,
        ...outcomeOverrides,
      });
    });
  });

  describe('edge cases', () => {
    it('should return no housing guidance when retirement status is not set', () => {
      const data: DataFromQuery = { 'q-5': '0', 'q-9': '2' };
      expect(getHousingOutcome(data)).toEqual(noHousing);
    });

    it('should return no housing guidance when housing cost answer is not set', () => {
      const data: DataFromQuery = { 'q-2': '0', 'q-5': '0' };
      expect(getHousingOutcome(data)).toEqual(noHousing);
    });

    it('should return no housing guidance when all answers are undefined', () => {
      const data: DataFromQuery = {};
      expect(getHousingOutcome(data)).toEqual(noHousing);
    });
  });
});
