import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { ComponentToggleProvider, useToggledImport } from '../main';

// Clear the module-level cache between tests by re-importing
beforeEach(async () => {
  // Reset the internal cache by clearing the module's Map
  const mod = await import('../components/useToggledImport');
  // Access the cache via a side-channel: simply re-import with different features per test
});

describe('useToggledImport', () => {
  const FALLBACK_VALUE = { name: 'fallback' };
  const IMPORTED_VALUE = { name: 'imported' };

  // Use unique feature names per test to avoid cache collisions
  let testId = 0;
  function uniqueFeature(base: string) {
    return `${base}_${++testId}`;
  }

  function TestConsumer({ feature }: { feature: string }) {
    const value = useToggledImport<{ name: string }>(
      feature,
      () => FALLBACK_VALUE,
    );
    return <div>{value.name}</div>;
  }

  it('returns fallback when feature is disabled', () => {
    const feature = uniqueFeature('testFeature');
    const importFn = vi.fn();

    render(
      <ComponentToggleProvider
        flags={{ [feature]: false }}
        importFn={importFn}
      >
        <Suspense fallback={<div>Loading</div>}>
          <TestConsumer feature={feature} />
        </Suspense>
      </ComponentToggleProvider>,
    );

    expect(screen.getByText('fallback')).toBeInTheDocument();
    expect(importFn).not.toHaveBeenCalled();
  });

  it('suspends then renders imported value when feature is enabled', async () => {
    const feature = uniqueFeature('testFeature');
    const importFn = vi
      .fn()
      .mockResolvedValue({ default: IMPORTED_VALUE });

    render(
      <ComponentToggleProvider
        flags={{ [feature]: true }}
        importFn={importFn}
      >
        <Suspense fallback={<div>Loading</div>}>
          <TestConsumer feature={feature} />
        </Suspense>
      </ComponentToggleProvider>,
    );

    // Suspends initially
    expect(screen.getByText('Loading')).toBeInTheDocument();

    // Resolves to imported value
    await waitFor(() => {
      expect(screen.getByText('imported')).toBeInTheDocument();
    });
    expect(importFn).toHaveBeenCalledWith([feature]);
  });

  it('calls importFn only for exact-matched feature when flag key contains a slash', async () => {
    const feature = uniqueFeature('feat/theme');
    const otherFeature = uniqueFeature('feat/other');
    const importFn = vi
      .fn()
      .mockResolvedValue({ default: IMPORTED_VALUE });

    render(
      <ComponentToggleProvider
        flags={{ [feature]: true }}
        importFn={importFn}
        maxFeatureDepth={2}
      >
        <Suspense fallback={<div>Loading</div>}>
          <TestConsumer feature={feature} />
        </Suspense>
        <Suspense fallback={<div>Loading other</div>}>
          <TestConsumer feature={otherFeature} />
        </Suspense>
      </ComponentToggleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('imported')).toBeInTheDocument();
    });
    // Non-matched feature renders fallback synchronously
    expect(screen.getByText('fallback')).toBeInTheDocument();
    expect(importFn).toHaveBeenCalledTimes(1);
  });

  it('calls importFn for all sub-features when flag key has no slash (prefix match)', async () => {
    const prefix = uniqueFeature('feat');
    const importFn = vi
      .fn()
      .mockResolvedValue({ default: IMPORTED_VALUE });

    render(
      <ComponentToggleProvider
        flags={{ [prefix]: true }}
        importFn={importFn}
        maxFeatureDepth={2}
      >
        <Suspense fallback={<div>Loading A</div>}>
          <TestConsumer feature={`${prefix}/a`} />
        </Suspense>
        <Suspense fallback={<div>Loading B</div>}>
          <TestConsumer feature={`${prefix}/b`} />
        </Suspense>
      </ComponentToggleProvider>,
    );

    await waitFor(() => {
      expect(screen.getAllByText('imported')).toHaveLength(2);
    });
    expect(importFn).toHaveBeenCalledTimes(2);
  });

  it('throws error when feature depth exceeds maximum', () => {
    const feature = uniqueFeature('testFeature');
    const importFn = vi.fn();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(
        <ComponentToggleProvider
          flags={{ [feature]: true }}
          importFn={importFn}
          maxFeatureDepth={1}
        >
          <Suspense fallback={<div>Loading</div>}>
            <TestConsumer feature={`${feature}/nested/tooDeep`} />
          </Suspense>
        </ComponentToggleProvider>,
      );
    }).toThrow('Max feature depth is 1');

    consoleError.mockRestore();
  });

  it('throws error when used outside provider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(
        <Suspense fallback={<div>Loading</div>}>
          <TestConsumer feature="anyFeature" />
        </Suspense>,
      );
    }).toThrow(
      'useComponentToggleContext must be used within a ComponentToggleProvider',
    );

    consoleError.mockRestore();
  });
});
