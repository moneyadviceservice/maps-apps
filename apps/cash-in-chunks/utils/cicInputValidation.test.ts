import {
  cashInChunksCalculatorErrors,
  isInputAllowed,
} from './cicInputValidation';

const mockErrorObject = {
  income: { field: 'income', type: 'required' },
  pot: { field: 'pot', type: 'required' },
  chunk: { field: 'chunk', type: 'required' },
};

describe('cicInputValidation', () => {
  it('should return all required fields and the type of error', () => {
    const errors = cashInChunksCalculatorErrors(mockErrorObject, {
      income: '40000',
      pot: '10000',
      chunk: '1000',
    });

    expect(errors).toEqual({
      income: { field: 'income', type: 'required' },
      pot: { field: 'pot', type: 'required' },
      chunk: { field: 'chunk', type: 'required' },
    });
  });

  it('should return chunk error object with type max', () => {
    const errors = cashInChunksCalculatorErrors(mockErrorObject, {
      income: '40000',
      pot: '100',
      chunk: '1000',
    });

    expect(errors).toEqual({
      income: { field: 'income', type: 'required' },
      pot: { field: 'pot', type: 'required' },
      chunk: { field: 'chunk', type: 'max' },
    });
  });

  it('should return chunk error object with type max when updatedChunk is less than the pot', () => {
    const errors = cashInChunksCalculatorErrors(mockErrorObject, {
      income: '40000',
      pot: '100',
      chunk: '10',
      updateChunk: '2200',
    });

    expect(errors).toEqual({
      income: { field: 'income', type: 'required' },
      pot: { field: 'pot', type: 'required' },
      chunk: { field: 'chunk', type: 'max' },
    });
  });

  it('should delete chunk and update chunk if both are 0', () => {
    const errors = cashInChunksCalculatorErrors(mockErrorObject, {
      income: '40000',
      pot: '100',
      chunk: '0',
      updateChunk: '0',
    });

    expect(errors).toEqual({
      income: { field: 'income', type: 'required' },
      pot: { field: 'pot', type: 'required' },
    });
  });

  it('should validate input field so it does not exceed the pot', () => {
    const isAllowed = isInputAllowed(
      { floatValue: 100 },
      { type: 'updateChunk' },
      { pot: '1000' },
    );
    expect(isAllowed).toBe(true);
  });

  it('should return true if it is not the updateChunk input', () => {
    const isAllowed = isInputAllowed(
      { floatValue: 100 },
      { type: 'chunk' },
      { pot: '1000' },
    );
    expect(isAllowed).toBe(true);
  });

  it('should return false if updateChunk exceeds the pot', () => {
    const isAllowed = isInputAllowed(
      { floatValue: 2000 },
      { type: 'updateChunk' },
      { pot: '1000' },
    );
    expect(isAllowed).toBe(false);
  });
});
