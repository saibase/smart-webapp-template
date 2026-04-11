import * as React from 'react'

import { useEditorConfig } from '~/atoms/editor'
import { Button } from '~/components/ui/button/Button'
import { cn } from '~/lib/cn'

type DeviceToolbarProps = {
  className?: string
}

export const DeviceToolbar: React.FC<DeviceToolbarProps> = ({ className }) => {
  const [{ scale, device }, setEditorConfig] = useEditorConfig()

  const changeDevice = (newDevice: 'mobile' | 'tablet' | 'desktop') => {
    setEditorConfig((prev) => ({ ...prev, device: newDevice }))
  }

  const changeScale = (delta: number) => {
    setEditorConfig((prev) => ({
      ...prev,
      scale: Math.max(50, Math.min(150, prev.scale + delta)),
    }))
  }

  const devices = [
    { id: 'mobile' as const, label: '手机', icon: '📱' },
    { id: 'tablet' as const, label: '平板', icon: '📱' },
    { id: 'desktop' as const, label: '桌面', icon: '🖥️' },
  ]

  return (
    <div
      className={cn(
        'absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-bg-fill border border-border rounded-lg shadow-lg p-1 z-10',
        className,
      )}
    >
      {devices.map((d) => (
        <Button
          key={d.id}
          variant={device === d.id ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => changeDevice(d.id)}
          className="px-3"
        >
          <span className="mr-1">{d.icon}</span>
          {d.label}
        </Button>
      ))}

      <div className="h-6 w-px bg-border mx-1" />

      <Button variant="ghost" size="sm" onClick={() => changeScale(-10)}>
        −
      </Button>
      <span className="text-sm font-medium min-w-[3rem] text-center">
        {scale}%
      </span>
      <Button variant="ghost" size="sm" onClick={() => changeScale(10)}>
        +
      </Button>
    </div>
  )
}
