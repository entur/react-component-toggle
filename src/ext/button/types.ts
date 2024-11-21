import { SandboxFeatureProps } from '../../../lib/components/SandboxFeature/types'
import { FeatureFlags } from '../../App'

export interface ButtonFeatureProps extends SandboxFeatureProps<FeatureFlags> {
  label: string
  onClick: () => void
  className?: string
}
