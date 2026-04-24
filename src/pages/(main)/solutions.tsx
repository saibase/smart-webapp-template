import { m } from 'motion/react'
import { Link } from 'react-router'

import { StarsBackground } from '~/components/ui/background'
import { Button } from '~/components/ui/button'

export const Component = () => {
  const solutions = [
    {
      icon: 'i-mingcute-bank-card-2-line',
      title: '金融科技',
      description:
        '为金融机构提供智能风控、精准营销、智能投顾等解决方案，提升风险管理能力和客户体验。',
      features: ['智能风控系统', '反欺诈检测', '客户画像分析', '智能投顾平台'],
      color: 'blue',
    },
    {
      icon: 'i-mingcute-industry-line',
      title: '智能制造',
      description:
        '基于工业物联网和大数据分析，实现生产过程智能化管理，提升生产效率，降低运营成本。',
      features: [
        '设备预测性维护',
        '生产过程监控',
        '质量智能检测',
        '能源管理优化',
      ],
      color: 'green',
    },
    {
      icon: 'i-mingcute-city-line',
      title: '智慧城市',
      description:
        '整合城市各类信息资源，构建智慧城市大脑，提升城市管理水平和居民生活质量。',
      features: [
        '智慧交通管理',
        '智能安防监控',
        '环境监测预警',
        '城市应急指挥',
      ],
      color: 'purple',
    },
    {
      icon: 'i-mingcute-heart-pulse-line',
      title: '医疗健康',
      description:
        '利用AI和大数据技术，辅助医疗诊断，提升医疗效率，优化患者体验，推动医疗智能化。',
      features: [
        '医学影像辅助诊断',
        '医疗大数据分析',
        '智慧医院管理',
        '远程医疗平台',
      ],
      color: 'red',
    },
    {
      icon: 'i-mingcute-graduation-cap-line',
      title: '教育科技',
      description:
        '个性化智能教育解决方案，提升教学效果，促进教育公平，推动教育数字化转型。',
      features: [
        '智能教学系统',
        '个性化学习推荐',
        '在线考试评估',
        '教育大数据分析',
      ],
      color: 'orange',
    },
    {
      icon: 'i-mingcute-truck-line',
      title: '智慧物流',
      description:
        '智能物流管理平台，优化运输路径，提升仓储效率，降低物流成本，增强供应链韧性。',
      features: [
        '智能路径规划',
        '仓储管理系统',
        '货物跟踪溯源',
        '供应链协同平台',
      ],
      color: 'cyan',
    },
  ]

  const features = [
    {
      number: '1',
      title: '深度行业洞察',
      description: '深入理解行业特性和业务痛点，提供量身定制的解决方案',
    },
    {
      number: '2',
      title: '端到端交付',
      description: '从咨询规划到实施运维，提供一站式全流程服务',
    },
    {
      number: '3',
      title: '持续迭代优化',
      description: '与客户共同成长，持续优化产品，支撑业务发展',
    },
    {
      number: '4',
      title: '专业技术团队',
      description: '资深专家团队，丰富行业经验，保障项目成功',
    },
  ]

  const bgColorMap: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-green-500 to-emerald-400',
    purple: 'from-purple-500 to-pink-400',
    red: 'from-red-500 to-rose-400',
    orange: 'from-orange-500 to-amber-400',
    cyan: 'from-cyan-500 to-teal-400',
  }

  const textColorMap: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    cyan: 'text-cyan-600',
  }

  const bgLightColorMap: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
  }

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
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-6">
              行业解决方案
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              我们在多个行业拥有丰富的实践经验，基于对行业的深刻理解，为不同行业客户提供量身定制的数字化转型解决方案，
              帮助客户实现业务创新和增长。
            </p>
          </m.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="-mt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <m.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-background rounded-xl overflow-hidden border border-border shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={`h-40 bg-gradient-to-br ${bgColorMap[solution.color]} relative flex items-center justify-center`}
                >
                  <i className={`${solution.icon} w-16 h-16 text-white/30`} />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${bgLightColorMap[solution.color]} flex items-center justify-center`}
                    >
                      <i
                        className={`${solution.icon} w-6 h-6 ${textColorMap[solution.color]}`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-text">
                      {solution.title}
                    </h3>
                  </div>
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {solution.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <i
                          className={`i-mingcute-check-circle-fill w-4 h-4 ${textColorMap[solution.color]}`}
                        />
                        <span className="text-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button
                      variant="primary"
                      className={`w-full bg-gradient-to-r ${bgColorMap[solution.color]} border-0 hover:opacity-90`}
                    >
                      了解详情
                    </Button>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              为什么选择我们
            </h2>
            <p className="text-xl text-text-secondary">
              专业的团队，丰富的经验，完善的服务体系，保障项目成功落地
            </p>
          </m.div>

          <div className="max-w-4xl mx-auto">
            {features.map((item, index) => (
              <m.div
                key={item.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start mb-12 last:mb-0"
              >
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">
                    {item.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-text mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Showcase */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              成功案例
            </h2>
            <p className="text-xl text-text-secondary">
              看看我们如何帮助客户实现数字化转型，创造商业价值
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-sm font-medium opacity-90 mb-4">
                  客户案例 · 大型国有银行
                </div>
                <h3 className="text-3xl font-bold mb-6">智能风控平台建设</h3>
                <p className="text-lg opacity-90 mb-6 leading-relaxed">
                  通过AI技术构建智能风控平台，实现信贷全流程智能化风险管理，
                  帮助客户降低不良贷款率30%，审批效率提升5倍，年节约成本数亿元。
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">30%</div>
                    <div className="text-sm opacity-80">不良率降低</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">5x</div>
                    <div className="text-sm opacity-80">效率提升</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">亿级</div>
                    <div className="text-sm opacity-80">年节约成本</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  查看完整案例
                  <i className="i-mingcute-arrow-right-line w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>模型准确率</span>
                    <span>96.5%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '96.5%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>审批效率提升</span>
                    <span>500%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '500%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-white rounded-full w-5/5"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>风险覆盖率</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '92%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>客户满意度</span>
                    <span>98%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '98%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 1.1 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background-secondary rounded-2xl p-10 md:p-16 text-center border border-border"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              您所在行业需要什么样的解决方案？
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              联系我们，我们的行业专家将为您提供专业咨询，定制专属解决方案
            </p>
            <Button
              asChild
              variant="primary"
              className="bg-accent text-background hover:bg-accent/80 border-0 px-8 py-3 h-auto text-base font-medium"
            >
              <Link to="/contact">立即咨询</Link>
            </Button>
          </m.div>
        </div>
      </section>
    </div>
  )
}
