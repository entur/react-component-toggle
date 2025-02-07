import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentToggleProvider, useComponentToggleContext } from '../../lib/main';

describe('ComponentToggleProvider', () => {
  type TestFeatures = {
    testFeature: boolean;
    otherFeature: boolean;
  };

  const TestConsumer = () => {
    const { isEnabled } = useComponentToggleContext();
    return (
      <div>
        <div>Test Feature: {isEnabled('testFeature').toString()}</div>
        <div>Other Feature: {isEnabled('otherFeature').toString()}</div>
      </div>
    );
  };

  it('provides feature flags to consumers', () => {
    render(
      <ComponentToggleProvider
        flags={{ testFeature: true, otherFeature: false }}
        importFn={() => Promise.resolve({ default: () => null })}
      >
        <TestConsumer />
      </ComponentToggleProvider>
    );

    expect(screen.getByText('Test Feature: true')).toBeInTheDocument();
    expect(screen.getByText('Other Feature: false')).toBeInTheDocument();
  });

  it('updates feature flags when they change', () => {
    const { rerender } = render(
      <ComponentToggleProvider
        flags={{ testFeature: true, otherFeature: false }}
        importFn={() => Promise.resolve({ default: () => null })}
      >
        <TestConsumer />
      </ComponentToggleProvider>
    );

    expect(screen.getByText('Test Feature: true')).toBeInTheDocument();

    rerender(
      <ComponentToggleProvider
        flags={{ testFeature: false, otherFeature: true }}
        importFn={() => Promise.resolve({ default: () => null })}
      >
        <TestConsumer />
      </ComponentToggleProvider>
    );

    expect(screen.getByText('Test Feature: false')).toBeInTheDocument();
    expect(screen.getByText('Other Feature: true')).toBeInTheDocument();
  });

  it('supports nested providers with flag overrides', () => {
    render(
      <ComponentToggleProvider
        flags={{ testFeature: true, otherFeature: false }}
        importFn={() => Promise.resolve({ default: () => null })}
      >
        <div>
          <TestConsumer />
          <ComponentToggleProvider
            flags={{ testFeature: false }}
            importFn={() => Promise.resolve({ default: () => null })}
          >
            <TestConsumer />
          </ComponentToggleProvider>
        </div>
      </ComponentToggleProvider>
    );

    const results = screen.getAllByText(/Test Feature:/);
    expect(results[0]).toHaveTextContent('Test Feature: true');
    expect(results[1]).toHaveTextContent('Test Feature: false');
  });

  it('throws error when importFn is not provided', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(
        <ComponentToggleProvider flags={{ testFeature: true }}>
          <TestConsumer />
        </ComponentToggleProvider>
      );
    }).toThrowError('importFn is required');

    consoleError.mockRestore();
  });
});
