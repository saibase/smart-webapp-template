import { m } from 'motion/react'

import { StarsBackground } from '~/components/ui/background'
import { Button } from '~/components/ui/button'

export const Component = () => {
  const products = [
    {
      icon: 'i-mingcute-brain-2-line',
      title: 'AI智能分析平台',
      tag: '人工智能',
      description:
        '基于深度学习的大数据分析平台，提供智能预测、异常检测、用户画像等功能，帮助企业从数据中挖掘价值。',
      features: ['智能预测分析', '自动异常检测', '用户行为分析', '可视化报表'],
      image: 'from-blue-500 to-cyan-400',
    },
    {
      icon: 'i-mingcute-cloud-server-line',
      title: '云原生PaaS平台',
      tag: '云计算',
      description:
        '一站式云原生应用开发平台，提供容器编排、微服务治理、持续交付等能力，加速企业应用开发。',
      features: ['Kubernetes编排', '微服务治理', 'DevOps工具链', '弹性伸缩'],
      image: 'from-indigo-500 to-purple-400',
    },
    {
      icon: 'i-mingcute-database-2-line',
      title: '大数据中台',
      tag: '大数据',
      description:
        '企业级数据中台解决方案，整合多源数据，构建统一数据资产，提供数据治理和分析能力。',
      features: ['数据采集清洗', '数据仓库建设', '数据治理', '实时计算'],
      image: 'from-green-500 to-emerald-400',
    },
    {
      icon: 'i-mingcute-radar-line',
      title: '物联网平台',
      tag: '物联网',
      description:
        '连接海量设备，提供设备管理、数据采集、远程控制、规则引擎等能力，构建物联网应用。',
      features: ['海量设备接入', '实时数据处理', '边缘计算', '规则引擎'],
      image: 'from-orange-500 to-red-400',
    },
    {
      icon: 'i-mingcute-lock-key-line',
      title: '零信任安全平台',
      tag: '网络安全',
      description:
        '基于零信任架构的企业安全平台，提供身份认证、访问控制、威胁检测等全方位安全防护。',
      features: ['身份管理', '动态访问控制', '威胁检测', '安全审计'],
      image: 'from-red-500 to-pink-400',
    },
    {
      icon: 'i-mingcute-code-line',
      title: '低代码开发平台',
      tag: '开发工具',
      description:
        '可视化低代码开发平台，拖拽式开发，快速构建企业应用，降低开发门槛，提升交付效率。',
      features: ['可视化设计', '拖拽开发', '组件复用', '一键部署'],
      image: 'from-teal-500 to-blue-400',
    },
  ]

  const process = [
    {
      step: '01',
      title: '需求调研',
      description: '深入了解客户业务，分析痛点，明确需求目标',
    },
    {
      step: '02',
      title: '方案设计',
      description: '基于需求设计技术方案，架构设计，产品规划',
    },
    {
      step: '03',
      title: '开发实施',
      description: '敏捷开发，快速迭代，持续交付，保证质量',
    },
    {
      step: '04',
      title: '上线运维',
      description: '协助部署上线，提供培训，持续运维支持',
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
              产品服务
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              我们提供全方位的技术产品和服务，从AI到云计算，从大数据到物联网，
              助力企业数字化转型，创造商业价值。
            </p>
          </m.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="-mt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <m.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-background rounded-xl overflow-hidden border border-border shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${product.image} relative flex items-center justify-center`}
                >
                  <i className={`${product.icon} w-20 h-20 text-white/30`} />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-background">
                      {product.tag}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <i className={`${product.icon} w-6 h-6 text-accent`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-text mb-2">
                        {product.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {product.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-text-secondary"
                      >
                        <i className="i-mingcute-check-fill w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="primary" className="w-full">
                    了解详情
                    <i className="i-mingcute-arrow-right-line w-4 h-4 ml-2" />
                  </Button>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              服务流程
            </h2>
            <p className="text-xl text-text-secondary">
              标准化的服务流程，保证项目质量和交付效率
            </p>
          </m.div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <m.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-border" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6 relative z-10">
                    <span className="text-xl font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Advantages */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              技术优势
            </h2>
            <p className="text-xl text-text-secondary">
              我们持续投入技术研发，保持技术领先性
            </p>
          </m.div>

          <div className="grid md:grid-cols-3 gap-8">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="p-6 rounded-xl border border-border bg-background"
            >
              <i className="i-mingcute-rocket-line w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">
                前沿技术栈
              </h3>
              <p className="text-text-secondary">
                采用最新的技术架构和开发工具，保证产品的先进性和可扩展性，降低技术债务。
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl border border-border bg-background"
            >
              <i className="i-mingcute-shield-check-line w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">安全可靠</h3>
              <p className="text-text-secondary">
                从设计到开发全程重视安全，遵循安全最佳实践，多层防护保障业务安全。
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl border border-border bg-background"
            >
              <i className="i-mingcute-chart-line w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">高性能</h3>
              <p className="text-text-secondary">
                性能优化贯穿全程，支持高并发访问，快速响应，带给用户流畅的使用体验。
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl border border-border bg-background"
            >
              <i className="i-mingcute-expand-diagonal-line w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">弹性扩展</h3>
              <p className="text-text-secondary">
                微服务架构设计，支持水平扩展，随着业务增长灵活调整资源，降低成本。
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-xl border border-border bg-background"
            >
              <i className="i-mingcute-git-merge-line w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">敏捷开发</h3>
              <p className="text-text-secondary">
                敏捷开发方法论，小步快跑，快速迭代，持续交付，及时响应需求变化。
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-xl border border-border bg-background"
            >
              <i className="i-mingcute-customer-service-2-line w-12 h-12 text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">专业服务</h3>
              <p className="text-text-secondary">
                专业的服务团队，提供全方位技术支持，7x24小时响应，保障业务稳定运行。
              </p>
            </m.div>
          </div>
        </div>
      </section>
    </div>
  )
}
