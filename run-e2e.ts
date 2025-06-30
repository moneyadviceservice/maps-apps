import { spawn } from 'child_process';

const args = process.argv.slice(2);

const isHeaded = args.includes('headed');
const filteredArgs = args.filter((arg) => arg !== 'headed');
const appName = filteredArgs[0] || process.env.PROJECT_NAME || '';

const baseCommand = `nx`;
const commandArgs = [`e2e${isHeaded ? '-headed' : ''}`, appName];

const env = {
  ...process.env,
  APPOINTMENTS_API: 'http://localhost:9000/',
  CI: 'true', // Ensures Playwright runs correctly in CI
};

console.log(`🚀 Running Playwright tests for: ${appName}`);

const processInstance = spawn(baseCommand, commandArgs, { env, shell: true });

// Stream stdout to the console
processInstance.stdout.on('data', (data) => {
  process.stdout.write(data);
});

// Stream stderr to the console
processInstance.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Handle process close
processInstance.on('close', (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
    process.exit(code ?? 1);
  } else {
    console.log('Process completed successfully.');
  }
});
