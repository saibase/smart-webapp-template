import { m } from 'motion/react'
import { Link } from 'react-router'

import { StarsBackground } from '~/components/ui/background'
import { Button } from '~/components/ui/button'

export const Component = () => {
  const features = [
    {
      icon: 'i-mingcute-brain-line',
      title: '人工智能',
      description:
        '基于深度学习的AI解决方案，助力企业智能化升级，提升效率降低成本',
    },
    {
      icon: 'i-mingcute-cloud-line',
      title: '云计算',
      description: '弹性可扩展的云基础设施，提供稳定可靠的计算、存储和网络服务',
    },
    {
      icon: 'i-mingcute-database-line',
      title: '大数据',
      description: '全方位数据采集、存储、分析和挖掘，让数据驱动业务决策',
    },
    {
      icon: 'i-mingcute-wifi-line',
      title: '物联网',
      description: '连接万物，实现智能感知和远程控制，打造智能化生态系统',
    },
    {
      icon: 'i-mingcute-blockchain-line',
      title: '区块链',
      description: '安全可靠的分布式账本技术，保障数据可信和业务透明',
    },
    {
      icon: 'i-mingcute-shield-check-line',
      title: '网络安全',
      description: '全方位安全防护体系，保护企业数据和业务免受网络威胁',
    },
  ]

  const stats = [
    { number: '10+', label: '年行业经验' },
    { number: '500+', label: '服务客户' },
    { number: '100+', label: '专业团队' },
    { number: '98%', label: '客户满意度' },
  ]

  const cases = [
    {
      title: '金融智能风控系统',
      category: '金融科技',
      image: 'bg-gradient-to-br from-blue-500 to-cyan-400',
      description: '基于AI的智能风控平台，帮助银行降低不良贷款率30%',
    },
    {
      title: '智能制造工厂',
      category: '工业制造',
      image: 'bg-gradient-to-br from-green-500 to-emerald-400',
      description: '物联网+大数据，实现生产全流程智能化管理，效率提升45%',
    },
    {
      title: '智慧城市大脑',
      category: '城市管理',
      image: 'bg-gradient-to-br from-purple-500 to-pink-400',
      description: '整合城市数据资源，提升城市管理效率和居民生活体验',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Star Background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background-secondary min-h-[90vh] flex items-center">
        <StarsBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                引领科技创新 · 赋能数字未来
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-6">
                科技赋能
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  创造智慧未来
                </span>
              </h1>
              <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-3xl mx-auto">
                TechCorp
                专注于为企业提供全方位的数字化转型解决方案，通过人工智能、云计算、大数据等前沿技术，
                帮助企业实现创新增长，构建竞争优势。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  variant="primary"
                  className="bg-accent text-background hover:bg-accent/80 border-0 px-8 py-4 h-auto text-lg font-medium"
                >
                  <Link to="/contact">
                    咨询合作
                    <i className="i-mingcute-arrow-right-line w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-text-secondary hover:text-text px-8 py-4 h-auto text-lg font-medium"
                >
                  <Link to="/products">
                    <i className="i-mingcute-play-circle-line w-5 h-5 mr-2" />
                    了解产品
                  </Link>
                </Button>
              </div>
            </m.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <m.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <i className="i-mingcute-arrow-down-line w-6 h-6 text-text-tertiary" />
        </m.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <m.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-text-secondary">{stat.label}</div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-text mb-4"
            >
              核心技术能力
            </m.h2>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-text-secondary"
            >
              我们拥有领先的技术栈和专业团队，为各行业提供定制化解决方案
            </m.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <m.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-6 rounded-xl border border-border bg-background hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-blue-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className={`${feature.icon} w-7 h-7 text-white`} />
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-text mb-4"
            >
              成功案例
            </m.h2>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-text-secondary"
            >
              我们已经帮助众多行业客户实现数字化转型，创造商业价值
            </m.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cases.map((item, index) => (
              <m.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-xl overflow-hidden bg-background border border-border group cursor-pointer transition-all"
              >
                <div className={`h-48 ${item.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-background">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
              </m.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="ghost" className="text-accent hover:text-accent">
              查看更多案例
              <i className="i-mingcute-arrow-right-line w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-10 md:p-16 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好开始您的数字化转型之旅了吗？
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              联系我们，获取专业的咨询和定制化解决方案，让科技助力您的业务腾飞
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="primary"
                className="bg-white text-blue-600 hover:bg-white/90 border-0 px-8 py-3 h-auto text-base font-medium"
              >
                <Link to="/contact">立即咨询</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-white border-white/30 hover:bg-white/10 px-8 py-3 h-auto text-base font-medium"
              >
                <Link to="/about">了解更多</Link>
              </Button>
            </div>
          </m.div>
        </div>
      </section>
    </div>
  )
}
