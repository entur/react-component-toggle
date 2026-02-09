import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentToggle, ComponentToggleProvider } from '../main';

describe('ComponentToggle', () => {
  type TestFeatures = {
    testFeature: boolean;
  };

  const TestComponent = () => <div>Test Component</div>;

  it('renders the component when feature is enabled', async () => {
    const importFn = vi.fn().mockResolvedValue({ default: TestComponent });
    
    render(
      <ComponentToggleProvider
        flags={{ testFeature: true }}
        importFn={importFn}
      >
        <ComponentToggle<keyof TestFeatures, {}>
          feature="testFeature"
        />
      </ComponentToggleProvider>
    );

    // Wait for lazy loading
    expect(await screen.findByText('Test Component')).toBeInTheDocument();
    expect(importFn).toHaveBeenCalledWith(['testFeature']);
  });

  it('renders fallback when feature is disabled', () => {
    const importFn = vi.fn();
    
    render(
      <ComponentToggleProvider
        flags={{ testFeature: false }}
        importFn={importFn}
      >
        <ComponentToggle<keyof TestFeatures, {}>
          feature="testFeature"
          renderFallback={() => <div>Fallback</div>}
        />
      </ComponentToggleProvider>
    );

    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(importFn).not.toHaveBeenCalled();
  });

  it('supports nested features', async () => {
    const importFn = vi.fn().mockResolvedValue({ default: TestComponent });
    
    render(
      <ComponentToggleProvider
        flags={{ testFeature: true }}
        importFn={importFn}
        maxFeatureDepth={2}
      >
        <ComponentToggle<keyof TestFeatures, {}>
          feature="testFeature/nested"
        />
      </ComponentToggleProvider>
    );

    expect(await screen.findByText('Test Component')).toBeInTheDocument();
    expect(importFn).toHaveBeenCalledWith(['testFeature', 'nested']);
  });

  it('throws error when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(
        <ComponentToggle<keyof TestFeatures, {}>
          feature="testFeature"
        />
      );
    }).toThrow('useComponentToggleContext must be used within a ComponentToggleProvider');

    consoleError.mockRestore();
  });

  it('enables only the exact feature when flag key contains a slash', async () => {
    const importFn = vi.fn().mockResolvedValue({ default: TestComponent });

    render(
      <ComponentToggleProvider
        flags={{ 'testFeature/nested': true }}
        importFn={importFn}
        maxFeatureDepth={2}
      >
        <ComponentToggle<string, {}>
          feature="testFeature/nested"
        />
        <ComponentToggle<string, {}>
          feature="testFeature/other"
          renderFallback={() => <div>Other Fallback</div>}
        />
      </ComponentToggleProvider>
    );

    expect(await screen.findByText('Test Component')).toBeInTheDocument();
    expect(screen.getByText('Other Fallback')).toBeInTheDocument();
    expect(importFn).toHaveBeenCalledTimes(1);
    expect(importFn).toHaveBeenCalledWith(['testFeature', 'nested']);
  });

  it('enables all sub-features when flag key has no slash (prefix match)', async () => {
    const importFn = vi.fn().mockResolvedValue({ default: TestComponent });

    render(
      <ComponentToggleProvider
        flags={{ testFeature: true }}
        importFn={importFn}
        maxFeatureDepth={2}
      >
        <ComponentToggle<string, {}>
          feature="testFeature/nested"
        />
        <ComponentToggle<string, {}>
          feature="testFeature/other"
        />
      </ComponentToggleProvider>
    );

    const components = await screen.findAllByText('Test Component');
    expect(components).toHaveLength(2);
    expect(importFn).toHaveBeenCalledTimes(2);
  });

  it('throws error when feature depth exceeds maximum', () => {
    const importFn = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(
        <ComponentToggleProvider
          flags={{ testFeature: true }}
          importFn={importFn}
          maxFeatureDepth={1}
        >
          <ComponentToggle<keyof TestFeatures, {}>
            feature="testFeature/nested/tooDeep"
          />
        </ComponentToggleProvider>
      );
    }).toThrow('Max feature depth is 1');

    consoleError.mockRestore();
  });
});
