import * as React from 'react'

import { cn } from '~/lib/cn'

type BsFormProps = {
  labelPosition?: 'top' | 'left'
  labelWidth?: number
  className?: string
  children?: React.ReactNode
}

export const BsForm: React.FC<BsFormProps> = ({
  labelPosition = 'top',
  labelWidth = 100,
  className,
  children,
}) => {
  // 保留供未来使用
  const _labelPosition = labelPosition
  const _labelWidth = labelWidth
  return (
    <form
      className={cn('flex flex-col gap-4', className)}
      style={{
        gap: 16,
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      {children}
    </form>
  )
}
