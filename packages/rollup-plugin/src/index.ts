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
 *       chunkPrefix: 'my-component-'
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
  chunkPrefix = 'component-' 
}: ReactComponentToggleOptions): Plugin {
  return {
    name: 'react-component-toggle',
    
    outputOptions(existingOutput) {
      return {
        ...existingOutput,
        manualChunks: (id) => {
          // Check excludes first
          if (exclude.some(str => id.includes(str))) {
            return null;
          }

          // Handle components
          const componentPattern = new RegExp(`${componentsPath.replace('/', '\\/')}\/.+\/.+`);
          if (componentPattern.test(id)) {
            const match = id.match(new RegExp(`${componentsPath.replace('/', '\\/')}\/([^/]+)`));
            if (match) {
              return `${chunkPrefix}${match[1]}`;
            }
          }
          return null;
        }
      };
    }
  }
}
