module.exports = {
  onPreBuild: async ({ utils }) => {
    const cachedRef = process.env.CACHED_COMMIT_REF;
    if (!cachedRef) {
        console.log("No CACHED_COMMIT_REF set; skipping package.json change check.");
        return;
    }

    try {
        const execSync = require('child_process').execSync;

        try {
            execSync(`git cat-file -e ${cachedRef}^{commit}`, { stdio: "ignore" });
        } catch {
                console.log(`Commit ${cachedRef} not found in local history. Fetching...`);
            try {
                execSync(`git fetch --depth=100 origin ${cachedRef}`, { stdio: "inherit" });
                console.log(`Successfully fetched commit ${cachedRef}`);
            } catch (fetchErr) {
                console.warn(`Failed to fetch commit ${cachedRef}:`, fetchErr.message);
                console.log(`Skipping package.json change check.`);
                return;
            }
        }
        
        const output = execSync(`git diff --name-only ${cachedRef}...HEAD -- package.json`, { encoding: "utf8" }).trim();
        if (output) {
            console.log(`package.json changed since commit ${cachedRef}`, output);
            console.log(`Clearing cache...`);
            await utils.cache.remove("node_modules");
            console.log(`Cache cleared.`);
        } else {
            console.log(`No changes detected in package.json since ${cachedRef}`);
        }
    } catch (error) {
        console.warn(`Error checking for package.json changes`, error.message);
    }
  }
};
