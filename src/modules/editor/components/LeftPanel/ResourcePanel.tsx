import * as React from 'react'
import { useState } from 'react'

import type { ResourceTab } from '~/atoms/editor'
import { useResourceTabValue, useSetResourceTab } from '~/atoms/editor'
import { cn } from '~/lib/cn'
import type {
  ComponentCategory,
  ComponentMeta,
} from '~/modules/editor/registry'
import { fullComponentRegistry } from '~/modules/editor/registry'

// ── 资源来源筛选 ─────────────────────────────────────
type SourceFilter = 'all' | 'local'

// ── 底部扩展组件库 ───────────────────────────────────
const extLibraries = [
  { name: '线框图组件', icon: '▣' },
  { name: 'Ant Design', icon: '🐜' },
  { name: 'SmartUi Design', icon: '✦' },
]

// ── 分类展示顺序 ─────────────────────────────────────
const CATEGORY_ORDER: ComponentCategory[] = [
  '基础',
  '容器',
  '导航',
  '表单',
  '反馈',
  '展示',
  '业务',
  '其他',
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
    <div className="w-full h-10 rounded bg-fill-secondary flex items-center justify-center text-text-tertiary select-none">
      <svg
        width="18"
        height="18"
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

// ── 分类区块（可折叠）───────────────────────────────
const CategorySection: React.FC<{
  category: ComponentCategory
  components: ComponentMeta[]
}> = ({ category, components }) => {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-1">
      {/* 分类标题 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-1 py-1 text-[11px] font-medium text-text-secondary hover:text-text transition-colors"
      >
        <span className="flex items-center gap-1">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transition: 'transform 0.15s',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          {category}
        </span>
        <span className="text-[10px] text-text-tertiary">
          {components.length}
        </span>
      </button>

      {/* 组件卡片网格 */}
      {open && (
        <div className="grid grid-cols-2 gap-1.5 pb-1">
          {components.map((meta) => (
            <ComponentCard key={meta.id} meta={meta} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── 占位内容 ─────────────────────────────────────────
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

  // 过滤并按分类分组
  const filtered = fullComponentRegistry.filter((c) => {
    if (!searchQuery) return true
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // 按 CATEGORY_ORDER 分组
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    components: filtered.filter((c) => c.category === cat),
  })).filter((g) => g.components.length > 0)

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
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-text-tertiary hover:text-text transition-colors"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 资源内容区 */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {activeTab === 'components' && (
          <>
            {grouped.length === 0 ? (
              <div className="text-xs text-text-tertiary text-center py-8">
                未找到匹配组件
              </div>
            ) : (
              grouped.map(({ category, components }) => (
                <CategorySection
                  key={category}
                  category={category}
                  components={components}
                />
              ))
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
