# React Component Toggle Monorepo

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

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint all packages
pnpm lint
```

## Contributing

Contributions are welcome! Please read our contributing guidelines for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the European Union Public License v. 1.2 (EUPL-1.2) - see the [LICENSE](LICENSE) file for details.
