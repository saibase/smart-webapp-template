import * as React from 'react'

import {
  deleteSelectedElements,
  updateElementProps,
  useSelectedElementsValue,
} from '~/atoms/editor'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion/Accordion'
import { Button } from '~/components/ui/button/Button'
import { Input } from '~/components/ui/input/Input'
import { cn } from '~/lib/cn'

type PropsPanelProps = {
  className?: string
}

export const PropsPanel: React.FC<PropsPanelProps> = ({ className }) => {
  const selectedElements = useSelectedElementsValue()
  const selectedCount = selectedElements.length

  if (selectedCount === 0) {
    return (
      <aside
        className={cn(
          'fixed right-0 top-0 w-64 border-l bg-bg-fill p-4 overflow-y-auto h-screen z-50 shadow-lg',
          className,
        )}
      >
        <div className="flex items-center justify-center h-full text-text-secondary">
          <p>请选择一个或多个元素进行编辑</p>
        </div>
      </aside>
    )
  }

  // For multiple selection, only edit the first element
  // This is a simple approach - bulk editing can be added later if needed
  const selected = selectedElements[0]

  const handlePropChange = (key: string, value: any) => {
    // 处理嵌套属性
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.')
      const currentValue = selected.props[parentKey] || {}
      updateElementProps(selected.id, {
        [parentKey]: { ...currentValue, [childKey]: value },
      })
    } else {
      updateElementProps(selected.id, { [key]: value })
    }
  }

  const handleDelete = () => {
    deleteSelectedElements()
  }

  // 动态生成输入项
  const renderProps = () => {
    const entries = Object.entries(selected.props)
    if (entries.length === 0) return null

    // 默认展开 style 属性
    const defaultOpen = ['style']

    return (
      <div className="space-y-4">
        <Accordion
          type="multiple"
          defaultValue={defaultOpen}
          className="w-full"
        >
          {entries.map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className="capitalize">
                    {key}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey}>
                          <label className="block text-sm font-medium text-text-secondary mb-1 capitalize">
                            {subKey}
                          </label>
                          {typeof subValue === 'string' &&
                          subValue.startsWith('#') ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={subValue}
                                onChange={(e) =>
                                  handlePropChange(
                                    `${key}.${subKey}`,
                                    e.target.value,
                                  )
                                }
                                className="w-10 h-8 rounded overflow-hidden cursor-pointer border border-border"
                              />
                              <Input
                                value={subValue}
                                onChange={(e) =>
                                  handlePropChange(
                                    `${key}.${subKey}`,
                                    e.target.value,
                                  )
                                }
                                className="flex-1"
                              />
                            </div>
                          ) : (
                            <Input
                              value={String(subValue)}
                              onChange={(e) =>
                                handlePropChange(
                                  `${key}.${subKey}`,
                                  e.target.value,
                                )
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            }

            return (
              <div key={key}>
                <label className="block text-sm font-medium text-text-secondary mb-1 capitalize">
                  {key}
                </label>
                {typeof value === 'string' && value.startsWith('#') ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handlePropChange(key, e.target.value)}
                      className="w-10 h-8 rounded overflow-hidden cursor-pointer border border-border"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handlePropChange(key, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ) : (
                  <Input
                    value={String(value)}
                    onChange={(e) => handlePropChange(key, e.target.value)}
                  />
                )}
              </div>
            )
          })}
        </Accordion>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 w-64 border-l bg-bg-fill p-4 overflow-y-auto h-screen z-50 shadow-lg',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text">属性面板</h2>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          删除{selectedCount > 1 ? ` (${selectedCount})` : ''}
        </Button>
      </div>

      <div className="mb-4">
        {selectedCount > 1 && (
          <p className="text-sm text-text-secondary mb-2">
            <span className="font-medium text-text">
              {selectedCount} 个元素已选中
            </span>
          </p>
        )}
        <p className="text-sm text-text-secondary">
          元素类型:{' '}
          <span className="font-medium text-text">{selected.type}</span>
        </p>
        <p className="text-sm text-text-secondary">
          ID:{' '}
          <span className="font-medium text-text">
            {selected.id.slice(0, 8)}
          </span>
          {selectedCount > 1 && ` (+ ${selectedCount - 1})`}
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['general']} className="w-full">
        <AccordionItem value="general">
          <AccordionTrigger>基础属性</AccordionTrigger>
          <AccordionContent>{renderProps()}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  )
}
