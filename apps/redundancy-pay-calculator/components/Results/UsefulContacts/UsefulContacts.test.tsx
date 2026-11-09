import { render, screen } from '@testing-library/react';
import { UsefulContacts } from './UsefulContacts';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    z: (key: { en: string; cy: string }) => key.en,
  })),
}));

jest.mock('../../../data/form-content/text/results', () => ({
  usefulContacts: jest.fn(() => ({
    1: { title: 'Contact 1', intro: 'Intro 1', items: ['Item 1a', 'Item 1b'] },
    2: { title: 'Contact 2', intro: 'Intro 2', items: ['Item 2a', 'Item 2b'] },
    3: { title: 'Contact 3', intro: 'Intro 3', items: ['Item 3a', 'Item 3b'] },
    4: { title: 'Contact 4', intro: 'Intro 4', items: ['Item 4a', 'Item 4b'] },
    5: { title: 'Contact 5', intro: 'Intro 5', items: ['Item 5a', 'Item 5b'] },
    6: { title: 'Contact 6', intro: 'Intro 6', items: ['Item 6a', 'Item 6b'] },
    9: { title: 'Contact 9', intro: 'Intro 9', items: ['Item 9a', 'Item 9b'] },
    10: {
      title: 'Contact 10',
      intro: 'Intro 10',
      items: ['Item 10a', 'Item 10b'],
    },
  })),
}));

describe('UsefulContacts Component', () => {
  it('should render the correct title in English', () => {
    render(<UsefulContacts country={0} />);

    expect(screen.getByText('Useful contacts')).toBeInTheDocument();
  });

  it('should render sections based on the country prop', () => {
    render(<UsefulContacts country={1} />); // Pass country as 1 for Scotland

    // Checking if correct sections are rendered based on contactsMap[1] (Scotland)
    expect(screen.getByText('Contact 1')).toBeInTheDocument();
    expect(screen.getByText('Contact 2')).toBeInTheDocument();
    expect(screen.getByText('Contact 3')).toBeInTheDocument();
    expect(screen.getByText('Contact 4')).toBeInTheDocument();
    expect(screen.getByText('Contact 5')).toBeInTheDocument();
    expect(screen.getByText('Contact 6')).toBeInTheDocument();
    expect(screen.getByText('Contact 9')).toBeInTheDocument();
    expect(screen.getByText('Contact 10')).toBeInTheDocument();
  });

  it('should render list items correctly for each contact', () => {
    render(<UsefulContacts country={0} />);

    expect(screen.getByText('Item 1a')).toBeInTheDocument();
    expect(screen.getByText('Item 1b')).toBeInTheDocument();
    expect(screen.getByText('Item 2a')).toBeInTheDocument();
    expect(screen.getByText('Item 2b')).toBeInTheDocument();
  });

  it('should render title in Welsh when translated', () => {
    // Change mock translation function to return Welsh
    (useTranslation as jest.Mock).mockReturnValueOnce({
      z: (key: { en: string; cy: string }) => key.cy,
    });

    render(<UsefulContacts country={0} />);

    expect(screen.getByText('Cysylltiadau defnyddiol')).toBeInTheDocument();
  });
});
