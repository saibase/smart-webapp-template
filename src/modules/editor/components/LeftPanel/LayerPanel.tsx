import * as React from 'react'

import {
  useLayerSearchQueryValue,
  useLayerSearchVisibleValue,
  useSetLayerSearchQuery,
} from '~/atoms/editor'

import { LayerToolbar } from './LayerToolbar'
import { LayerTree } from './LayerTree'

export const LayerPanel: React.FC = () => {
  const searchVisible = useLayerSearchVisibleValue()
  const searchQuery = useLayerSearchQueryValue()
  const setSearchQuery = useSetLayerSearchQuery()

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* 区域 2：工具栏 */}
      <LayerToolbar />

      {/* 区域 4：图层搜索框（按需展示）*/}
      {searchVisible && (
        <div className="px-2 py-1.5 border-b border-border shrink-0">
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
              autoFocus
              type="text"
              placeholder="搜索图层…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xs bg-transparent outline-none text-text placeholder:text-text-tertiary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-text-tertiary hover:text-text transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* 区域 5：图层树列表（核心，可滚动）*/}
      <div className="flex-1 overflow-y-auto">
        <LayerTree />
      </div>
    </div>
  )
}
