import * as React from 'react'

import { cn } from '~/lib/cn'

type TnTabbarItem = {
  text: string
  icon?: string
  active?: boolean
}

type TnTabbarProps = {
  items?: TnTabbarItem[]
  fixed?: boolean
  bgColor?: string
  activeColor?: string
  inactiveColor?: string
  className?: string
}

export const TnTabbar: React.FC<TnTabbarProps> = ({
  items = [{ text: '首页', active: true }, { text: '分类' }, { text: '我的' }],
  fixed = true,
  bgColor,
  activeColor = '#3b82f6',
  inactiveColor = '#6b7280',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex border-t border-border bg-bg-fill',
        fixed && 'fixed bottom-0 left-0 right-0 z-50',
        className,
      )}
      style={{ backgroundColor: bgColor }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="flex-1 flex flex-col items-center justify-center py-2 cursor-pointer"
          style={{
            color: item.active ? activeColor : inactiveColor,
          }}
        >
          {item.icon && <div className="mb-1 text-lg">{item.icon}</div>}
          <span className="text-xs">{item.text}</span>
        </div>
      ))}
    </div>
  )
}
