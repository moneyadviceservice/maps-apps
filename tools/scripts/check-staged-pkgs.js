const { execSync } = require('child_process');
const fs = require('fs');

const staged = execSync('git diff --cached --name-only')
  .toString()
  .split('\n')
  .filter((f) => f.endsWith('package.json'));

let failed = false;

const hasNonPinnedPrefix = (version) =>
  typeof version === 'string' &&
  (version.startsWith('^') || version.startsWith('~'));

const collectNonPinned = (deps, prefix = '') => {
  if (!deps || typeof deps !== 'object') return [];

  const bad = [];

  for (const [name, value] of Object.entries(deps)) {
    const path = prefix ? `${prefix} > ${name}` : name;

    if (hasNonPinnedPrefix(value)) {
      bad.push([path, value]);
      continue;
    }

    if (value && typeof value === 'object') {
      bad.push(...collectNonPinned(value, path));
    }
  }

  return bad;
};

for (const file of staged) {
  if (!fs.existsSync(file)) continue;

  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));

  const deps = [
    ...collectNonPinned(pkg.dependencies),
    ...collectNonPinned(pkg.devDependencies),
    ...collectNonPinned(pkg.peerDependencies),
    ...collectNonPinned(pkg.optionalDependencies),
    ...collectNonPinned(pkg.overrides, 'overrides'),
  ];

  if (deps.length) {
    console.error(`❌ ${file} has non-pinned deps:`);
    deps.forEach(([n, v]) => console.error(`  ${n}@${v}`));
    failed = true;
  }
}

if (failed) process.exit(1);
