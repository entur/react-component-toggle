import type { Plugin } from 'rollup'

export interface ReactComponentToggleOptions {
  extensionsPath: string;
  exclude?: string[];
}

export default function reactComponentToggle({ extensionsPath, exclude = [] }: ReactComponentToggleOptions): Plugin {
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

          // Handle extensions
          const extensionPattern = new RegExp(`${extensionsPath.replace('/', '\\/')}\/.+\/.+`);
          if (extensionPattern.test(id)) {
            const match = id.match(new RegExp(`${extensionsPath.replace('/', '\\/')}\/([^/]+)`));
            if (match) {
              return `ext-${match[1]}`;
            }
          }
          return null;
        }
      };
  }
}
