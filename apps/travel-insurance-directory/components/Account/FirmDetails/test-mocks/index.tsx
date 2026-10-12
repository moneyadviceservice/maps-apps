export const mockUseRouter = {
  useRouter: () => ({
    push: jest.fn(),
  }),
};

export const mockUseErrorSummary = {
  useErrorSummary: () => ({
    setFormSummaryErrors: jest.fn(),
  }),
};

export const mockSubmitHandler = jest.fn((...args: unknown[]) => jest.fn());

export const mockCreateSubmitHandler = {
  createSubmitHandler: (...args: unknown[]) => mockSubmitHandler(...args),
};
