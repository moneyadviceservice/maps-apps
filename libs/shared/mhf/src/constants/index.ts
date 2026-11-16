/******** ENUMS *********/
export enum SubmissionState {
  IDLE = 'idle',
  IN_PROGRESS = 'in_progress',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export enum ResponseMessage {
  GENERIC_ERROR = '103',
  SUBMISSION_FAILED = '104',
  FORM_HANDLER_ERROR = '105',
}

/********* CONSTANTS *********/
export const NEXT_STEP_VALUE_DELIMITER = '|';
export const SESSION_TTL_SECONDS = 3600;
