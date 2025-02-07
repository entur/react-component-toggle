import type { Plugin } from 'rollup'

/**
 * Options for configuring the react-component-toggle Rollup plugin
 */
export interface ReactComponentToggleOptions {
  /**
   * Path to the directory containing component implementations.
   * Each subdirectory under this path will be treated as a separate component chunk.
   */
  componentsPath: string;

  /**
   * Optional array of strings to match against file paths.
   * Files containing any of these strings will be excluded from chunking.
   */
  exclude?: string[];

  /**
   * Optional prefix for generated chunk names.
   * @default 'component-'
   */
  chunkPrefix?: string;

  /**
   * Optional function to manually control chunk assignment for specific files.
   * This function is called for each module ID during the build process, in case
   * the plugin did not already assigned a chunk name to the module.
   *
   * @param id - The module ID (typically the file path) being processed
   * @returns A string representing the chunk name for the module, or null to let the default chunking strategy handle it
   *
   * @example
   * ```ts
   * manualChunks: (id) => {
   *   if (id.includes('special/')) {
   *     return 'special-chunk';
   *   }
   * }
   * ```
   */
  manualChunks?: (id: string) => string | undefined;
}

/**
 * Rollup plugin for @entur/react-component-toggle that enables code-splitting of component implementations.
 *
 * This plugin scans for components in the specified components directory and creates separate chunks for each component.
 * This enables dynamic loading of components at runtime, reducing the initial bundle size.
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import reactComponentToggle from '@entur/rollup-plugin-react-component-toggle'
 *
 * export default {
 *   plugins: [
 *     reactComponentToggle({
 *       componentsPath: 'src/components',
 *       exclude: ['internal/', 'utils/'],
 *       chunkPrefix: 'my-component-',
 *       manualChunks: (id) => {
 *         if (id.includes('special/')) {
 *           return 'special-chunk';
 *         }
 *      }
 *     })
 *   ]
 * }
 * ```
 *
 * @param options - Configuration options for the plugin
 * @returns A Rollup plugin that handles code-splitting for component implementations
 */
export default function reactComponentToggle({
  componentsPath,
  exclude = [],
  chunkPrefix = 'component-',
  manualChunks,
}: ReactComponentToggleOptions): Plugin {
  return {
    name: 'react-component-toggle',

    outputOptions(existingOutput) {
      return {
        ...existingOutput,
        manualChunks: (id) => {
          // Check excludes first - if file matches any exclude pattern, skip chunking
          if (exclude.some(str => id.includes(str))) {
            return;
          }

          // Normalize path separators for cross-platform compatibility (Windows/Unix)
          const normalizedPath = id.replace(/\\/g, '/');

          // Create a regex pattern to match component directories
          // This will match 'componentsPath/componentName' and capture the componentName
          const componentDirPattern = new RegExp(`${componentsPath.replace('/', '\\/')}\/([^/]+)`);
          const match = normalizedPath.match(componentDirPattern);

          // If the file is under a component directory, create a chunk for that component
          if (match && normalizedPath.includes(componentsPath)) {
            return `${chunkPrefix}${match[1]}`; // Creates chunks like 'component-featureName'
          }

          // If no automatic chunk was created and manualChunks is provided,
          // let the user's function decide the chunk name
          if (manualChunks) {
            return manualChunks(id);
          }
        }
      };
    }
  }
}
