import * as React from 'react'

import { cn } from '~/lib/cn'

export type TnNoticeBarProps = {
  text: string
  mode?: 'closeable' | 'link'
  color?: string
  backgroundColor?: string
  className?: string
}

export const TnNoticeBar: React.FC<TnNoticeBarProps> = ({
  text = '这是一条通知消息',
  mode = 'closeable',
  color = '#ed6a0c',
  backgroundColor = '#fffbe8',
  className,
}) => {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    <div
      className={cn('flex items-center px-4 py-2 rounded', className)}
      style={{ color, backgroundColor }}
    >
      <div className="flex-1 text-sm">{text}</div>
      {mode === 'closeable' && (
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="ml-2 hover:opacity-70"
        >
          ✕
        </button>
      )}
      {mode === 'link' && (
        <span className="ml-2 text-sm">查看更多 &rsaquo;</span>
      )}
    </div>
  )
}
