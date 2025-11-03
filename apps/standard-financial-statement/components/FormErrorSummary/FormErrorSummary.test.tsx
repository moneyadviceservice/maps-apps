import { FormType } from 'data/form-data/org_signup';
import { render } from '@testing-library/react';

import { FormErrorSummary } from './FormErrorSummary';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

describe('FormErrorSummary', () => {
  it('renders correctly as new org', () => {
    const { container } = render(
      <FormErrorSummary
        formMode={FormType.NEW_ORG}
        activeErrors={{
          newForm: {},
          existingForm: {},
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
