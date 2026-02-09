/**
 * Check if a feature is enabled based on feature flags.
 *
 * Supports two matching modes:
 * - **Exact match**: If the flag key contains a slash (e.g. "Entur/CustomLogo"),
 *   it only enables that exact feature.
 * - **Prefix match**: If the flag key has no slash (e.g. "Entur"),
 *   it enables all features whose first path segment matches.
 */
export function isFeatureEnabled(
  featureFlags: Record<string, boolean>,
  feature: string,
): boolean {
  const splitFeature = feature.split('/');
  return Object.entries(featureFlags).some(([key, value]) => {
    if (!value) return false;
    if (key.includes('/')) return key === feature;
    return key === splitFeature[0];
  });
}
