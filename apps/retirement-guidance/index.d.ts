/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module '*.svg?url' {
  const content: any;
  export default content;
}

// Trigger e2e
