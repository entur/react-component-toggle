import { useMemo } from 'react';
import { useComponentToggleContext } from './ComponentToggleProvider/context';
import { isFeatureEnabled } from './featureUtils';

type CacheEntry<T> =
  | { status: 'pending'; promise: Promise<void> }
  | { status: 'resolved'; value: T }
  | { status: 'rejected'; error: unknown };

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Hook to dynamically import an arbitrary module's default export behind a
 * feature flag, with code splitting.
 *
 * Unlike {@link ComponentToggle} (which lazy-loads React **components**), this
 * hook works with any default export: themes, configs, data objects, etc.
 *
 * When the feature is enabled the module is loaded via the provider's
 * `importFn` and its `default` export is returned.  When the feature is
 * disabled, `fallback()` is returned synchronously without calling `importFn`.
 *
 * The hook suspends via the Suspense protocol so the consuming component
 * **must** be wrapped in a `<Suspense>` boundary.  The component renders
 * exactly once with the correct value — no double render.
 *
 * @example
 * ```tsx
 * const ThemeLoader = ({ children }) => {
 *   const theme = useToggledImport<Theme>(
 *     `${extPath}/CustomTheme`,
 *     () => createTheme(),
 *   );
 *   return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
 * };
 *
 * // Wrap in Suspense — required because the hook suspends while loading
 * <Suspense>
 *   <ThemeLoader>{children}</ThemeLoader>
 * </Suspense>
 * ```
 *
 * @template T - The type of the imported default export
 * @param feature - Feature path string (e.g. "Entur/CustomTheme")
 * @param fallback - Factory that returns the default value when the feature is disabled
 * @returns The imported default export or the fallback value
 */
export function useToggledImport<T>(feature: string, fallback: () => T): T {
  const { flags, importFn, maxFeatureDepth = 1 } = useComponentToggleContext();

  const splitFeature = useMemo(() => feature.split('/'), [feature]);

  if (splitFeature.length > maxFeatureDepth) {
    throw new Error(`Max feature depth is ${maxFeatureDepth}`);
  }

  const featureEnabled = useMemo(
    () => flags && isFeatureEnabled(flags, feature),
    [flags, feature],
  );

  if (!featureEnabled) {
    return fallback();
  }

  let entry = cache.get(feature) as CacheEntry<T> | undefined;

  if (!entry) {
    const promise = importFn(splitFeature).then(
      (m) => {
        cache.set(feature, { status: 'resolved', value: m.default as T });
      },
      (error) => {
        cache.set(feature, { status: 'rejected', error });
      },
    );
    entry = { status: 'pending', promise };
    cache.set(feature, entry);
  }

  if (entry.status === 'pending') {
    throw entry.promise;
  }

  if (entry.status === 'rejected') {
    throw entry.error;
  }

  return entry.value;
}
