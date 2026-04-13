import { TnActionSheet } from '~/modules/editor/tuniao/components/TnActionSheet'
import { TnAvatar } from '~/modules/editor/tuniao/components/TnAvatar'
import { TnBadge } from '~/modules/editor/tuniao/components/TnBadge'
import { TnButton } from '~/modules/editor/tuniao/components/TnButton'
import { TnCalendar } from '~/modules/editor/tuniao/components/TnCalendar'
import { TnCard } from '~/modules/editor/tuniao/components/TnCard'
import { TnCheckbox } from '~/modules/editor/tuniao/components/TnCheckbox'
import { TnCircleProgress } from '~/modules/editor/tuniao/components/TnCircleProgress'
import { TnCode } from '~/modules/editor/tuniao/components/TnCode'
import { TnCollapse } from '~/modules/editor/tuniao/components/TnCollapse'
import { TnCountdown } from '~/modules/editor/tuniao/components/TnCountdown'
import { TnDatePicker } from '~/modules/editor/tuniao/components/TnDatePicker'
import { TnDivider } from '~/modules/editor/tuniao/components/TnDivider'
import { TnDrawer } from '~/modules/editor/tuniao/components/TnDrawer'
import { TnEmpty } from '~/modules/editor/tuniao/components/TnEmpty'
import { TnForm } from '~/modules/editor/tuniao/components/TnForm'
import { TnGridList } from '~/modules/editor/tuniao/components/TnGridList'
import { TnIcon } from '~/modules/editor/tuniao/components/TnIcon'
import { TnInput } from '~/modules/editor/tuniao/components/TnInput'
import { TnList } from '~/modules/editor/tuniao/components/TnList'
import { TnLoading } from '~/modules/editor/tuniao/components/TnLoading'
import { TnModal } from '~/modules/editor/tuniao/components/TnModal'
// Import all 图鸟 components (named exports)
import { TnNavbar } from '~/modules/editor/tuniao/components/TnNavbar'
import { TnNoticeBar } from '~/modules/editor/tuniao/components/TnNoticeBar'
import { TnPagination } from '~/modules/editor/tuniao/components/TnPagination'
import { TnPopup } from '~/modules/editor/tuniao/components/TnPopup'
import { TnProgress } from '~/modules/editor/tuniao/components/TnProgress'
import { TnRadio } from '~/modules/editor/tuniao/components/TnRadio'
import { TnRate } from '~/modules/editor/tuniao/components/TnRate'
import { TnResult } from '~/modules/editor/tuniao/components/TnResult'
import { TnSearch } from '~/modules/editor/tuniao/components/TnSearch'
import { TnSelect } from '~/modules/editor/tuniao/components/TnSelect'
import { TnSkeleton } from '~/modules/editor/tuniao/components/TnSkeleton'
import { TnSlider } from '~/modules/editor/tuniao/components/TnSlider'
import { TnSteps } from '~/modules/editor/tuniao/components/TnSteps'
import { TnSticky } from '~/modules/editor/tuniao/components/TnSticky'
import { TnSwiper } from '~/modules/editor/tuniao/components/TnSwiper'
import { TnSwitch } from '~/modules/editor/tuniao/components/TnSwitch'
import { TnTabbar } from '~/modules/editor/tuniao/components/TnTabbar'
import { TnTag } from '~/modules/editor/tuniao/components/TnTag'
import { TnTextarea } from '~/modules/editor/tuniao/components/TnTextarea'
import { TnToast } from '~/modules/editor/tuniao/components/TnToast'
import { TnUpload } from '~/modules/editor/tuniao/components/TnUpload'
import { tuniaoComponents } from '~/modules/editor/tuniao/tuniao-data'

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

// 图鸟组件映射表
const tuniaoComponentMap: Record<string, React.ComponentType<any>> = {
  navbar: TnNavbar,
  tabbar: TnTabbar,
  search: TnSearch,
  swiper: TnSwiper,
  gridList: TnGridList,
  card: TnCard,
  textarea: TnTextarea,
  form: TnForm,
  checkbox: TnCheckbox,
  radio: TnRadio,
  select: TnSelect,
  upload: TnUpload,
  rate: TnRate,
  slider: TnSlider,
  switch: TnSwitch,
  code: TnCode,
  divider: TnDivider,
  tag: TnTag,
  progress: TnProgress,
  avatar: TnAvatar,
  list: TnList,
  countdown: TnCountdown,
  skeleton: TnSkeleton,
  badge: TnBadge,
  calendar: TnCalendar,
  modal: TnModal,
  actionSheet: TnActionSheet,
  input: TnInput,
  button: TnButton,
  collapse: TnCollapse,
  popup: TnPopup,
  steps: TnSteps,
  sticky: TnSticky,
  empty: TnEmpty,
  noticeBar: TnNoticeBar,
  loading: TnLoading,
  circleProgress: TnCircleProgress,
  pagination: TnPagination,
  drawer: TnDrawer,
  datePicker: TnDatePicker,
  icon: TnIcon,
  result: TnResult,
  toast: TnToast,
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

const tuniaoRegistry: ComponentMeta[] = tuniaoComponents.map((meta) => {
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
    id: `tn-${meta.id}`,
    name: meta.title,
    category,
    defaultProps,
    component: tuniaoComponentMap[meta.id] || FallbackComponent,
  }
})

// 合并后完整的组件注册表
export const fullComponentRegistry = [...componentRegistry, ...tuniaoRegistry]

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
