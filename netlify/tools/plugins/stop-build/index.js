module.exports = {
  onBuild: ({ utils }) => {
    const forceBuild = process.env.FORCE_BUILD === 'true';
    const currentProject = process.env.PROJECT_NAME;
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    const latestCommit = 'HEAD';
    const projectHasChanged = projectChanged(
      currentProject,
      lastDeployedCommit,
      latestCommit,
    );
    if (!projectHasChanged && !forceBuild) {
      utils.build.cancelBuild(
        `Build was cancelled because ${currentProject} was not affected by the latest changes`,
      );
    }
  },
};

function projectChanged(currentProject, fromHash, toHash) {
  const execSync = require('child_process').execSync;
  const getAffected = `npx nx show projects --affected --base=${fromHash} --head=${toHash}`;
  const changedProjects = execSync(getAffected).toString();
  return changedProjects.includes(currentProject);
}
