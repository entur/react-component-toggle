import { describe, it, expect } from 'vitest';
import reactComponentToggle from '../index';
import type { Plugin } from 'rollup';

describe('reactComponentToggle', () => {
  // Helper to get manualChunks function from plugin
  const getManualChunks = (plugin: Plugin) => {
    const output = plugin.outputOptions?.({}) as { manualChunks?: Function };
    return output.manualChunks;
  };

  it('creates chunks based on component directory names', () => {
    const plugin = reactComponentToggle({
      componentsPath: 'src/components',
    });

    const manualChunks = getManualChunks(plugin);
    expect(manualChunks).toBeDefined();

    // Test component path matching
    expect(manualChunks('src/components/feature1/index.tsx')).toBe('component-feature1');
    expect(manualChunks('src/components/feature2/Button.tsx')).toBe('component-feature2');
    
    // Test non-component paths
    expect(manualChunks('src/utils/helper.ts')).toBeUndefined();
  });

  it('respects exclude patterns', () => {
    const plugin = reactComponentToggle({
      componentsPath: 'src/components',
      exclude: ['internal/', 'utils/'],
    });

    const manualChunks = getManualChunks(plugin);
    expect(manualChunks).toBeDefined();

    // Test excluded paths
    expect(manualChunks('src/components/internal/helper.ts')).toBeUndefined();
    expect(manualChunks('src/components/feature1/utils/helper.ts')).toBeUndefined();

    // Test non-excluded paths
    expect(manualChunks('src/components/feature1/index.tsx')).toBe('component-feature1');
  });

  it('uses custom chunk prefix', () => {
    const plugin = reactComponentToggle({
      componentsPath: 'src/components',
      chunkPrefix: 'custom-',
    });

    const manualChunks = getManualChunks(plugin);
    expect(manualChunks).toBeDefined();

    expect(manualChunks('src/components/feature1/index.tsx')).toBe('custom-feature1');
  });

  it('supports manual chunk overrides', () => {
    const plugin = reactComponentToggle({
      componentsPath: 'src/components',
      manualChunks: (id: string) => {
        if (id.includes('special/')) {
          return 'special-chunk';
        }
      },
    });

    const manualChunks = getManualChunks(plugin);
    expect(manualChunks).toBeDefined();

    // Test manual chunk override
    expect(manualChunks('src/special/component.tsx')).toBe('special-chunk');
    
    // Test automatic chunking still works
    expect(manualChunks('src/components/feature1/index.tsx')).toBe('component-feature1');
  });

  it('handles cross-platform paths', () => {
    const plugin = reactComponentToggle({
      componentsPath: 'src/components',
    });

    const manualChunks = getManualChunks(plugin);
    expect(manualChunks).toBeDefined();

    // Test Windows-style paths
    expect(manualChunks('src\\components\\feature1\\index.tsx')).toBe('component-feature1');
    expect(manualChunks('src\\components\\feature2\\Button.tsx')).toBe('component-feature2');
  });

  it('handles nested component paths', () => {
    const plugin = reactComponentToggle({
      componentsPath: 'src/components',
    });

    const manualChunks = getManualChunks(plugin);
    expect(manualChunks).toBeDefined();

    // Test nested component files
    expect(manualChunks('src/components/feature1/nested/Component.tsx')).toBe('component-feature1');
    expect(manualChunks('src/components/feature2/deep/nested/Button.tsx')).toBe('component-feature2');
  });

  it('handles edge cases', () => {
    const plugin = reactComponentToggle({
      componentsPath: 'src/components',
    });

    const manualChunks = getManualChunks(plugin);
    expect(manualChunks).toBeDefined();

    // Test empty paths
    expect(manualChunks('')).toBeUndefined();
    
    // Test paths without component name
    expect(manualChunks('src/components/')).toBeUndefined();
    
    // Test paths with special characters
    expect(manualChunks('src/components/@feature/index.tsx')).toBe('component-@feature');
    expect(manualChunks('src/components/feature.name/index.tsx')).toBe('component-feature.name');
  });
});
