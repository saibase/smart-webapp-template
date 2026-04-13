import { baseComponents } from '~/modules/editor/base/base-data'
import { BsActionSheet } from '~/modules/editor/base/components/BsActionSheet'
import { BsAvatar } from '~/modules/editor/base/components/BsAvatar'
import { BsBadge } from '~/modules/editor/base/components/BsBadge'
import { BsButton } from '~/modules/editor/base/components/BsButton'
import { BsCalendar } from '~/modules/editor/base/components/BsCalendar'
import { BsCard } from '~/modules/editor/base/components/BsCard'
import { BsCheckbox } from '~/modules/editor/base/components/BsCheckbox'
import { BsCircleProgress } from '~/modules/editor/base/components/BsCircleProgress'
import { BsCode } from '~/modules/editor/base/components/BsCode'
import { BsCollapse } from '~/modules/editor/base/components/BsCollapse'
import { BsCountdown } from '~/modules/editor/base/components/BsCountdown'
import { BsDatePicker } from '~/modules/editor/base/components/BsDatePicker'
import { BsDivider } from '~/modules/editor/base/components/BsDivider'
import { BsDrawer } from '~/modules/editor/base/components/BsDrawer'
import { BsEmpty } from '~/modules/editor/base/components/BsEmpty'
import { BsForm } from '~/modules/editor/base/components/BsForm'
import { BsGridList } from '~/modules/editor/base/components/BsGridList'
import { BsIcon } from '~/modules/editor/base/components/BsIcon'
import { BsInput } from '~/modules/editor/base/components/BsInput'
import { BsList } from '~/modules/editor/base/components/BsList'
import { BsLoading } from '~/modules/editor/base/components/BsLoading'
import { BsModal } from '~/modules/editor/base/components/BsModal'
// Import all base components (named exports)
import { BsNavbar } from '~/modules/editor/base/components/BsNavbar'
import { BsNoticeBar } from '~/modules/editor/base/components/BsNoticeBar'
import { BsPagination } from '~/modules/editor/base/components/BsPagination'
import { BsPopup } from '~/modules/editor/base/components/BsPopup'
import { BsProgress } from '~/modules/editor/base/components/BsProgress'
import { BsRadio } from '~/modules/editor/base/components/BsRadio'
import { BsRate } from '~/modules/editor/base/components/BsRate'
import { BsResult } from '~/modules/editor/base/components/BsResult'
import { BsSearch } from '~/modules/editor/base/components/BsSearch'
import { BsSelect } from '~/modules/editor/base/components/BsSelect'
import { BsSkeleton } from '~/modules/editor/base/components/BsSkeleton'
import { BsSlider } from '~/modules/editor/base/components/BsSlider'
import { BsSteps } from '~/modules/editor/base/components/BsSteps'
import { BsSticky } from '~/modules/editor/base/components/BsSticky'
import { BsSwiper } from '~/modules/editor/base/components/BsSwiper'
import { BsSwitch } from '~/modules/editor/base/components/BsSwitch'
import { BsTabbar } from '~/modules/editor/base/components/BsTabbar'
import { BsTag } from '~/modules/editor/base/components/BsTag'
import { BsTextarea } from '~/modules/editor/base/components/BsTextarea'
import { BsToast } from '~/modules/editor/base/components/BsToast'
import { BsUpload } from '~/modules/editor/base/components/BsUpload'

import { Button } from './components/Button'
import { Frame } from './components/Frame'
import { Heading } from './components/Heading'
import { Input } from './components/Input'
import { Text } from './components/Text'

export type ComponentCategory =
  | '基础'
  | '容器'
  | '表单'
  | '导航'
  | '反馈'
  | '展示'
  | '业务'
  | '其他'

export type ComponentMeta = {
  id: string
  name: string
  category: ComponentCategory
  defaultProps: Record<string, any>
  component: React.ComponentType<any>
  icon?: string
}

