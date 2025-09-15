import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { TextArea } from './TextArea';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  return jest.fn(() => ({
    z: (t: { en: string; cy: string }) => t.en,
  }));
});

const textAreaId = 'test-textarea';

describe('TextArea Component', () => {
  it('renders with a label', () => {
    const { container } = render(
      <TextArea label="Test Label" id={textAreaId} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a hint', () => {
    const { container } = render(
      <TextArea hint="This is a hint" id={textAreaId} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with an error message', () => {
    const { container } = render(
      <TextArea error="This is an error" id={textAreaId} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with both hint and error message', () => {
    const { container } = render(
      <TextArea
        hint="This is a hint"
        error="This is an error"
        id={textAreaId}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a character counter', () => {
    const { container } = render(
      <TextArea hasCharacterCounter={true} maxLength={100} id={textAreaId} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('updates the character counter as the user types', () => {
    const { container } = render(
      <TextArea hasCharacterCounter={true} maxLength={100} id={textAreaId} />,
    );

    const textArea = container.querySelector('textarea');
    if (textArea) {
      fireEvent.change(textArea, { target: { value: 'Hello' } });
    }

    expect(container).toHaveTextContent('You have 95 characters remaining.');
  });

  it('renders with a default value', () => {
    const { container } = render(
      <TextArea defaultValue="Default Value" id={textAreaId} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
