export const saveAndComeBackData = (sessionId: string) => ({
  email: 'test@example.com',
  returnTo: `/en/your-income?sessionId=${sessionId}`,
});
