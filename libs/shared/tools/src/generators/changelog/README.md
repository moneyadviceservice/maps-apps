# Changelog generator (`@maps-react/tools:changelog`)

Generates a per-app `CHANGELOG.md` entry from the app's own commits, and
(with `--commit`) commits it as the release marker.

## What it does

- Resolves the "since last release" boundary: the last `chore(release): <app>` commit
  that touched the app's `CHANGELOG.md`, then the last commit to touch that file, then
  the first commit for a first release (tag-free; see `lib/resolve-from-ref.ts`).
- Collects the app's own commits since that boundary (those touching `apps/<app>/**`),
  keeping every conventional type (feat, fix, chore, docs, ...)
- Renders an entry under a `## <version> (YYYY-MM-DD)` heading (below the file's `# Changelog`
  H1), with full-hash commit links and Azure DevOps work-item links taken from each commit's
  `Related work items:` body trailer.
- Writes the entry by default. With `--commit`, stages and commits only the CHANGELOG as
  `chore(release): <app> <version>` (no tag — the commit is the deployable release unit and
  the boundary for the next release). Without `--commit` you stage and commit it yourself.

## Usage

```bash
# Preview the entry (prints markdown, no writes, no git):
nx g @maps-react/tools:changelog mortgage-calculator 1.2.0 --preview

# Write apps/<app>/CHANGELOG.md only (no commit):
nx g @maps-react/tools:changelog mortgage-calculator 1.2.0

# Write and commit the release marker:
nx g @maps-react/tools:changelog mortgage-calculator 1.2.0 --commit

# Override the boundary (tag or SHA) instead of the auto-detected one:
nx g @maps-react/tools:changelog mortgage-calculator 1.2.0 --from=HEAD~40
```

## Release pipeline

The changelog-release pipeline (`.azuredevops/changelog-release.yml`) wraps the
generator so cutting a release only needs a pipeline run and a PR approval:

1. Run the pipeline from the branch you are releasing (normally `main`),
   supplying the app's Nx project name and the new version, plus the optional
   `from` boundary override (tag or SHA).
2. The pipeline creates `release/<project>-<version>`, runs the generator with
   `--commit` and pushes the release marker commit. It fails early if the
   version has already been released, the branch already exists, or there are
   no changelog-worthy changes.
3. It opens a PR as the build service account, titled
   `chore(release): <project> <version>` and targeting the branch the run was
   queued against, with the rendered entry in the description. The developer
   who ran the pipeline is added as a reviewer.
4. Review and complete the PR, keeping the `chore(release): ...` line in the
   merge message (the default message keeps it, because the description is
   carried into the squash commit body). That line is how the next release
   resolves its boundary; if it is lost, resolution falls back to the last
   commit that touched the app's CHANGELOG.

If a run produced the wrong entry, abandon the PR, delete the `release/...`
branch and run the pipeline again (use `from` to adjust the boundary).
