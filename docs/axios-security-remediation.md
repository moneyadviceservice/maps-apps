# Axios Security Remediation — Incident Report

**Date:** 2 April 2026  
**Monorepo:** `@maps-digital/source`  
**Lockfile scope:** Single root `package-lock.json`  
**Vulnerability:** Axios versions `< 1.13.5`, `1.14.1`, and `0.30.4` are known vulnerable  
**CVE policy reference:** Block `< 1.13.5`, `1.14.1`, `0.30.4`

---

## Summary

A security audit identified that the monorepo's resolved Axios version was `1.13.2`, which falls below the safe threshold of `1.13.5`. The vulnerability was present across all dependency paths that consume Axios as a transitive dependency.

The remediation applied a single `overrides` entry to the root `package.json`, forcing npm to resolve all instances of Axios to `1.14.0` regardless of what each parent package declares. Post-remediation verification confirmed zero Axios-related vulnerabilities.

---

## AC1: Dependency Verification (Pre-Remediation)

Single resolved Axios version found in `package-lock.json`:

| Resolved Version | Location                                        | Status                       |
| ---------------- | ----------------------------------------------- | ---------------------------- |
| `1.13.2`         | `node_modules/axios` (package-lock.json#L15859) | ❌ Vulnerable — below 1.13.5 |

---

## AC2: Remediation Action

This codebase does not import axios directly. It is consumed as a transitive dependency by:

- `@googlemaps/google-maps-services-js`
- `notifications-node-client`
- `nx`
- `@module-federation/dts-plugin` (two versions via the tooling graph)

The `overrides` block in `package.json` forces npm to resolve all transitive instances of axios to the pinned safe version, regardless of what the parent package declared.

Axios was intentionally **not** added to `dependencies` — doing so when it is not directly imported would be misleading and clutter the manifest. The `overrides` block alone is the correct and minimal remediation.

**Change applied to `package.json`:**

```json
"overrides": {
  "axios": "1.14.0"
}
```

Command run: `npm install` at monorepo root.

---

## AC3: Post-Update Verification

### Dependency tree — `npm ls axios`

Every dependency path resolves to `1.14.0`. Paths marked `overridden` are directly intercepted by the `overrides` block; paths marked `deduped` inherit the same resolved instance:

```
npm ls axios
@maps-digital/source@0.0.0 /Users/chrisskinner/Documents/projects/clients/maps-apps
├─┬ @googlemaps/google-maps-services-js@3.4.2
│ ├── axios@1.14.0 overridden
│ └─┬ retry-axios@2.6.0
│   └── axios@1.14.0 deduped
├─┬ @nx/react@22.4.0
│ └─┬ @nx/module-federation@22.4.0
│   ├─┬ @module-federation/enhanced@0.21.6
│   │ └─┬ @module-federation/dts-plugin@0.21.6
│   │   └── axios@1.14.0 deduped
│   └─┬ @module-federation/node@2.7.27
│     └─┬ @module-federation/enhanced@0.22.1
│       └─┬ @module-federation/dts-plugin@0.22.1
│         └── axios@1.14.0 deduped
├─┬ notifications-node-client@8.2.1
│ └── axios@1.14.0 deduped
└─┬ nx@22.4.0
  └── axios@1.14.0 deduped
```

### Physical on-disk verification — `node_modules/axios/package.json`

To confirm the version physically installed on disk (the definitive source of truth):

```
cat node_modules/axios/package.json | grep '"version"'
  "version": "1.14.0",
```

### Verification precedence

| Method                                         | What it shows                    | Certainty     |
| ---------------------------------------------- | -------------------------------- | ------------- |
| `cat node_modules/axios/package.json`          | Actual file installed on disk    | ✅ Definitive |
| `npm ls axios`                                 | npm's resolved dependency tree   | ✅ Very high  |
| `package-lock.json` `node_modules/axios` entry | What npm recorded it resolved to | ✅ Very high  |

### Audit result

`npm audit` result: **No axios vulnerabilities found.**

---

## AC4: Remediation Ledger

| Package                              | Dependency Type    | Owner Source                 | Previous Declared Range | Previous Resolved Axios | Remediation Action                                    | Updated Declared Range      | Updated Resolved Axios | Axios Audit Status    |
| ------------------------------------ | ------------------ | ---------------------------- | ----------------------- | ----------------------- | ----------------------------------------------------- | --------------------------- | ---------------------- | --------------------- |
| @googlemaps/google-maps-services-js  | Runtime            | Direct root dependency       | ^1.5.1                  | 1.13.2                  | Added `overrides.axios = 1.14.0` to root package.json | N/A (overrides, not direct) | 1.14.0 (overridden)    | ✅ No vulnerabilities |
| notifications-node-client            | Runtime            | Direct root dependency       | ^1.7.2                  | 1.13.2                  | Added `overrides.axios = 1.14.0` to root package.json | N/A (overrides, not direct) | 1.14.0 (deduped)       | ✅ No vulnerabilities |
| nx                                   | Dev tooling        | Direct root dependency       | ^1.12.0                 | 1.13.2                  | Added `overrides.axios = 1.14.0` to root package.json | N/A (overrides, not direct) | 1.14.0 (deduped)       | ✅ No vulnerabilities |
| @module-federation/dts-plugin@0.21.6 | Transitive tooling | Transitive via tooling graph | ^1.12.0                 | 1.13.2                  | Added `overrides.axios = 1.14.0` to root package.json | N/A (overrides, not direct) | 1.14.0 (deduped)       | ✅ No vulnerabilities |
| @module-federation/dts-plugin@0.22.1 | Transitive tooling | Transitive via tooling graph | ^1.12.0                 | 1.13.2                  | Added `overrides.axios = 1.14.0` to root package.json | N/A (overrides, not direct) | 1.14.0 (deduped)       | ✅ No vulnerabilities |

---

## Note on `package-lock.json` Declared Ranges

When inspecting `package-lock.json` you may notice entries like:

```json
"axios": "^1.12.0"
```

inside packages such as `nx`. This is that package's own declared requirement — what it _asks for_ — and it does not change when overrides are applied.

Think of it like a menu order vs what arrives at the table. `nx` orders `^1.12.0`, but the `overrides` block intercepts the kitchen and serves `1.14.0` instead. The order slip still says `^1.12.0` — that's fine.

What matters for security verification is the **resolved** version under `node_modules/axios`, and the output of `npm ls axios` — both of which confirm `1.14.0` is what is actually installed across every dependency path.

---

## Files Changed

| File                | Change                                           |
| ------------------- | ------------------------------------------------ |
| `package.json`      | Added `overrides.axios = "1.14.0"`               |
| `package-lock.json` | Regenerated — all axios resolutions now `1.14.0` |