export const componentRegistry: ComponentMeta[] = [
  {
    id: 'heading',
    name: '标题',
    category: '基础',
    defaultProps: {
      content: '标题',
      level: 1,
      style: {
        color: '#000000',
        fontSize: '32px',
        backgroundColor: 'transparent',
        width: 'auto',
        height: 'auto',
        padding: '0',
        margin: '0',
      },
    },
    component: Heading,
  },
  {
    id: 'text',
    name: '文本',
    category: '基础',
    defaultProps: {
      content: '这是一段文本内容',
      style: {
        color: '#333333',
        fontSize: '16px',
        backgroundColor: 'transparent',
        width: 'auto',
        height: 'auto',
        padding: '0',
        margin: '0',
      },
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
        fontSize: '16px',
        padding: '8px 16px',
        margin: '0',
        borderRadius: '4px',
        borderColor: '#3b82f6',
        borderWidth: '1px',
        borderStyle: 'solid',
        width: 'auto',
        height: 'auto',
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
        backgroundColor: '#ffffff',
        color: '#333333',
        fontSize: '16px',
        width: '200px',
        height: 'auto',
        padding: '8px 12px',
        margin: '0',
        borderRadius: '4px',
        borderColor: '#dddddd',
        borderWidth: '1px',
        borderStyle: 'solid',
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
      style: {
        borderRadius: '0',
        borderColor: '#e5e7eb',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        margin: '0',
      },
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
      style: {
        borderRadius: '0',
        borderColor: '#e5e7eb',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        margin: '0',
      },
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
      style: {
        borderRadius: '0',
        borderColor: '#e5e7eb',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        margin: '0',
      },
    },
    component: Frame,
  },
]

// 基础组件映射表
const baseComponentMap: Record<string, React.ComponentType<any>> = {
  navbar: BsNavbar,
  tabbar: BsTabbar,
  'search-box': BsSearch,
  swiper: BsSwiper,
  gridList: BsGridList,
  card: BsCard,
  textarea: BsTextarea,
  form: BsForm,
  checkbox: BsCheckbox,
  radio: BsRadio,
  select: BsSelect,
  'image-upload': BsUpload,
  rate: BsRate,
  slider: BsSlider,
  switch: BsSwitch,
  code: BsCode,
  divider: BsDivider,
  tag: BsTag,
  'line-progress': BsProgress,
  avatar: BsAvatar,
  list: BsList,
  'count-down': BsCountdown,
  skeleton: BsSkeleton,
  badge: BsBadge,
  calendar: BsCalendar,
  modal: BsModal,
  actionSheet: BsActionSheet,
  input: BsInput,
  button: BsButton,
  collapse: BsCollapse,
  popup: BsPopup,
  steps: BsSteps,
  sticky: BsSticky,
  empty: BsEmpty,
  'notice-bar': BsNoticeBar,
  loading: BsLoading,
  circleProgress: BsCircleProgress,
  pagination: BsPagination,
  drawer: BsDrawer,
  datePicker: BsDatePicker,
  icon: BsIcon,
  result: BsResult,
  toast: BsToast,
  loadmore: BsLoading,
}

// 合并图鸟组件到注册表
const FallbackComponent = () => <div>Not implemented</div>

// 类别名称映射（图鸟英文分类 -> 编辑器中文分类）
const categoryMap: Record<string, ComponentCategory> = {
  navigation: '导航',
  form: '表单',
  feedback: '反馈',
  display: '展示',
  container: '容器',
  business: '业务',
  other: '其他',
}

const baseRegistry: ComponentMeta[] = baseComponents.map((meta) => {
  // 从 props 提取 defaultProps
  const defaultProps: Record<string, any> = {}
  meta.props.forEach((prop) => {
    if (prop.default !== undefined && prop.default !== null) {
      defaultProps[prop.name] = prop.default
    }
  })

  // 类别映射
  const category = categoryMap[meta.category] || '其他'

  return {
    id: `bs-${meta.id}`,
    name: meta.title,
    category,
    defaultProps,
    component: baseComponentMap[meta.id] || FallbackComponent,
  }
})

// 合并后完整的组件注册表
export const fullComponentRegistry = [...componentRegistry, ...baseRegistry]

export const getComponentById = (id: string): ComponentMeta | undefined => {
  return fullComponentRegistry.find((c) => c.id === id)
}

export const getComponentsByCategory = (
  category: ComponentCategory,
): ComponentMeta[] => {
  return fullComponentRegistry.filter((c) => c.category === category)
}

// 保留原有导出保持兼容
export const getOriginalComponentById = (
  id: string,
): ComponentMeta | undefined => {
  return componentRegistry.find((c) => c.id === id)
}
