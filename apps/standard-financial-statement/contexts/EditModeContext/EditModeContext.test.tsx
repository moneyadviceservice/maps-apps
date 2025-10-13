import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import { ToggleEditProvider, useEditMode } from './EditModeContext';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    asPath: '/test-path',
  }),
}));

jest.mock(
  '../../utils/organisations/formatFormObjects/organisationFormObject',
  () => ({
    organisationFormObject: jest.fn(() => ({ name: 'Mock Org' })),
  }),
);

const mockFetch = jest.fn();
global.fetch = mockFetch;

const TestComponent = () => {
  const { isEditMode, setIsEditMode, handleCancel } = useEditMode();
  return (
    <div>
      <div data-testid="edit-mode-status">
        {isEditMode ? 'Edit Mode' : 'View Mode'}
      </div>
      <button onClick={() => setIsEditMode(true)}>Enable Edit Mode</button>
      <button onClick={handleCancel}>Cancel</button>

      <input name="orgName" defaultValue="Test Org" />
      <button type="submit">Save</button>
    </div>
  );
};

const setup = (licence_number?: string) =>
  render(
    <ToggleEditProvider licence_number={licence_number}>
      <TestComponent />
    </ToggleEditProvider>,
  );

describe('EditModeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when used outside of provider', () => {
    const ErrorComponent = () => {
      useEditMode();
      return <div>Test</div>;
    };

    expect(() => render(<ErrorComponent />)).toThrow(
      'useEditMode must be used within ToggleEditMode',
    );
  });

  it('should toggle edit mode and cancel mode correctly', () => {
    setup();

    expect(screen.getByTestId('edit-mode-status').textContent).toBe(
      'View Mode',
    );

    act(() => {
      screen.getByText('Enable Edit Mode').click();
    });

    expect(screen.getByTestId('edit-mode-status').textContent).toBe(
      'Edit Mode',
    );

    act(() => {
      screen.getByText('Cancel').click();
    });

    expect(screen.getByTestId('edit-mode-status').textContent).toBe(
      'View Mode',
    );
  });

  it('should throw if licence_number is missing', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    setup();

    fireEvent.click(screen.getByText('Enable Edit Mode'));
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Submission error:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('submits the form and disables edit mode on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Updated' }),
    });

    setup('ABC123');

    fireEvent.click(screen.getByText('Enable Edit Mode'));
    expect(screen.getByText('Edit Mode')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/update-organisation',
        expect.any(Object),
      );
      expect(screen.getByText('View Mode')).toBeInTheDocument();
    });
  });

  it('logs error if API response is not ok', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Update failed' }),
    });

    setup('ABC123');

    fireEvent.click(screen.getByText('Enable Edit Mode'));
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Submission error:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
