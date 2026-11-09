import { fireEvent, render, screen } from '@testing-library/react';

import { TextArea } from './TextArea';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  return jest.fn(() => ({
    z: (t: { en: string; cy: string }) => t.en,
  }));
});
const textAreaLabel = 'Test Text Area';
const textAreaId = 'test-textarea';

describe('TextArea Component', () => {
  it('renders component', () => {
    const { container } = render(<TextArea label={textAreaLabel} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a hint', () => {
    const { container } = render(
      <TextArea label={textAreaLabel} hint="This is a hint" id={textAreaId} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with an error message', () => {
    const { container } = render(
      <TextArea
        label={textAreaLabel}
        error="This is an error"
        id={textAreaId}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with both hint and error message', () => {
    const { container } = render(
      <TextArea
        label={textAreaLabel}
        hint="This is a hint"
        error="This is an error"
        id={textAreaId}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with a character counter', () => {
    const { container } = render(
      <TextArea
        label={textAreaLabel}
        hasCharacterCounter={true}
        maxLength={100}
        id={textAreaId}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('associates character limit text with the textarea', () => {
    render(
      <TextArea
        label={textAreaLabel}
        characterLimitText="Write at least 50 characters, up to a maximum of 4,000 characters"
        id={textAreaId}
      />,
    );

    const textArea = screen.getByRole('textbox', { name: textAreaLabel });
    expect(screen.getByText(/Write at least 50 characters/)).toHaveAttribute(
      'id',
      `${textAreaId}-character-limit-text`,
    );
    expect(textArea).toHaveAttribute(
      'aria-describedby',
      `${textAreaId}-character-limit-text`,
    );
  });

  it('updates the character counter as the user types', () => {
    const { container } = render(
      <TextArea
        label={textAreaLabel}
        hasCharacterCounter={true}
        maxLength={100}
        id={textAreaId}
      />,
    );

    const textArea = container.querySelector('textarea');
    if (textArea) {
      fireEvent.change(textArea, { target: { value: 'Hello' } });
    }

    expect(container).toHaveTextContent('You have 95 characters remaining.');
  });

  it('renders with a default value', () => {
    const { container } = render(
      <TextArea
        label={textAreaLabel}
        defaultValue="Default Value"
        id={textAreaId}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with glassbox class when hasGlassBoxClass is true', () => {
    const { container } = render(
      <TextArea
        label={textAreaLabel}
        id={textAreaId}
        hasGlassBoxClass={true}
      />,
    );
    const textArea = container.querySelector('textarea');
    expect(textArea).toHaveClass('obfuscate');
  });

  it('does not apply top margin when hideLabel is true and no hint or error is present', () => {
    const { container } = render(
      <TextArea label={textAreaLabel} id={textAreaId} hideLabel={true} />,
    );
    const textArea = container.querySelector('textarea');
    expect(textArea).not.toHaveClass('mt-2');
  });

  it('wraps content in Errors component when error is present and hasErrorWrapper is set true', () => {
    const { container } = render(
      <TextArea
        label={textAreaLabel}
        id={textAreaId}
        error="This is an error"
        hasErrorWrapper={true}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
