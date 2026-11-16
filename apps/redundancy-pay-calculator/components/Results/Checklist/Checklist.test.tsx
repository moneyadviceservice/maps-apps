import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Checklist } from './Checklist';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn((obj) => obj.en),
  }),
}));

describe('Redundancy pay calculator', () => {
  describe('AdditionalInfo Component', () => {
    it('Render correctly', () => {
      const { container } = render(
        <Checklist
          title="Checklist"
          items={[
            <>item 1</>,
            <>item 2</>,
            <>item 3</>,
            <>item 4</>,
            <>item 5</>,
          ]}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
