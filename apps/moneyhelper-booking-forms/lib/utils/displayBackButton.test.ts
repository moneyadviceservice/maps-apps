import { mockEntry } from '@maps-react/mhf/mocks';

import { displayBackButton } from './displayBackButton';

describe('displayBackButton', () => {
  it('returns false when hideBackStep is true', () => {
    const result = displayBackButton(true, false, mockEntry);
    expect(result).toBe(false);
  });

  it('returns false when hideBackStepInEditMode is true and entry.editMode is true', () => {
    const result = displayBackButton(false, true, {
      ...mockEntry,
      editMode: true,
    });
    expect(result).toBe(false);
  });

  it('returns true when hideBackStep is false and hideBackStepInEditMode is false', () => {
    const result = displayBackButton(false, false, mockEntry);
    expect(result).toBe(true);
  });

  it('returns true when hideBackStepInEditMode is true but entry.editMode is false', () => {
    const result = displayBackButton(false, true, {
      ...mockEntry,
      editMode: false,
    });
    expect(result).toBe(true);
  });
});
