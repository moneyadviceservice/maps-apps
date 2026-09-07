import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  FormContextProvider,
  useFormContext,
  type FormContextType,
} from './FormContextProvider';

const mockHandleSaveAndComeBack = jest.fn(() => Promise.resolve());

const mockFormContextProviderProps: FormContextType = {
  handleSaveAndComeBack: mockHandleSaveAndComeBack,
  enabledTabCount: 1,
};

describe('test FormContextProvider', () => {
  it('provides the context to consumers', async () => {
    const user = userEvent.setup();

    const TestConsumer = () => {
      const { handleSaveAndComeBack, enabledTabCount } = useFormContext();

      return (
        <div>
          <div data-testid="enabled-tab-count">{enabledTabCount}</div>
          <button onClick={handleSaveAndComeBack} />
        </div>
      );
    };

    render(
      <FormContextProvider {...mockFormContextProviderProps}>
        <TestConsumer />
      </FormContextProvider>,
    );

    // Check that the enabledTabCount from context is rendered
    expect(screen.getByTestId('enabled-tab-count')).toHaveTextContent('1');

    // Check that handleSaveAndComeBack is called when button is clicked
    await user.click(screen.getByRole('button'));
    expect(mockHandleSaveAndComeBack).toHaveBeenCalledTimes(1);
  });

  it('renders children correctly', () => {
    render(
      <FormContextProvider {...mockFormContextProviderProps}>
        <div data-testid="child">child content</div>
      </FormContextProvider>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('child content');
  });

  it('throws an error when context is used outside of provider', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const OutsideConsumer = () => {
      // This should throw during render because there's no provider
      useFormContext();
      return null;
    };

    try {
      expect(() => render(<OutsideConsumer />)).toThrow(
        'useFormContext must be within a FormContext provider',
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
