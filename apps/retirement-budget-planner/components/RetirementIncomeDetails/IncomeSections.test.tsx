import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IncomeSections } from './IncomeSections';
import { RetirementFieldTypes } from 'lib/types/page.type';
import { FREQUENCY_KEYS } from 'lib/constants/pageConstants';

jest.mock('@maps-react/hooks/useTranslation', () => {
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => key,
      z: (translations: Record<string, string>) => translations.en,
      locale: 'en',
    }),
  };
});

const mockHandleFieldChange = jest.fn();
const mockHandleRemoveItem = jest.fn();
const mockHandleFocusOut = jest.fn();
const mockHandleAddItem = jest.fn();

const defaultProps = {
  sections: [] as RetirementFieldTypes[],
  sectionIndex: 0,
  data: {},
  sessionId: 'test-session-id',
  addButtonLabel: 'Add item',
  removeButtonLabel: 'Remove',
  handleFieldChange: mockHandleFieldChange,
  handleRemoveItem: mockHandleRemoveItem,
  sectionName: 'testSection',
  handleFocusOut: mockHandleFocusOut,
  handleAddItem: mockHandleAddItem,
};

const createMockSection = (
  isDynamic = false,
  itemCount = 1,
): RetirementFieldTypes[] => {
  const items = Array.from({ length: itemCount }, (_, i) => ({
    index: i,
    moneyInputName: `testMoney${i}`,
    frequencyName: `testFrequency${i}`,
    defaultFrequency: FREQUENCY_KEYS.MONTH,
    labelText: `Test Label ${i + 1}`,
    enableRemove: i > 0,
  }));

  return [
    {
      sectionName: 'testSection',
      fields: [
        {
          field: 'testField',
          isDynamic,
          items,
          maxItems: 5,
        },
      ],
    },
  ];
};

