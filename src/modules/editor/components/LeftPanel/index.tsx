import * as React from 'react'

import { useLeftPanelTabValue } from '~/atoms/editor'
import { cn } from '~/lib/cn'

import { LayerPanel } from './LayerPanel'
import { PanelHeader } from './PanelHeader'
import { ResourcePanel } from './ResourcePanel'

type LeftPanelProps = {
  className?: string
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ className }) => {
  const activeTab = useLeftPanelTabValue()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 w-64 h-screen z-50',
        'flex flex-col',
        'bg-bg-fill border-r border-border shadow-lg',
        className,
      )}
    >
      {/* 区域 1：面包屑 + Tab */}
      <PanelHeader />

      {/* 内容区域切换 */}
      {activeTab === 'layers' ? (
        // 区域 2-5：图层模块
        <LayerPanel />
      ) : (
        // 区域 6：资源面板
        <ResourcePanel />
      )}
    </aside>
  )
}
