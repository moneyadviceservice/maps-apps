import { render, screen } from '@testing-library/react';

import { RBPInformationCallout } from './RBPInformationCallout';

import '@testing-library/jest-dom';

describe('test RBPInformationCallout component', () => {
  it('should render the component', () => {
    render(<RBPInformationCallout />);
    expect(screen).toMatchSnapshot();
    expect(
      screen.getByText('Need more information on pensions?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Our help is impartial and free to use, whether that’s online or over the phone.',
      ),
    ).toBeInTheDocument();
  });
});
