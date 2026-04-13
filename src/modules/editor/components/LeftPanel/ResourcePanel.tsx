import * as React from 'react'
import { useState } from 'react'

import type { ResourceTab } from '~/atoms/editor'
import { useResourceTabValue, useSetResourceTab } from '~/atoms/editor'
import { cn } from '~/lib/cn'
import type { ComponentMeta } from '~/modules/editor/registry'
import { fullComponentRegistry } from '~/modules/editor/registry'

// ── 资源来源筛选 ─────────────────────────────────────
type SourceFilter = 'all' | 'local'

// ── 底部扩展组件库 ───────────────────────────────────
const extLibraries = [
  { name: '线框图组件', icon: '▣' },
  { name: 'Ant Design', icon: '🐜' },
  { name: 'MasterGo Design', icon: '✦' },
]

// ── 资源子 Tab 配置 ──────────────────────────────────
const resourceTabs: { key: ResourceTab; label: string }[] = [
  { key: 'components', label: '组件' },
  { key: 'images', label: '图片' },
  { key: 'icons', label: '图标' },
  { key: 'text', label: '文本' },
]

// ── 拖拽启动 ────────────────────────────────────────
const handleDragStart = (e: React.DragEvent, componentId: string) => {
  e.dataTransfer.setData('componentId', componentId)
  e.dataTransfer.effectAllowed = 'copy'
}

// ── 组件卡片 ────────────────────────────────────────
const ComponentCard: React.FC<{ meta: ComponentMeta }> = ({ meta }) => (
  <div
    draggable
    onDragStart={(e) => handleDragStart(e, meta.id)}
    title={meta.name}
    className="flex flex-col items-center gap-1 p-2 rounded border border-border hover:border-primary hover:bg-primary/5 cursor-move transition-colors"
  >
    <div className="w-full h-10 rounded bg-fill-secondary flex items-center justify-center text-text-tertiary text-lg select-none">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    </div>
    <span className="text-[10px] text-text-secondary text-center leading-tight truncate w-full">
      {meta.name}
    </span>
  </div>
)

// ── 占位内容（图片 / 图标 / 文本 Tab 暂未实现）────────
const PlaceholderContent: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-tertiary">
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2v20M2 12h20" />
    </svg>
    <span className="text-xs">{label}功能即将上线</span>
  </div>
)

export const ResourcePanel: React.FC = () => {
  const activeTab = useResourceTabValue()
  const setTab = useSetResourceTab()
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 过滤组件列表
  const allComponents = fullComponentRegistry
  const filteredComponents = allComponents.filter((c) => {
    if (!searchQuery) return true
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="flex flex-col h-full">
      {/* 资源分类 Tab */}
      <div className="flex border-b border-border shrink-0">
        {resourceTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTab(tab.key)}
            className={cn(
              'flex-1 py-1.5 text-xs font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 来源筛选栏 */}
      <div className="flex gap-2 px-3 py-2 shrink-0">
        <button
          type="button"
          onClick={() => setSourceFilter('all')}
          className={cn(
            'text-xs px-2 py-0.5 rounded-full transition-colors',
            sourceFilter === 'all'
              ? 'bg-primary text-white'
              : 'bg-fill-secondary text-text-secondary hover:text-text',
          )}
        >
          所有团队库
        </button>
        <button
          type="button"
          onClick={() => setSourceFilter('local')}
          className={cn(
            'text-xs px-2 py-0.5 rounded-full transition-colors',
            sourceFilter === 'local'
              ? 'bg-primary text-white'
              : 'bg-fill-secondary text-text-secondary hover:text-text',
          )}
        >
          本地
        </button>
      </div>

      {/* 搜索框 */}
      <div className="px-3 pb-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-border bg-fill-secondary focus-within:border-primary transition-colors">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-text-tertiary shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="搜索资源…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none text-text placeholder:text-text-tertiary"
          />
        </div>
      </div>

      {/* 资源内容区 */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {activeTab === 'components' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              {filteredComponents.map((meta) => (
                <ComponentCard key={meta.id} meta={meta} />
              ))}
            </div>
            {filteredComponents.length === 0 && (
              <div className="text-xs text-text-tertiary text-center py-8">
                未找到匹配组件
              </div>
            )}
          </>
        )}
        {activeTab === 'images' && <PlaceholderContent label="图片" />}
        {activeTab === 'icons' && <PlaceholderContent label="图标" />}
        {activeTab === 'text' && <PlaceholderContent label="文本样式" />}
      </div>

      {/* 底部扩展组件库 */}
      <div className="shrink-0 border-t border-border px-3 py-2">
        <p className="text-[10px] text-text-tertiary mb-1.5 font-medium uppercase tracking-wider">
          扩展组件库
        </p>
        <div className="flex flex-col gap-1">
          {extLibraries.map((lib) => (
            <button
              key={lib.name}
              type="button"
              className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-text-secondary hover:bg-fill-secondary hover:text-text transition-colors text-left"
            >
              <span className="text-base">{lib.icon}</span>
              {lib.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
