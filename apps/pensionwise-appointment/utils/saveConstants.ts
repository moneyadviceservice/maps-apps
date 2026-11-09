//Create separate file for this enum because having it constants.ts was failing the build
export enum SAVE_PAGE_OPTIONS {
  SAVE_AND_RETURN = 'save',
  GET_NEXT_STEPS = 'get-next-steps',
}

export enum PROGRESS_SAVED_PAGES {
  PROGRESS_SAVED = 'saved',
  NEXT_STEPS = 'saved-next-steps',
}
