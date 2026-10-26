import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ProsConsCards } from './ProsConsCards';

const prosTitle = 'Pros';
const consTitle = 'Cons';
const pros = ['Pro 1', 'Pro 2', 'Pro 3'];
const cons = ['Con 1', 'Con 2'];

describe('ProsConsCards component', () => {
  it('renders pros and cons correctly', () => {
    const { getByText } = render(
      <ProsConsCards
        prosTitle={prosTitle}
        consTitle={consTitle}
        pros={pros}
        cons={cons}
      />,
    );

    const prosTitleElement = getByText(prosTitle);
    expect(prosTitleElement).toBeInTheDocument();

    const consTitleElement = getByText(consTitle);
    expect(consTitleElement).toBeInTheDocument();

    pros.forEach((pro) => {
      const proElement = getByText(pro);
      expect(proElement).toBeInTheDocument();
    });

    cons.forEach((con) => {
      const conElement = getByText(con);
      expect(conElement).toBeInTheDocument();
    });
  });
});
