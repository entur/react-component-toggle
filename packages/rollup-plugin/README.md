# @entur/rollup-plugin-react-component-toggle

A Rollup plugin that enables code-splitting for [@entur/react-component-toggle](../react-component-toggle).

This plugin automatically creates separate chunks for each component in your components directory, enabling efficient lazy loading of feature-flagged components.

## Installation

```bash
npm install --save-dev @entur/rollup-plugin-react-component-toggle
# or
yarn add -D @entur/rollup-plugin-react-component-toggle
# or
pnpm add -D @entur/rollup-plugin-react-component-toggle
```

## Usage

```js
// rollup.config.js
import reactComponentToggle from '@entur/rollup-plugin-react-component-toggle'

export default {
  // ... other rollup config
  plugins: [
    reactComponentToggle({
      componentsPath: 'src/components',  // Path to your components directory
      exclude: ['internal/', 'utils/'],  // Optional: paths to exclude
      chunkPrefix: 'component-'          // Optional: prefix for chunk names
    })
  ]
}
```

## Options

### `componentsPath` (required)
Path to the directory containing your component implementations. Each subdirectory under this path will be treated as a separate component chunk.

### `exclude` (optional)
Array of strings to match against file paths. Files containing any of these strings will be excluded from chunking.

### `chunkPrefix` (optional)
Prefix for generated chunk names. Defaults to 'component-'.

## How it works

The plugin scans your components directory and creates separate chunks for each component using Rollup's `manualChunks` feature. This enables:

1. Code-splitting of components into separate files
2. Lazy loading of components at runtime
3. Reduced initial bundle size
4. Efficient loading of only enabled features

For example, given this directory structure:
```
src/
  components/
    feature-a/
      index.tsx
      utils.ts
    feature-b/
      index.tsx
      styles.css
```

The plugin will create separate chunks for 'feature-a' and 'feature-b', which will only be loaded when those features are enabled in your application.

## Related
- [@entur/react-component-toggle](../react-component-toggle) - The main component library for feature-flagged React components
