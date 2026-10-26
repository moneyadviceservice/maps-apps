# Dev Container Configuration

A development container for the MaPS monorepo with Node.js 22, Nx, and Netlify CLI pre-installed.

## Prerequisites

- Docker Desktop must be installed and running
- VS Code with the "Dev Containers" extension installed

## Getting Started

1. Ensure Docker Desktop is running
2. Open the repository in VS Code
3. When prompted, click "Reopen in Container" (or use Command Palette: "Dev Containers: Reopen in Container")
4. Wait for the container to build and npm install to complete
5. Start developing!

## What's Included

- Node.js 22
- Nx CLI (global)
- Netlify CLI (global)
- All monorepo ports automatically forwarded

## Common Commands

```bash
# Start dev server
npm run serve [app-name]

# Run tests
npm run test:all

# Run affected commands
nx affected:test
nx affected:build

# View dependency graph
nx graph
```
