---
"@entur/react-component-toggle": patch
"@entur/rollup-plugin-react-component-toggle": patch
---

Second dependency sweep: TypeScript 5 → 6, Vite 7 → 8, jsdom 26 → 29, @vitejs/plugin-react 5 → 6, vite-plugin-dts 4 → 5, globals 16 → 17, glob 12 → 13, @types/node 24 → 25, @changesets/cli → 2.31. Pinned all devDependencies and dependencies to exact versions (peerDependencies remain ^). Migrated vitest config to import `defineConfig` from `vitest/config` (vitest 4 + vite 8 compatibility), added `dist` to vitest excludes, set `rootDir` in rollup-plugin tsconfig (TypeScript 6 requirement), and added `*.tsbuildinfo` to .gitignore.

Moved `rollup` from `dependencies` to `peerDependencies` (`^4.0.0`) in `@entur/rollup-plugin-react-component-toggle`. The plugin only uses `import type { Plugin } from 'rollup'` — type-only — so it doesn't need to bundle its own copy at runtime. Consumers will deduplicate against whichever rollup their own build uses. Built `dist/index.js` and `dist/index.d.ts` are byte-identical to before this move.
