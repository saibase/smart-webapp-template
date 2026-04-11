import * as React from 'react'
import { useState } from 'react'

import { Input } from '~/components/ui/input/Input'
import { cn } from '~/lib/cn'

import type { ComponentMeta } from '../../editor/registry'
import { componentRegistry } from '../../editor/registry'

type ComponentPanelProps = {
  className?: string
}

export const ComponentPanel: React.FC<ComponentPanelProps> = ({
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    基础: true,
    表单: true,
  })

  // 按分类分组组件
  const groupedComponents = componentRegistry.reduce(
    (acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    },
    {} as Record<string, ComponentMeta[]>,
  )

  // 过滤组件
  const filteredGroups = Object.entries(groupedComponents).reduce(
    (acc, [category, components]) => {
      const filtered = components.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      if (filtered.length > 0) {
        acc[category] = filtered
      }
      return acc
    },
    {} as Record<string, ComponentMeta[]>,
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('componentId', componentId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 w-64 border-r bg-bg-fill p-4 overflow-y-auto h-screen z-50 shadow-lg',
        className,
      )}
    >
      <h2 className="text-lg font-semibold mb-4 text-text">组件库</h2>
      <Input
        type="search"
        placeholder="搜索组件..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />

      <div className="space-y-3">
        {Object.entries(filteredGroups).map(([category, components]) => (
          <div key={category} className="border-b border-border pb-3">
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full text-left font-medium text-text-secondary mb-2 hover:text-text transition-colors"
            >
              <span>{category}</span>
              <span>{expandedCategories[category] ? '−' : '+'}</span>
            </button>
            {expandedCategories[category] && (
              <div className="space-y-2">
                {components.map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.id)}
                    className="p-2 hover:bg-bg-accent rounded cursor-move border border-border hover:border-primary transition-colors"
                  >
                    <span className="text-sm text-text">{component.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
