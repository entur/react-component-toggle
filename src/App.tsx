import { useState } from 'react'
import { FeatureFlagProvider, SandboxFeature } from '../lib/main'
import type { ButtonFeatureProps } from './ext/button/types'
import './App.css'

export type FeatureFlags = {
  button: boolean
}

function App() {
  const [count, setCount] = useState(0)
  const [featureEnabled, setFeatureEnabled] = useState(false)

  const featureFlags: FeatureFlags = {
    button: featureEnabled
  }

  return (
    <FeatureFlagProvider 
      flags={featureFlags} 
      extBasePath="/src/ext"
    >
      <div>
        <h1>Sandbox Feature Demo</h1>
        <div className="feature-toggle">
          <label>
            <input
              type="checkbox"
              checked={featureEnabled}
              onChange={(e) => setFeatureEnabled(e.target.checked)}
            />
            Enable Button Feature
          </label>
        </div>
        <div className="card">
          <SandboxFeature<FeatureFlags, ButtonFeatureProps>
            feature="button"
            label={`Count is ${count}`}
            onClick={() => setCount(count => count + 1)}
            renderFallback={() => (
              <pre>Sorry this feature is not enabled</pre>
            )}
          />
        </div>
      </div>
    </FeatureFlagProvider>
  )
}

export default App
