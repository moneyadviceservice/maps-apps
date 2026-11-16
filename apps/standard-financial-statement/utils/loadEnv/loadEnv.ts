export const loadEnv = () => {
  // Extract and validate required environment variables
  const storeName = process.env.STORE_NAME;

  if (!storeName) {
    throw new Error('Missing required env variable: STORE_NAME');
  }

  return { storeName };
};
