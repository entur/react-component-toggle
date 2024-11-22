import { useState } from 'react'
import { FeatureFlagProvider, FeatureFlags, FeatureGate } from '../lib/main'
import type { ButtonFeatureProps } from './ext/button/types'
import './App.css'
import { MyFeatures } from './config'

export function App() {
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
          <FeatureGate<MyFeatures, ButtonFeatureProps>
            feature="button"
            label="Click me"
            onClick={() => setCount(count + 1)}
            renderFallback={() => <button>Button feature is disabled</button>}
          />
        </div>
      </div>
    </FeatureFlagProvider>
  )
}

export default App
