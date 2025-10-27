const plugin = require('./index.js');
require('dotenv').config({
  path: 'netlify/tools/plugins/stop-build/.env.local',
});

const utils = {
  build: {
    cancelBuild: (message) => {
      console.log('Build cancelled:', message);
      process.exit(0);
    },
  },
};

process.env.FORCE_BUILD = process.env.FORCE_BUILD || 'false';
process.env.PROJECT_NAME = process.env.PROJECT_NAME || 'project-name';
process.env.PULL_REQUEST = process.env.PULL_REQUEST || '';
process.env.REVIEW_ID = process.env.REVIEW_ID || '';
process.env.CACHED_COMMIT_REF = process.env.CACHED_COMMIT_REF || 'HEAD~1';
process.env.ADO_TOKEN = process.env.ADO_TOKEN || '';

// Run the plugin
async function runTest() {
  try {
    console.log('Testing Netlify build plugin with:');
    console.log(`- FORCE_BUILD: ${process.env.FORCE_BUILD}`);
    console.log(`- PROJECT_NAME: ${process.env.PROJECT_NAME}`);
    console.log(`- PULL_REQUEST: ${process.env.PULL_REQUEST}`);
    console.log(`- REVIEW_ID: ${process.env.REVIEW_ID}`);
    console.log(`- CACHED_COMMIT_REF: ${process.env.CACHED_COMMIT_REF}`);
    console.log(`- ADO_TOKEN: ${process.env.ADO_TOKEN ? 'Set' : 'Not set'}`);

    await plugin.onPreBuild({ utils });
    console.log('Build would proceed - no cancellation triggered');
  } catch (error) {
    console.error('Error running plugin:', error);
  }
}

runTest();
