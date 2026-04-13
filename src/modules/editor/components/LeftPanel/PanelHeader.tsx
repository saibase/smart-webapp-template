import * as React from 'react'

import type { LeftPanelTab } from '~/atoms/editor'
import { useLeftPanelTabValue, useSetLeftPanelTab } from '~/atoms/editor'
import { cn } from '~/lib/cn'

// 面包屑路径数据（实际项目中可接入路由）
const breadcrumbs = ['草稿箱', '积分签到']

const tabs: { key: LeftPanelTab; label: string }[] = [
  { key: 'layers', label: '图层' },
  { key: 'resources', label: '资源' },
]

export const PanelHeader: React.FC = () => {
  const activeTab = useLeftPanelTabValue()
  const setTab = useSetLeftPanelTab()

  return (
    <div className="flex flex-col border-b border-border">
      {/* 面包屑 */}
      <div className="flex items-center gap-1 px-3 py-2 text-xs text-text-tertiary select-none">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i > 0 && <span className="opacity-50">/</span>}
            <span className="cursor-pointer hover:text-text transition-colors truncate">
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* 图层 / 资源 Tab */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTab(tab.key)}
            className={cn(
              'flex-1 py-1.5 text-xs font-medium transition-colors border-b-2',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
