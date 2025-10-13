module.exports = {
  onPreBuild: async ({ utils }) => {
    const forceBuild = process.env.FORCE_BUILD === 'true';
    const pullRequest = process.env.PULL_REQUEST === 'true';
    const currentProject = process.env.PROJECT_NAME;
    const pullRequestNumber = process.env.REVIEW_ID;
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    const adoToken = process.env.ADO_TOKEN;
    const latestCommit = 'HEAD';
    const projectHasChanged = projectChanged(
      currentProject,
      lastDeployedCommit,
      latestCommit,
    );

    let pullRequestDraft;

    if (!pullRequest && !pullRequestNumber) {
      console.log('Not a pull request:', pullRequest);
      pullRequestDraft = false;
    } else {
      console.log('Pull request, pullRequestNumber', pullRequestNumber);
      pullRequestDraft = await getDraftStateFromPullRequest(
        pullRequestNumber,
        adoToken,
      );
      console.log('Pull request draft state:', pullRequestDraft);
    }

    if ((!projectHasChanged && !forceBuild) || pullRequestDraft === true) {
      utils.build.cancelBuild(
        `Build was cancelled because ${currentProject} was not affected or PR is in draft.`,
      );
    }
  },
};

function projectChanged(currentProject, fromHash, toHash) {
  const execSync = require('child_process').execSync;
  const getAffected = `npx nx show projects --affected --base=${fromHash} --head=${toHash}`;
  console.log('Running command to check affected projects:', getAffected);
  const changedProjects = execSync(getAffected).toString();
  console.log('Changed projects:', changedProjects);
  return changedProjects.includes(currentProject);
}

async function getDraftStateFromPullRequest(pullRequestNumber, adoToken) {
  const url = `https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_apis/git/repositories/maps-apps/pullrequests/${pullRequestNumber}/?api-version=7.1-preview.1`;
  console.log('Fetching PR state from:', url);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`:${adoToken}`)}`,
  };
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Failed to fetch PR state');
    const data = await response.json();
    return typeof data.isDraft === 'boolean' ? data.isDraft : !!data.isDraft;
  } catch (error) {
    console.error('Error fetching pull request state:', error);
    return undefined;
  }
}
