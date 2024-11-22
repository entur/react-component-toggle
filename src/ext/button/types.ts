import { FeatureGateProps } from '../../../lib/components/FeatureGate/types'
import { MyFeatures } from '../../config'

export interface ButtonFeatureProps extends FeatureGateProps<MyFeatures> {
  label: string
  onClick: () => void
}
