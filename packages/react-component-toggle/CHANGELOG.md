# @entur/react-component-toggle

## 1.1.2

### Patch Changes

- b327653: Second dependency sweep: TypeScript 5 → 6, Vite 7 → 8, jsdom 26 → 29, @vitejs/plugin-react 5 → 6, vite-plugin-dts 4 → 5, globals 16 → 17, glob 12 → 13, @types/node 24 → 25, @changesets/cli → 2.31. Pinned all devDependencies and dependencies to exact versions (peerDependencies remain ^). Migrated vitest config to import `defineConfig` from `vitest/config` (vitest 4 + vite 8 compatibility), added `dist` to vitest excludes, set `rootDir` in rollup-plugin tsconfig (TypeScript 6 requirement), and added `*.tsbuildinfo` to .gitignore.

  Moved `rollup` from `dependencies` to `peerDependencies` (`^4.0.0`) in `@entur/rollup-plugin-react-component-toggle`. The plugin only uses `import type { Plugin } from 'rollup'` — type-only — so it doesn't need to bundle its own copy at runtime. Consumers will deduplicate against whichever rollup their own build uses. Built `dist/index.js` and `dist/index.d.ts` are byte-identical to before this move.

## 1.1.1

### Patch Changes

- b64f69a: Sweep dependency upgrades: vitest 3 → 4 (with @vitest/ui and @vitest/coverage-v8), vite 7.1 → 7.3, rollup 4.46 → 4.59, glob 11 → 12, react & react-dom → 19.2.7, @types/react → 19.2.13, @testing-library/jest-dom → 6.9, @testing-library/react → 16.3.2 (now with @testing-library/dom 10 as a direct devDependency to satisfy its peer requirement), and pnpm/action-setup → v6 in CI.

## 1.1.0

### Minor Changes

- 8995303: Fixed nested toggle issue and added hook for toggled non-component import

## 1.0.0

### Major Changes

- 52445a9: First major release

## 0.0.3

### Patch Changes

- 9277617: fix for incorrect fallback for enabled components

## 0.0.2

### Patch Changes

- cda39db: First release
