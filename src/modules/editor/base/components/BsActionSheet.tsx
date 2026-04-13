import * as React from 'react'

import { cn } from '~/lib/cn'

type ActionSheetItem = {
  text: string
  danger?: boolean
  onClick?: () => void
}

type BsActionSheetProps = {
  visible?: boolean
  title?: string
  items?: ActionSheetItem[]
  cancelText?: string
  onCancel?: () => void
  className?: string
}

export const BsActionSheet: React.FC<BsActionSheetProps> = ({
  visible = false,
  title,
  items = [
    { text: '选项1' },
    { text: '选项2' },
    { text: '删除', danger: true },
  ],
  cancelText = '取消',
  onCancel,
  className,
}) => {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-bg-fill rounded-t-xl',
          className,
        )}
      >
        {title && (
          <div className="px-4 py-3 border-b border-border text-center text-text-secondary text-sm">
            {title}
          </div>
        )}
        <div className="py-1">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                item.onClick?.()
              }}
              className={cn(
                'w-full px-4 py-3 text-center text-base hover:bg-bg-fill-secondary',
                item.danger ? 'text-red-500' : 'text-text',
              )}
            >
              {item.text}
            </button>
          ))}
        </div>
        <div className="py-2 px-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="w-full px-4 py-3 text-center text-base text-text hover:bg-bg-fill-secondary rounded-lg"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
