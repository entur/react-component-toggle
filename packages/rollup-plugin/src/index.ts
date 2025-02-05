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
   *   return null;
   * }
   * ```
   */
  manualChunks?: (id: string) => string | null;
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
          // Check excludes first
          if (exclude.some(str => id.includes(str))) {
            return;
          }

          // Match any file under a component directory
          const normalizedPath = id.replace(/\\/g, '/'); // Normalize path separators
          const componentDirPattern = new RegExp(`${componentsPath.replace('/', '\\/')}\/([^/]+)`);
          const match = normalizedPath.match(componentDirPattern);

          if (match && normalizedPath.includes(componentsPath)) {
            return `${chunkPrefix}${match[1]}`;
          }

          if (manualChunks) {
            return manualChunks(id);
          }
        }
      };
    }
  }
}
