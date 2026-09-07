import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.join(
  process.cwd(),
  'apps',
  'travel-insurance-directory',
  'public',
);
const headersFile = path.join(outputDir, '_headers');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Base Headers (Applied everywhere, always)
let headersContent = `
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
`;

// 2. Environment Variables
// Netlify automatically sets CONTEXT to "production", "deploy-preview", or "branch-deploy"
const context = process.env.CONTEXT;
const basicAuthCredentials = process.env.BASIC_AUTH_CREDENTIALS;

// 3. Logic: Protect if we have credentials AND we are NOT in production
if (basicAuthCredentials) {
  console.log(
    `[Security] BASIC_AUTH_CREDENTIALS found for context '${context}'. Applying Basic Auth.`,
  );

  // Appends the Basic-Auth rule to all paths (/*)
  headersContent += `
# Restrict access to non-production environments
/*
  Basic-Auth: ${basicAuthCredentials}
`;
} else {
  console.log(
    `[Security] No BASIC_AUTH_CREDENTIALS found. Site will be public. If this is unintentional, please set BASIC_AUTH_CREDENTIALS in your environment variables.`,
  );
}

// 4. Write the file
fs.writeFileSync(headersFile, headersContent.trim() + '\n');
console.log(`Successfully generated _headers file at ${headersFile}`);
