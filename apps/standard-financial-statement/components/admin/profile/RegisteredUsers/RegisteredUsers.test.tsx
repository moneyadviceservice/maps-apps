import { fireEvent, render } from '@testing-library/react';

import { Organisation } from '../../../../types/Organisations';
import { baseMockData } from '../__tests__mocks/mock-data';
import { RegisteredUsers } from './RegisteredUsers';

import '@testing-library/jest-dom';

const mockData: Organisation = {
  ...baseMockData,
  id: '1',
  users: [
    {
      first_name: 'Zoe',
      last_name: 'Anderson',
      email: 'zoe@example.com',
      job_title: 'Engineer',
      join_date: '2023-03-10',
      last_login: '2024-04-01',
    },
    {
      first_name: 'Alice',
      last_name: 'Brown',
      email: 'alice@example.com',
      job_title: 'Designer',
      join_date: '2023-06-15',
      last_login: '2024-03-12',
    },
  ],
};

describe('RegisteredUsers', () => {
  it('renders user details correctly', () => {
    const { getAllByTestId } = render(<RegisteredUsers data={mockData} />);
    expect(getAllByTestId('user-first-name')[0]).toHaveTextContent('Alice');
    expect(getAllByTestId('user-email')[1]).toHaveTextContent(
      'zoe@example.com',
    );
    expect(getAllByTestId('user-job-title')[0]).toHaveTextContent('Designer');
  });

  it('sorts users by first name when header is clicked', () => {
    const { getAllByTestId, getByText } = render(
      <RegisteredUsers data={mockData} />,
    );

    const toggleButton = getByText(/First name/i);
    fireEvent.click(toggleButton);

    expect(getAllByTestId('user-first-name')[0]).toHaveTextContent('Zoe');
    expect(getAllByTestId('user-first-name')[1]).toHaveTextContent('Alice');
  });

  it('renders fallback row if no users are provided', () => {
    const emptyOrg = { ...mockData, users: [] };
    const { getByText } = render(<RegisteredUsers data={emptyOrg} />);
    expect(getByText('Test')).toBeInTheDocument();
    expect(getByText('example@email.com')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<RegisteredUsers data={mockData} />);
    expect(container).toMatchSnapshot();
  });
});
