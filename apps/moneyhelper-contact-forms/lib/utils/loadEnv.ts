export const loadEnv = () => {
  // Extract and validate required environment variables
  const name = process.env.STORE_NAME;

  if (!name) {
    throw new Error('Missing required environment variable: STORE_NAME');
  }

  return { name };
};
