import * as React from 'react'

import {
  deleteSelectedElement,
  updateElementProps,
  useSelectedElementValue,
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
  const selected = useSelectedElementValue()

  if (!selected) {
    return (
      <aside
        className={cn(
          'w-64 border-l bg-bg-fill p-4 overflow-y-auto h-screen',
          className,
        )}
      >
        <div className="flex items-center justify-center h-full text-text-secondary">
          <p>请选择一个元素进行编辑</p>
        </div>
      </aside>
    )
  }

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
    deleteSelectedElement()
  }

  // 动态生成输入项
  const renderProps = () => {
    const entries = Object.entries(selected.props)
    if (entries.length === 0) return null

    return (
      <div className="space-y-4">
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
      </div>
    )
  }

  return (
    <aside
      className={cn(
        'w-64 border-l bg-bg-fill p-4 overflow-y-auto h-screen',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text">属性面板</h2>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          删除
        </Button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-text-secondary">
          元素类型:{' '}
          <span className="font-medium text-text">{selected.type}</span>
        </p>
        <p className="text-sm text-text-secondary">
          ID:{' '}
          <span className="font-medium text-text">
            {selected.id.slice(0, 8)}
          </span>
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="general">
          <AccordionTrigger>基础属性</AccordionTrigger>
          <AccordionContent>{renderProps()}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  )
}
