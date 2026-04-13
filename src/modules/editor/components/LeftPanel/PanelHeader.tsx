import * as React from 'react'
import { useLocation, useNavigate } from 'react-router'

import type { LeftPanelTab } from '~/atoms/editor'
import { useLeftPanelTabValue, useSetLeftPanelTab } from '~/atoms/editor'
import { cn } from '~/lib/cn'

const tabs: { key: LeftPanelTab; label: string }[] = [
  { key: 'layers', label: '图层' },
  { key: 'resources', label: '资源' },
]

export const PanelHeader: React.FC = () => {
  const activeTab = useLeftPanelTabValue()
  const setTab = useSetLeftPanelTab()
  const navigate = useNavigate()
  const location = useLocation()
  const fileName =
    (location.state as { fileName?: string } | null)?.fileName ?? '未命名文件'

  return (
    <div className="flex flex-col border-b border-border">
      {/* 面包屑 */}
      <div className="flex items-center gap-1 px-3 py-2 text-xs text-text-tertiary select-none">
        <span
          className="cursor-pointer hover:text-text transition-colors truncate"
          onClick={() => navigate('/')}
        >
          草稿箱
        </span>
        <span className="opacity-50">/</span>
        <span className="truncate text-text">{fileName}</span>
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
