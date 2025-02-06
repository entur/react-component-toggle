import { FeatureComponent } from '../../../../lib/components/ComponentToggle/types'

export interface ButtonProps {
  label: string
  onClick: () => void
}

export type Button = FeatureComponent<ButtonProps>;
