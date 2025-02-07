# React Component Toggle Monorepo

[![CI](https://github.com/entur/react-component-toggle/actions/workflows/ci.yml/badge.svg)](https://github.com/entur/react-component-toggle/actions/workflows/ci.yml)

This monorepo contains packages for implementing feature-flagged React components with code splitting support.

## Packages

### [@entur/react-component-toggle](packages/react-component-toggle)
The main component library that enables feature-flagging of React components with full type safety and lazy loading support.

### [@entur/rollup-plugin-react-component-toggle](packages/rollup-plugin)
A Rollup plugin that enables efficient code-splitting of feature-flagged components.

## Development

This project uses pnpm workspaces for package management. To get started:

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test
```

## Release Process

This project uses [changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm.

### Adding Changes

When making changes:

1. Create a changeset:
   ```bash
   pnpm changeset
   ```

2. Follow the prompts to:
   - Select which packages have changed
   - Choose the version bump (major/minor/patch)
   - Write a description of your changes

3. Commit the changeset file with your changes:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push
   ```

### Publishing a New Version

1. Make sure you're on master and up to date:
   ```bash
   git checkout master
   git pull origin master
   ```

2. Update versions and changelogs:
   ```bash
   pnpm version-packages
   ```

3. Review the changes, then commit:
   ```bash
   git add .
   git commit -m "chore: version packages"
   ```

4. Make sure you're logged into npm with appropriate permissions:
   ```bash
   npm login
   ```

5. Build and publish:
   ```bash
   pnpm build
   pnpm publish -r
   ```

6. Create and push git tags:
   ```bash
   # Get the current version
   VERSION=$(node -p "require('./packages/react-component-toggle/package.json').version")
   git tag v$VERSION
   git push origin v$VERSION
   ```

### Version Bump Types

- `major` (1.0.0 -> 2.0.0): Breaking changes
- `minor` (1.0.0 -> 1.1.0): New features (backwards compatible)
- `patch` (1.0.0 -> 1.0.1): Bug fixes and minor updates

## Contributing

Contributions are welcome! Please read our contributing guidelines for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the European Union Public License v. 1.2 (EUPL-1.2) - see the [LICENSE](LICENSE) file for details.
