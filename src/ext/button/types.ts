import { ComponentToggleProps } from '../../../lib/components/ComponentToggle/types'
import { MyFeatures } from '../../config'

export interface ButtonFeatureProps extends ComponentToggleProps<MyFeatures> {
  label: string
  onClick: () => void
}
