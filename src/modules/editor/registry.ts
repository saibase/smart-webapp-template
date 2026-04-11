import { Button } from './components/Button'
import { Frame } from './components/Frame'
import { Heading } from './components/Heading'
import { Input } from './components/Input'
import { Text } from './components/Text'

export type ComponentCategory = '基础' | '容器' | '表单'

export type ComponentMeta = {
  id: string
  name: string
  category: ComponentCategory
  defaultProps: Record<string, any>
  component: React.ComponentType<any>
}

export const componentRegistry: ComponentMeta[] = [
  {
    id: 'heading',
    name: '标题',
    category: '基础',
    defaultProps: { content: '标题', level: 1, style: { color: '#000000' } },
    component: Heading,
  },
  {
    id: 'text',
    name: '文本',
    category: '基础',
    defaultProps: {
      content: '这是一段文本内容',
      style: { color: '#333333', fontSize: '16px' },
    },
    component: Text,
  },
  {
    id: 'button',
    name: '按钮',
    category: '基础',
    defaultProps: {
      text: '按钮',
      style: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '8px 16px',
        borderRadius: '4px',
      },
    },
    component: Button,
  },
  {
    id: 'input',
    name: '输入框',
    category: '表单',
    defaultProps: {
      placeholder: '请输入内容',
      style: {
        width: '200px',
        padding: '8px 12px',
        borderRadius: '4px',
        borderColor: '#dddddd',
      },
    },
    component: Input,
  },
  {
    id: 'frame-mobile',
    name: '手机容器',
    category: '容器',
    defaultProps: {
      width: 375,
      height: 667,
      backgroundColor: '#ffffff',
      padding: 0,
    },
    component: Frame,
  },
  {
    id: 'frame-tablet',
    name: '平板容器',
    category: '容器',
    defaultProps: {
      width: 768,
      height: 1024,
      backgroundColor: '#ffffff',
      padding: 0,
    },
    component: Frame,
  },
  {
    id: 'frame-desktop',
    name: '桌面容器',
    category: '容器',
    defaultProps: {
      width: 1440,
      height: 1024,
      backgroundColor: '#ffffff',
      padding: 0,
    },
    component: Frame,
  },
]

export const getComponentById = (id: string): ComponentMeta | undefined => {
  return componentRegistry.find((c) => c.id === id)
}

export const getComponentsByCategory = (
  category: ComponentCategory,
): ComponentMeta[] => {
  return componentRegistry.filter((c) => c.category === category)
}
