import { m } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { StarsBackground } from '~/components/ui/background'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input/Input'
import { Textarea } from '~/components/ui/input/Textarea'
import { Label } from '~/components/ui/label/Label'

export const Component = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success('提交成功！我们会尽快与您联系。', {
      description: '感谢您的咨询，我们的销售顾问会在1-2个工作日内与您联系。',
    })

    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      message: '',
    })
    setIsSubmitting(false)
  }

  const contactInfo = [
    {
      icon: 'i-mingcute-map-pin-line',
      title: '公司地址',
      content: '北京市海淀区中关村科技园区8号楼',
    },
    {
      icon: 'i-mingcute-phone-line',
      title: '联系电话',
      content: '400-888-8888',
      subContent: '周一至周五 9:00-18:00',
    },
    {
      icon: 'i-mingcute-mail-line',
      title: '电子邮箱',
      content: 'contact@techcorp.com',
      subContent: '欢迎随时发送邮件咨询',
    },
    {
      icon: 'i-mingcute-wechat-line',
      title: '官方微信',
      content: 'TechCorp官微',
      subContent: '扫码关注获取最新资讯',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background-secondary pt-20 pb-32">
        <StarsBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-6">
              联系我们
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              无论您有任何问题或需求，都欢迎随时联系我们。我们的专业团队将竭诚为您服务，
              为您提供最佳的解决方案。
            </p>
          </m.div>
        </div>
      </section>

      <section className="-mt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Contact Form */}
              <m.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-8 md:p-12"
              >
                <h2 className="text-2xl font-bold text-text mb-6">在线咨询</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="请输入您的姓名"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">公司名称</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="请输入公司名称"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="请输入您的邮箱"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">电话</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="请输入您的联系电话"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">需求描述</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="请简要描述您的需求"
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/90 py-3 h-auto text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="i-mingcute-spinner-line w-4 h-4 mr-2 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        提交咨询
                        <i className="i-mingcute-arrow-right-line w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </m.div>

              {/* Contact Information */}
              <m.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 md:p-12 text-white"
              >
                <h2 className="text-2xl font-bold mb-8">联系方式</h2>
                <div className="space-y-8">
                  {contactInfo.map((item, index) => (
                    <m.div
                      key={item.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`${item.icon} w-6 h-6 text-white`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {item.title}
                        </h3>
                        <div className="text-white/90">{item.content}</div>
                        {item.subContent && (
                          <div className="text-white/70 text-sm mt-1">
                            {item.subContent}
                          </div>
                        )}
                      </div>
                    </m.div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/20">
                  <h3 className="font-semibold text-lg mb-4">办公时间</h3>
                  <div className="space-y-2 text-white/90">
                    <div className="flex justify-between">
                      <span>周一至周五</span>
                      <span>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>周六</span>
                      <span>10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>周日及法定节假日</span>
                      <span>休息</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="font-semibold text-lg mb-4">关注我们</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <i className="i-mingcute-wechat-fill w-5 h-5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <i className="i-mingcute-weibo-fill w-5 h-5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <i className="i-mingcute-github-fill w-5 h-5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <i className="i-mingcute-linkedin-fill w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
              </m.div>
            </div>
          </div>

          {/* Map Placeholder */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl overflow-hidden border border-border"
          >
            <div className="h-80 bg-fill flex items-center justify-center">
              <div className="text-center">
                <i className="i-mingcute-map-line w-16 h-16 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">公司位置地图</p>
                <p className="text-text-tertiary text-sm mt-1">
                  北京市海淀区中关村科技园区8号楼
                </p>
              </div>
            </div>
          </m.div>

          {/* FAQ Section */}
          <div className="mt-20">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                常见问题
              </h2>
              <p className="text-xl text-text-secondary">
                这里解答了客户经常咨询的问题，如果您有其他问题，欢迎联系我们
              </p>
            </m.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: '你们提供哪些类型的服务？',
                  a: '我们提供人工智能、云计算、大数据、物联网、网络安全等多个领域的产品和解决方案，覆盖金融、制造、城市、医疗、教育等多个行业，可以根据客户需求提供定制化开发和咨询服务。',
                },
                {
                  q: '项目交付周期一般是多久？',
                  a: '项目交付周期根据项目规模和复杂度不同而有所差异，小型项目一般1-3个月，中型项目3-6个月，大型项目6个月以上。我们会在项目启动前给出详细的项目计划和时间安排。',
                },
                {
                  q: '如何收费？定价模式是怎样的？',
                  a: '我们根据项目需求提供灵活的定价模式，可以按项目一次性收费，也可以按人力投入按时收费，对于长期合作客户还可以提供年包服务。具体价格会根据项目需求评估后给出报价。',
                },
                {
                  q: '项目交付后提供哪些售后服务？',
                  a: '我们提供一年免费质保服务，包括bug修复、性能优化和使用培训。质保期后可以签订运维服务合同，提供持续的技术支持和版本升级服务。',
                },
                {
                  q: '是否可以提供上门服务？',
                  a: '对于重要项目，我们可以安排专业技术人员提供上门服务，包括需求调研、现场实施、培训交付等。具体可以咨询我们的销售顾问。',
                },
              ].map((item, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-background overflow-hidden"
                >
                  <details className="group">
                    <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between">
                      <span className="text-lg font-medium text-text">
                        {item.q}
                      </span>
                      <i className="i-mingcute-down-line w-5 h-5 text-text-secondary group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-4 text-text-secondary leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
