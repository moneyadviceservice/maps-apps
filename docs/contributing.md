## Best Practices

### Naming Conventions

- **Apps**: Use maximum 2 separators (e.g., `cash-in-chunks`, not `cash-in-chunks-calculator`)
- **Components**: PascalCase for component names
- **Files**: kebab-case for file names
- **Pipelines**: Follow `{resource}-{action}.yml` format

### Development Guidelines

- Follow the [Frontend Best Practices](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices)
- Use conventional commit messages for better semantic versioning
- Ensure each pipeline achieves one goal, not many
- Document pipeline behavior in this README
- Test thoroughly after NX migrations

### Code Organization

- Keep E2E tests in the dedicated `/apps/e2e/` folder
- Use shared libraries for common functionality
- Maintain consistent project.json configuration across apps
- Follow the established Tailwind configuration pattern

## Getting Help

- Consult individual app READMEs for specific application details
- Review the [NX documentation](https://nx.dev) for workspace management
- Check the [Frontend Best Practices wiki](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices) for coding standards
- Ask team members for environment variable values and specific configuration details

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the established patterns
3. Ensure all tests pass
4. Create a pull request with a descriptive title and conventional commit messages
5. Code will be reviewed and E2E tests will run automatically
6. After approval and merge, changes will be deployed to the development environment

### Commit Message Format

This repository enforces [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). All commit messages must follow this format:

```text
type(scope): description
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `build` - Build system changes
- `revert` - Reverting previous commits

**Examples:**

```bash
feat: add user authentication
fix(auth): resolve login redirect issue
feat!: breaking change to API
docs: update README with setup instructions
```

The `!` after the type indicates a breaking change. The scope is optional but recommended for clarity.

---

For application-specific information, please refer to the README in each app's directory under `/apps/`.
