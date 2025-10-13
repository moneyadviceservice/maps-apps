export const QUESTION_PREFIX = 'q-';
export const TOOL_BASE_PATH = '';
export const PATHS = {
  LOGIN: `${TOOL_BASE_PATH}login`,
  START: `${TOOL_BASE_PATH}start`,
  ONLINE: `${TOOL_BASE_PATH}online`,
  TELEPHONE: `${TOOL_BASE_PATH}telephone`,
  FACE: `${TOOL_BASE_PATH}in-person`,
};
export const PAGES = {
  MONEY_MANAGEMENT_REFER: `money-management-refer`,
  DEBT_ADVICE_LOCATOR: `debt-advice-locator`,
  BUSINESS_DEBTLINE_REFER: `business-debtline-refer`,
  CONFIRM_ANSWERS: `confirm-answers`,
  DETAILS_SENT: `details-sent`,
  CONSENT_REJECTED: `consent-rejected`,
  CALL_SCHEDULED: 'call-scheduled',
  IMMEDIATE_CONFIRMATION: 'call-confirmation',
  START: 'q-1',
};
export const APIS = {
  LOGOUT: 'api/logout',
  SUBMIT_ANSWER: 'api/submit-answer',
  CHANGE_ANSWER: 'api/change-answer',
  GET_APPOINMENTS: 'api/get-appointment-slots',
  SUBMIT_TELEPHONE_FLOW: 'api/submit-flow',
  SUBMIT_ONLINE_FLOW: 'api/submit-flow',
  RESTART_TOOL: 'api/restart-tool',
};
