import * as React from 'react'

import { cn } from '~/lib/cn'

type TnCodeProps = {
  code?: string
  language?: string
  rounded?: number
  className?: string
}

export const TnCode: React.FC<TnCodeProps> = ({
  code = 'console.log("Hello World")',
  language = 'javascript',
  rounded = 6,
  className,
}) => {
  // _language 保留供未来使用
  const _language = language
  return (
    <div
      className={cn(
        'p-4 overflow-x-auto bg-bg-fill-secondary font-mono text-sm text-text',
        className,
      )}
      style={{ borderRadius: rounded }}
    >
      <pre>{code}</pre>
    </div>
  )
}
