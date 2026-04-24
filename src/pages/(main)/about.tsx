import { m } from 'motion/react'

import { StarsBackground } from '~/components/ui/background'

export const Component = () => {
  const team = [
    {
      name: '张明',
      position: '创始人 & CEO',
      avatar: 'bg-gradient-to-br from-blue-500 to-blue-600',
      intro: '前谷歌高级工程师，拥有15年互联网技术经验',
    },
    {
      name: '李华',
      position: '技术总监',
      avatar: 'bg-gradient-to-br from-green-500 to-green-600',
      intro: '原阿里云架构师，精通云原生和大数据技术',
    },
    {
      name: '王芳',
      position: '产品总监',
      avatar: 'bg-gradient-to-br from-purple-500 to-purple-600',
      intro: '十年产品经验，擅长To B产品设计和用户体验',
    },
    {
      name: '赵强',
      position: '解决方案总监',
      avatar: 'bg-gradient-to-br from-orange-500 to-orange-600',
      intro: '资深行业顾问，帮助百家企业实现数字化转型',
    },
  ]

  const milestones = [
    {
      year: '2012',
      title: '公司成立',
      description: '在北京中关村创立，专注企业级软件开发',
    },
    {
      year: '2015',
      title: 'AI实验室成立',
      description: '组建人工智能研发团队，开始布局AI技术',
    },
    {
      year: '2018',
      title: '获得A轮融资',
      description: '完成千万级A轮融资，扩大产品线和团队规模',
    },
    {
      year: '2020',
      title: '云平台上线',
      description: '推出自主研发的云原生PaaS平台，服务客户超200家',
    },
    {
      year: '2023',
      title: '品牌升级',
      description: '完成品牌升级，拓展多个垂直行业解决方案',
    },
    {
      year: '未来',
      title: '持续创新',
      description: '持续投入技术研发，引领行业数字化转型',
    },
  ]

  const values = [
    {
      icon: 'i-mingcute-lightbulb-line',
      title: '创新驱动',
      description: '持续探索前沿技术，为客户创造价值',
    },
    {
      icon: 'i-mingcute-handshake-line',
      title: '诚信共赢',
      description: '坚持诚信经营，与客户共同成长',
    },
    {
      icon: 'i-mingcute-users-line',
      title: '客户至上',
      description: '深入理解需求，提供超越期望的服务',
    },
    {
      icon: 'i-mingcute-award-line',
      title: '追求卓越',
      description: '精益求精，打造高品质产品和服务',
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
              关于我们
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              TechCorp
              成立于2012年，是国内领先的企业数字化转型解决方案提供商。我们以技术创新为核心驱动力，
              致力于帮助传统企业拥抱数字变革，提升核心竞争力。
            </p>
          </m.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="-mt-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border border-border"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-text mb-6">
                  我们的使命
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-4">
                  我们坚信科技能够改变世界，通过技术创新推动产业升级，让每个企业都能享受到科技进步带来的红利。
                </p>
                <p className="text-text-secondary text-lg leading-relaxed">
                  十年来，我们已经帮助超过500家企业实现了数字化转型，涵盖金融、制造、医疗、教育等多个行业，
                  积累了丰富的实践经验和行业洞察。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    500+
                  </div>
                  <div className="text-sm text-text-secondary">服务客户</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    10+
                  </div>
                  <div className="text-sm text-text-secondary">年行业经验</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    100+
                  </div>
                  <div className="text-sm text-text-secondary">专业团队</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    30+
                  </div>
                  <div className="text-sm text-text-secondary">行业覆盖</div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              核心价值观
            </h2>
            <p className="text-xl text-text-secondary">
              我们坚信这些价值观是公司持续发展的基石
            </p>
          </m.div>

          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <m.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${value.icon} w-8 h-8 text-accent`} />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">
                  {value.title}
                </h3>
                <p className="text-text-secondary">{value.description}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development History */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              发展历程
            </h2>
            <p className="text-xl text-text-secondary">
              见证我们一步步成长的足迹
            </p>
          </m.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((item, index) => (
              <m.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 sm:pl-32 py-6 group"
              >
                {/* Timeline line */}
                <div className="flex flex-col sm:flex-row items-start mb-1 group-hover:text-accent transition-colors">
                  <div className="absolute left-0 sm:left-16 top-6 w-3 h-3 bg-background border-2 border-accent rounded-full" />
                  <div className="w-16 sm:w-24 absolute -left-2 sm:left-0 top-6 font-bold text-accent text-xl">
                    {item.year}
                  </div>
                  <div className="pt-1 sm:pt-0">
                    <h3 className="text-2xl font-bold text-text group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>
                {index < milestones.length - 1 && (
                  <div className="absolute left-1 top-12 bottom-0 w-px bg-border" />
                )}
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              核心团队
            </h2>
            <p className="text-xl text-text-secondary">
              来自顶尖科技公司，拥有丰富的行业经验
            </p>
          </m.div>

          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <m.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-background rounded-xl overflow-hidden border border-border transition-all"
              >
                <div className={`h-48 ${member.avatar} relative`} />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text mb-1">
                    {member.name}
                  </h3>
                  <div className="text-accent text-sm font-medium mb-3">
                    {member.position}
                  </div>
                  <p className="text-text-secondary text-sm">{member.intro}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
