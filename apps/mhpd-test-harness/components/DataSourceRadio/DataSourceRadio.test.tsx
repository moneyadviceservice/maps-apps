import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataSourceRadio } from './DataSourceRadio';

describe('DataSourceRadio Component', () => {
  const mockProps = {
    redirect: '/redirect-url',
    scenariosComposerDev: [
      { displayValue: 'Dev Scenario 1', requestValue: 'dev1' },
      { displayValue: 'Dev Scenario 2', requestValue: 'dev2' },
    ],
    scenariosComposerTest: [
      { displayValue: 'Test Scenario 1', requestValue: 'test1' },
      { displayValue: 'Test Scenario 2', requestValue: 'test2' },
    ],
    scenariosComposerStaging: [
      { displayValue: 'Staging Scenario 1', requestValue: 'staging1' },
      { displayValue: 'Staging Scenario 2', requestValue: 'staging2' },
    ],
    backEndError: '',
  };

  it('should render radio buttons and default to composerDev', () => {
    render(<DataSourceRadio {...mockProps} />);
    const devRadioLabel = screen.getByTestId('radio-label-1');
    const testRadioLabel = screen.getByTestId('radio-label-2');
    expect(devRadioLabel.innerHTML).toContain('Dev');
    expect(testRadioLabel.innerHTML).toContain('Test');

    const defaultRadio = screen.getByTestId('radio-1');
    expect(defaultRadio).toBeChecked();
  });

  it('should switch scenarios when a different radio button is selected', () => {
    render(<DataSourceRadio {...mockProps} />);

    const testRadio = screen.getByTestId('radio-2');
    fireEvent.click(testRadio);

    expect(testRadio).toBeChecked();
    expect(screen.getByText('Test Scenario 1')).toBeInTheDocument();
    expect(screen.getByText('Test Scenario 2')).toBeInTheDocument();
  });

  it('should render the correct options in the dropdown based on selected radio (test)', () => {
    render(<DataSourceRadio {...mockProps} />);

    const testRadio = screen.getByTestId('radio-2');
    fireEvent.click(testRadio);

    const dropdown = screen.getByLabelText('Choose an option:');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText('Test Scenario 1')).toBeInTheDocument();
    expect(screen.getByText('Test Scenario 2')).toBeInTheDocument();
  });

  it('should render the correct options in the dropdown based on selected radio (staging)', () => {
    render(<DataSourceRadio {...mockProps} />);

    const stagingRadio = screen.getByTestId('radio-3');
    fireEvent.click(stagingRadio);

    const dropdown = screen.getByLabelText('Choose an option:');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText('Staging Scenario 1')).toBeInTheDocument();
    expect(screen.getByText('Staging Scenario 2')).toBeInTheDocument();
  });

  it('should not render the form if backEndError is present', () => {
    const errorProps = { ...mockProps, backEndError: 'Some error occurred' };
    render(<DataSourceRadio {...errorProps} />);

    expect(
      screen.queryByText('Choose a source for the list of scenarios'),
    ).not.toBeInTheDocument();
  });
});
