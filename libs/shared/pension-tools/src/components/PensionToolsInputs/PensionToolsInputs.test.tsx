import { fireEvent, render } from '@testing-library/react';

import {
  mockerrors,
  mockQuestions,
} from '../PensionPotCalculator/mockTestData';
import { PensionToolsInputs } from './PensionToolsInputs';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

describe('PensionToolsInputs', () => {
  it('should render an input fields with label, description, error message and values successfully ', () => {
    mockQuestions.forEach((question) => {
      const { container } = render(
        <PensionToolsInputs
          field={question}
          errors={mockerrors}
          queryData={{
            pot: '1000',
            age: '30',
          }}
          isAllowed={function ({ floatValue }): boolean {
            return !!floatValue && floatValue > 0;
          }}
          value={''}
          onChange={jest.fn()}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render an input pot fields successfully without any value and enter value', () => {
    mockQuestions.forEach((question) => {
      const { container } = render(
        <PensionToolsInputs
          field={question}
          errors={mockerrors}
          queryData={{
            pot: '1000',
            age: '30',
          }}
          isAllowed={function ({ floatValue }): boolean {
            return !!floatValue && floatValue > 0;
          }}
          value={''}
          onChange={jest.fn()}
        />,
      );

      fireEvent.change(container.querySelector('input') as Element, {
        target: { value: '1000' },
      });

      expect(container).toMatchSnapshot();
    });
  });
});
