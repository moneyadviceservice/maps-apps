module.exports = {
  onPreBuild: async ({ utils }) => {
    const forceBuild = process.env.FORCE_BUILD === 'true';
    const pullRequest = process.env.PULL_REQUEST === 'true';
    const currentProject = process.env.PROJECT_NAME;
    const pullRequestNumber = process.env.REVIEW_ID;
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    const latestCommit = 'HEAD';
    const projectHasChanged = projectChanged(
      currentProject,
      lastDeployedCommit,
      latestCommit,
    );

    if (!pullRequest && !pullRequestNumber) {
      console.log('Not a pull request:', pullRequest);
    } else {
      console.log('Pull request, pullRequestNumber', pullRequestNumber);
    }

    if (!projectHasChanged && !forceBuild) {
      utils.build.cancelBuild(
        `Build was cancelled because ${currentProject} was not affected.`,
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
