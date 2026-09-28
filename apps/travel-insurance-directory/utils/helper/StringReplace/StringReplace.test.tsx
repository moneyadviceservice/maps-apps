import Link from 'next/link';

import { render, screen } from '@testing-library/react';

import { StringReplace } from './StringReplace';

import '@testing-library/jest-dom';

describe('StringReplace Component', () => {
  it('should replace a single placeholder with a React component', () => {
    const stringValue = 'Hello [link] world';
    const placeholder = '[link]';
    const replacePartValue = (
      <Link href="/test" data-testid="link-component">
        click here
      </Link>
    );

    render(
      <StringReplace
        stringValue={stringValue}
        placeholder={placeholder}
        replacePartValue={replacePartValue}
      />,
    );

    expect(screen.getByTestId('link-component')).toBeInTheDocument();
  });

  it('should render placeholder with class in a span when replacementClassName is provided', () => {
    const stringValue = 'My email is {email}';
    const placeholder = '{email}';
    const email = 'mytestemail@email.com';

    render(
      <StringReplace
        stringValue={stringValue}
        placeholder={placeholder}
        replacePartValue={email}
        replacementClassName="font-bold"
      />,
    );

    expect(screen.getByText(email)).toBeInTheDocument();
    expect(screen.getByText(email)).toHaveClass('font-bold');
  });

  it('should render the original string if placeholder is not found', () => {
    const stringValue = 'No placeholder here';
    const placeholder = '[missing]';

    render(
      <StringReplace
        stringValue={stringValue}
        placeholder={placeholder}
        replacePartValue={<span>Replaced</span>}
      />,
    );

    expect(screen.getByText('No placeholder here')).toBeInTheDocument();
    expect(screen.queryByText('Replaced')).not.toBeInTheDocument();
  });

  it('should handle placeholders at the very start or end of the string', () => {
    render(
      <>
        <div data-testid="start-test">
          <StringReplace
            stringValue="[target] End"
            placeholder="[target]"
            replacePartValue={<b>Start</b>}
          />
        </div>
        <div data-testid="end-test">
          <StringReplace
            stringValue="Start [target]"
            placeholder="[target]"
            replacePartValue={<b>End</b>}
          />
        </div>
      </>,
    );

    expect(screen.getByTestId('start-test')).toHaveTextContent('Start End');
    expect(screen.getByTestId('end-test')).toHaveTextContent('Start End');
  });
});
