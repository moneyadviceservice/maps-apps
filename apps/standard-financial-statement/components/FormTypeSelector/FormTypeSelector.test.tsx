import { FormFlowType } from 'data/form-data/org_signup';
import { render } from '@testing-library/react';

import { FormTypeSelector } from './FormTypeSelector';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

describe('FormTypeSelector', () => {
  it('renders correctly as new org', () => {
    const { container } = render(
      <FormTypeSelector flow={FormFlowType.NEW_ORG} onChange={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });
});