describe('IncomeSections', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render empty when no sections provided', () => {
      const { container } = render(<IncomeSections {...defaultProps} />);
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it('should render sections with items', () => {
      const sections = createMockSection(false, 2);
      render(<IncomeSections {...defaultProps} sections={sections} />);

      expect(screen.getByText('Test Label 1')).toBeInTheDocument();
      expect(screen.getByText('Test Label 2')).toBeInTheDocument();
    });

    it('should render title and description when provided', () => {
      const sectionsWithTitle: RetirementFieldTypes[] = [
        {
          sectionName: 'testSection',
          fields: [
            {
              field: 'testField',
              isDynamic: false,
              title: 'Test Title',
              description: 'Test Description',
              items: [
                {
                  index: 0,
                  moneyInputName: 'testMoney',
                  frequencyName: 'testFrequency',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Test Label',
                },
              ],
            },
          ],
        },
      ];

      render(<IncomeSections {...defaultProps} sections={sectionsWithTitle} />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should render add button when isDynamic is true', () => {
      const sections = createMockSection(true, 1);
      render(<IncomeSections {...defaultProps} sections={sections} />);

      const addButton = screen.getByTestId('add-testField-button');
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveTextContent('Add item');
    });

    it('should not render add button when isDynamic is false', () => {
      const sections = createMockSection(false, 1);
      render(<IncomeSections {...defaultProps} sections={sections} />);

      const addButton = screen.queryByTestId('add-testField-button');
      expect(addButton).not.toBeInTheDocument();
    });

    it('should hide add button when max items reached', () => {
      const sections = createMockSection(true, 5);
      render(<IncomeSections {...defaultProps} sections={sections} />);

      const addButton = screen.getByTestId('add-testField-button');
      expect(addButton).toHaveClass('hidden');
    });

    it('should render remove button for items after the first one', () => {
      const sections = createMockSection(true, 3);
      render(<IncomeSections {...defaultProps} sections={sections} />);

      const removeButtons = screen.getAllByText('Remove');
      expect(removeButtons).toHaveLength(2); // Only for items 1 and 2, not item 0
    });
  });

  describe('Event Handlers', () => {
    it('should call handleAddItem when add button is clicked', () => {
      const sections = createMockSection(true, 1);
      render(<IncomeSections {...defaultProps} sections={sections} />);

      const addButton = screen.getByTestId('add-testField-button');
      fireEvent.click(addButton);

      expect(mockHandleAddItem).toHaveBeenCalledWith(
        expect.any(Object),
        'testSection',
        'testField',
        0,
      );
    });

    it('should have correct formAction on add button', () => {
      const sections = createMockSection(true, 1);
      render(<IncomeSections {...defaultProps} sections={sections} />);

      const addButton = screen.getByTestId('add-testField-button');
      expect(addButton).toHaveAttribute(
        'formaction',
        '/api/cache-to-memory?sectionName=testSection&sessionId=test-session-id&fieldName=testField&maxIndex=0',
      );
    });

    it('should call handleRemoveItem when remove button is clicked', () => {
      const sections = createMockSection(true, 2);
      render(<IncomeSections {...defaultProps} sections={sections} />);

      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);

      expect(mockHandleRemoveItem).toHaveBeenCalledWith(
        expect.any(Object),
        1,
        'testSection',
        'testField',
        undefined,
        'testFrequency1',
        'testMoney1',
      );
    });
  });

  describe('Auto-focus behavior', () => {
    it('should not focus any input on initial render', () => {
      render(
        <IncomeSections
          {...defaultProps}
          sections={createMockSection(true, 1)}
        />,
      );

      jest.runAllTimers();

      const firstInput = document.getElementById('testMoney0');
      expect(document.activeElement).not.toBe(firstInput);
    });

    it('should focus on newly added input field after add button click', async () => {
      const { rerender } = render(
        <IncomeSections
          {...defaultProps}
          sections={createMockSection(true, 1)}
        />,
      );

      fireEvent.click(screen.getByTestId('add-testField-button'));

      // Add a new item
      const sectionsWithNewItem = createMockSection(true, 2);
      rerender(
        <IncomeSections {...defaultProps} sections={sectionsWithNewItem} />,
      );

      // Fast-forward timers to trigger setTimeout
      jest.runAllTimers();

      await waitFor(() => {
        const newInput = document.getElementById('testMoney1');
        expect(newInput).toBe(document.activeElement);
      });
    });

    it('should focus on label input if it exists for newly added item after add button click', async () => {
      const sectionsWithLabelInput: RetirementFieldTypes[] = [
        {
          sectionName: 'testSection',
          fields: [
            {
              field: 'testField',
              isDynamic: true,
              items: [
                {
                  index: 0,
                  moneyInputName: 'testMoney0',
                  frequencyName: 'testFrequency0',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Test Label 1',
                },
                {
                  index: 1,
                  moneyInputName: 'testMoney1',
                  frequencyName: 'testFrequency1',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Test Label 2',
                  inputLabelName: 'testLabel1',
                  labelPlaceholder: 'Enter label',
                },
              ],
            },
          ],
        },
      ];

      const { rerender } = render(
        <IncomeSections
          {...defaultProps}
          sections={[
            {
              ...sectionsWithLabelInput[0],
              fields: [
                {
                  ...sectionsWithLabelInput[0].fields[0],
                  items: [sectionsWithLabelInput[0].fields[0].items[0]],
                },
              ],
            },
          ]}
        />,
      );

      fireEvent.click(screen.getByTestId('add-testField-button'));

      // Add new item with label input
      rerender(
        <IncomeSections {...defaultProps} sections={sectionsWithLabelInput} />,
      );

      // Fast-forward timers
      jest.runAllTimers();

      await waitFor(() => {
        const labelInput = document.getElementById('testLabel1');
        expect(labelInput).toBe(document.activeElement);
      });
    });

    it('should not focus on input when no new item was added', () => {
      // Start with 1 item
      const { rerender } = render(
        <IncomeSections
          {...defaultProps}
          sections={createMockSection(true, 1)}
        />,
      );

      fireEvent.click(screen.getByTestId('add-testField-button'));

      // Run timers to complete any focus operations from initial render
      jest.runAllTimers();

      // Add a second item
      const sectionsWithTwo = createMockSection(true, 2);
      rerender(<IncomeSections {...defaultProps} sections={sectionsWithTwo} />);

      // Run timers for the add operation
      jest.runAllTimers();

      // Clear the active element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // Re-render with same sections (no new items)
      rerender(<IncomeSections {...defaultProps} sections={sectionsWithTwo} />);

      // Run timers - no focus should happen
      jest.runAllTimers();

      // Neither of the money inputs should be focused after the last render
      const moneyInput0 = document.getElementById('testMoney0');
      const moneyInput1 = document.getElementById('testMoney1');
      expect(document.activeElement).not.toBe(moneyInput0);
      expect(document.activeElement).not.toBe(moneyInput1);
    });

    it('should handle multiple sections with different field names after add click', async () => {
      const multipleSections: RetirementFieldTypes[] = [
        {
          sectionName: 'section1',
          fields: [
            {
              field: 'field1',
              isDynamic: true,
              items: [
                {
                  index: 0,
                  moneyInputName: 'money1',
                  frequencyName: 'freq1',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Label 1',
                },
              ],
            },
          ],
        },
        {
          sectionName: 'section2',
          fields: [
            {
              field: 'field2',
              isDynamic: true,
              items: [
                {
                  index: 0,
                  moneyInputName: 'money2',
                  frequencyName: 'freq2',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Label 2',
                },
              ],
            },
          ],
        },
      ];

      const { rerender } = render(
        <IncomeSections {...defaultProps} sections={multipleSections} />,
      );

      fireEvent.click(screen.getAllByRole('button', { name: 'Add item' })[1]);

      // Add new item to second section
      const updatedSections: RetirementFieldTypes[] = [
        multipleSections[0],
        {
          ...multipleSections[1],
          fields: [
            {
              ...multipleSections[1].fields[0],
              items: [
                multipleSections[1].fields[0].items[0],
                {
                  index: 1,
                  moneyInputName: 'money2-new',
                  frequencyName: 'freq2-new',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Label 2 New',
                },
              ],
            },
          ],
        },
      ];

      rerender(<IncomeSections {...defaultProps} sections={updatedSections} />);

      jest.runAllTimers();

      await waitFor(() => {
        const newInput = document.getElementById('money2-new');
        expect(newInput).toBe(document.activeElement);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty fields array', () => {
      const sectionsWithEmptyFields: RetirementFieldTypes[] = [
        {
          sectionName: 'testSection',
          fields: [],
        },
      ];

      const { container } = render(
        <IncomeSections {...defaultProps} sections={sectionsWithEmptyFields} />,
      );
      expect(container.querySelector('.space-y-5')).toBeInTheDocument();
    });

    it('should handle null sessionId', () => {
      const sections = createMockSection(true, 1);
      render(
        <IncomeSections
          {...defaultProps}
          sessionId={null}
          sections={sections}
        />,
      );

      const addButton = screen.getByTestId('add-testField-button');
      expect(addButton).toHaveAttribute(
        'formaction',
        expect.stringContaining('sessionId=null'),
      );
    });

    it('should handle undefined addButtonLabel', () => {
      const sections = createMockSection(true, 1);
      render(
        <IncomeSections
          {...defaultProps}
          addButtonLabel={undefined}
          sections={sections}
        />,
      );

      const addButton = screen.getByTestId('add-testField-button');
      expect(addButton).toBeInTheDocument();
    });

    it('should calculate maxIndex correctly from items', () => {
      const sectionsWithMixedIndexes: RetirementFieldTypes[] = [
        {
          sectionName: 'testSection',
          fields: [
            {
              field: 'testField',
              isDynamic: true,
              items: [
                {
                  index: 0,
                  moneyInputName: 'testMoney0',
                  frequencyName: 'testFrequency0',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Test Label 1',
                },
                {
                  index: 5,
                  moneyInputName: 'testMoney5',
                  frequencyName: 'testFrequency5',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Test Label 2',
                },
                {
                  index: 3,
                  moneyInputName: 'testMoney3',
                  frequencyName: 'testFrequency3',
                  defaultFrequency: FREQUENCY_KEYS.MONTH,
                  labelText: 'Test Label 3',
                },
              ],
            },
          ],
        },
      ];

      render(
        <IncomeSections
          {...defaultProps}
          sections={sectionsWithMixedIndexes}
        />,
      );

      const addButton = screen.getByTestId('add-testField-button');
      fireEvent.click(addButton);

      expect(mockHandleAddItem).toHaveBeenCalledWith(
        expect.any(Object),
        'testSection',
        'testField',
        5, // Should be the max index (5)
      );
    });
  });
});
