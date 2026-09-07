export async function register() {
  // Only run this if we are in the CI/Test environment
  if (process.env.CI === 'true') {
    // Ensure we only intercept the Node.js server environment, not the Edge runtime
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { server } = await import('pages/api/mocks/server');

      server.listen({ onUnhandledRequest: 'bypass' });
      console.log('🔶 MSW Server successfully started');
    }
  }
}
